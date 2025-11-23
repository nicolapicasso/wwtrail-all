// src/services/seo.service.ts
import prisma from '../config/database';
import logger from '../utils/logger';
import axios from 'axios';
import { Language, TranslationStatus } from '@prisma/client';
import { EventService } from './event.service';
import { TranslationService } from './translation.service';
import { TranslationConfig, getTargetLanguages, isAutoTranslateEnabled } from '../config/translation.config';

// Configuración de OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface GenerateSEOInput {
  entityType: string;
  entityId?: string;
  slug?: string;
  data: Record<string, any>; // Datos de la entidad para rellenar variables
  language?: Language; // Idioma del contenido SEO (default: idioma de la entidad o ES)
}

interface SEOResult {
  metaTitle: string;
  metaDescription: string;
  llmFaq: Array<{ question: string; answer: string }>;
  language: Language;
}

export class SEOService {
  /**
   * Obtener configuración de SEO para un tipo de entidad
   */
  static async getConfig(entityType: string) {
    const config = await prisma.sEOConfig.findUnique({
      where: { entityType },
    });

    if (!config) {
      logger.warn(`No SEO config found for entity type: ${entityType}`);
      return null;
    }

    return config;
  }

  /**
   * Aplicar template con variables
   * Reemplaza {name}, {location}, etc. con valores reales
   */
  private static applyTemplate(template: string, data: Record<string, any>): string {
    let result = template;

    // Reemplazar cada variable {variable} con su valor
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value !== null && value !== undefined) {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        result = result.replace(regex, String(value));
      }
    });

    // Limpiar variables no reemplazadas
    result = result.replace(/\{[^}]+\}/g, '');

    return result.trim();
  }

  /**
   * Generar FAQ con OpenAI
   */
  private static async generateFAQ(
    prompt: string,
    entityData: Record<string, any>
  ): Promise<Array<{ question: string; answer: string }>> {
    try {
      if (!OPENAI_API_KEY) {
        logger.error('❌ OPENAI_API_KEY no está configurada en las variables de entorno');
        logger.warn('⚠️  FAQ will be empty - configure OPENAI_API_KEY to generate FAQs');
        return [];
      }

      // Aplicar variables al prompt
      const processedPrompt = this.applyTemplate(prompt, entityData);

      logger.info('🤖 Generating FAQ with OpenAI GPT-4o-mini...');
      logger.debug('Prompt preview:', processedPrompt.substring(0, 200) + '...');

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'Eres un experto en SEO y trail running. Genera preguntas y respuestas optimizadas para LLMs.',
            },
            {
              role: 'user',
              content: processedPrompt,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      logger.debug('OpenAI raw response:', content.substring(0, 300));

      const parsed = JSON.parse(content);

      // Normalizar respuesta - esperamos {faq: [{question, answer}]}
      let faq = parsed.faq || parsed.questions || parsed;

      if (!Array.isArray(faq)) {
        logger.error('❌ Invalid FAQ format from OpenAI:', JSON.stringify(parsed).substring(0, 200));
        throw new Error('Invalid FAQ format from OpenAI');
      }

      // Normalizar claves de cada objeto (pregunta→question, respuesta→answer)
      faq = faq.map((item: any) => ({
        question: item.question || item.pregunta || item.q || '',
        answer: item.answer || item.respuesta || item.a || '',
      }));

      // Filtrar items vacíos
      faq = faq.filter((item) => item.question && item.answer);

      logger.info(`✅ Generated ${faq.length} FAQ items successfully`);
      return faq.slice(0, 5); // Limitar a 5 preguntas
    } catch (error: any) {
      logger.error('❌ Error generating FAQ with OpenAI:');
      if (error.response?.data) {
        logger.error('OpenAI API Error:', JSON.stringify(error.response.data));
      } else if (error.message) {
        logger.error('Error message:', error.message);
      }
      logger.warn('⚠️  FAQ will be empty due to error');
      // Retornar array vacío en caso de error, no bloquear el proceso
      return [];
    }
  }

  /**
   * Generar SEO completo para una entidad
   */
  static async generateSEO(input: GenerateSEOInput): Promise<SEOResult> {
    try {
      logger.info(`Generating SEO for ${input.entityType} ${input.entityId || input.slug}`);

      // Obtener configuración
      const config = await this.getConfig(input.entityType);

      if (!config || !config.autoGenerate) {
        logger.warn(`Auto-generate disabled for ${input.entityType}`);
        throw new Error(`Auto-generate disabled for ${input.entityType}`);
      }

      // Generar Meta Title
      const metaTitle = config.metaTitleTemplate
        ? this.applyTemplate(config.metaTitleTemplate, input.data)
        : input.data.name || input.data.title || '';

      // Generar Meta Description
      const metaDescription = config.metaDescriptionTemplate
        ? this.applyTemplate(config.metaDescriptionTemplate, input.data)
        : input.data.description || input.data.excerpt || '';

      // Generar FAQ con IA
      let llmFaq: Array<{ question: string; answer: string }> = [];
      if (config.qaPrompt) {
        logger.info('📝 Attempting to generate FAQ with AI...');
        llmFaq = await this.generateFAQ(config.qaPrompt, input.data);
        if (llmFaq.length === 0) {
          logger.warn('⚠️  FAQ generation returned empty array - check logs above for errors');
        }
      } else {
        logger.warn('⚠️  No qaPrompt configured - FAQ will be empty');
      }

      // Determinar idioma: usar el de la entidad si existe, sino el configurado, sino ES
      const language = input.language || (input.data.language as Language) || TranslationConfig.DEFAULT_LANGUAGE;

      return {
        metaTitle,
        metaDescription,
        llmFaq,
        language,
      };
    } catch (error: any) {
      logger.error('Error generating SEO:', error);
      throw error;
    }
  }

  /**
   * Guardar o actualizar SEO en base de datos
   */
  static async saveSEO(input: GenerateSEOInput, seoData: SEOResult) {
    try {
      const language = seoData.language || input.language || TranslationConfig.DEFAULT_LANGUAGE;

      const existingSEO = await prisma.sEO.findFirst({
        where: {
          entityType: input.entityType,
          language,
          ...(input.entityId ? { entityId: input.entityId } : {}),
          ...(input.slug ? { slug: input.slug } : {}),
        },
      });

      if (existingSEO) {
        // Actualizar
        return await prisma.sEO.update({
          where: { id: existingSEO.id },
          data: {
            metaTitle: seoData.metaTitle,
            metaDescription: seoData.metaDescription,
            llmFaq: seoData.llmFaq as any,
            language,
            autoGenerated: true,
            lastRegenerated: new Date(),
            translationStatus: TranslationStatus.COMPLETED,
          },
        });
      } else {
        // Crear nuevo
        return await prisma.sEO.create({
          data: {
            entityType: input.entityType,
            entityId: input.entityId,
            slug: input.slug,
            language,
            metaTitle: seoData.metaTitle,
            metaDescription: seoData.metaDescription,
            llmFaq: seoData.llmFaq as any,
            autoGenerated: true,
            lastRegenerated: new Date(),
            translationStatus: TranslationStatus.COMPLETED,
          },
        });
      }
    } catch (error: any) {
      logger.error('Error saving SEO:', error);
      throw error;
    }
  }

  /**
   * Traducir SEO a otro idioma
   */
  static async translateSEO(
    sourceSEO: SEOResult,
    sourceLanguage: Language,
    targetLanguage: Language
  ): Promise<SEOResult> {
    try {
      logger.info(`🌐 Translating SEO from ${sourceLanguage} to ${targetLanguage}...`);

      // Traducir metaTitle
      const translatedTitle = await TranslationService.translateWithAI({
        text: sourceSEO.metaTitle,
        sourceLanguage,
        targetLanguage,
        context: 'SEO meta title for trail running event',
      });

      // Traducir metaDescription
      const translatedDescription = await TranslationService.translateWithAI({
        text: sourceSEO.metaDescription,
        sourceLanguage,
        targetLanguage,
        context: 'SEO meta description for trail running event',
      });

      // Traducir FAQ
      const translatedFaq: Array<{ question: string; answer: string }> = [];
      for (const item of sourceSEO.llmFaq) {
        const translatedQuestion = await TranslationService.translateWithAI({
          text: item.question,
          sourceLanguage,
          targetLanguage,
          context: 'FAQ question about trail running event',
        });

        const translatedAnswer = await TranslationService.translateWithAI({
          text: item.answer,
          sourceLanguage,
          targetLanguage,
          context: 'FAQ answer about trail running event',
        });

        translatedFaq.push({
          question: translatedQuestion.translatedText,
          answer: translatedAnswer.translatedText,
        });
      }

      logger.info(`✅ SEO translated successfully to ${targetLanguage}`);

      return {
        metaTitle: translatedTitle.translatedText,
        metaDescription: translatedDescription.translatedText,
        llmFaq: translatedFaq,
        language: targetLanguage,
      };
    } catch (error: any) {
      logger.error(`Error translating SEO to ${targetLanguage}:`, error);
      throw error;
    }
  }

  /**
   * Generar y guardar SEO (proceso completo)
   * Genera en el idioma source y traduce automáticamente a otros idiomas si está habilitado
   */
  static async generateAndSave(input: GenerateSEOInput) {
    try {
      // Generar SEO en idioma source
      const seoData = await this.generateSEO(input);
      const saved = await this.saveSEO(input, seoData);
      logger.info(`SEO generated and saved for ${input.entityType} ${input.entityId || input.slug} in ${seoData.language}`);

      // Si la traducción automática está habilitada, traducir a otros idiomas
      if (isAutoTranslateEnabled()) {
        const targetLanguages = getTargetLanguages(seoData.language);
        logger.info(`🌐 Auto-translate enabled. Translating SEO to: ${targetLanguages.join(', ')}`);

        // Traducir en paralelo (no esperar a que termine)
        this.translateAndSaveAll(input, seoData, targetLanguages).catch((error) => {
          logger.error('Error in background translation:', error);
        });
      }

      return saved;
    } catch (error: any) {
      logger.error('Error in generateAndSave:', error);
      throw error;
    }
  }

  /**
   * Traducir y guardar SEO en todos los idiomas objetivo
   */
  private static async translateAndSaveAll(
    input: GenerateSEOInput,
    sourceSEO: SEOResult,
    targetLanguages: Language[]
  ) {
    try {
      for (const targetLang of targetLanguages) {
        try {
          const translatedSEO = await this.translateSEO(sourceSEO, sourceSEO.language, targetLang);

          await this.saveSEO(
            { ...input, language: targetLang },
            translatedSEO
          );

          logger.info(`✅ Translated and saved SEO in ${targetLang}`);
        } catch (error: any) {
          logger.error(`Failed to translate to ${targetLang}:`, error.message);
          // Continuar con el siguiente idioma aunque este falle
        }
      }
    } catch (error: any) {
      logger.error('Error in translateAndSaveAll:', error);
      throw error;
    }
  }

  /**
   * Obtener SEO de una entidad
   */
  static async getSEO(entityType: string, entityIdOrSlug: string, language: Language = Language.ES) {
    try {
      const seo = await prisma.sEO.findFirst({
        where: {
          entityType,
          language,
          OR: [{ entityId: entityIdOrSlug }, { slug: entityIdOrSlug }],
        },
      });

      return seo;
    } catch (error: any) {
      logger.error('Error getting SEO:', error);
      throw error;
    }
  }

  /**
   * Actualizar SEO manualmente
   */
  static async updateSEO(
    id: string,
    data: {
      metaTitle?: string;
      metaDescription?: string;
      llmFaq?: Array<{ question: string; answer: string }>;
    }
  ) {
    try {
      return await prisma.sEO.update({
        where: { id },
        data: {
          ...data,
          llmFaq: data.llmFaq as any,
          autoGenerated: false, // Si se edita manualmente, marcar como no auto-generado
        },
      });
    } catch (error: any) {
      logger.error('Error updating SEO:', error);
      throw error;
    }
  }

  /**
   * Eliminar SEO
   */
  static async deleteSEO(id: string) {
    try {
      return await prisma.sEO.delete({
        where: { id },
      });
    } catch (error: any) {
      logger.error('Error deleting SEO:', error);
      throw error;
    }
  }

  /**
   * Obtener datos de la entidad automáticamente
   */
  private static async fetchEntityData(entityType: string, entityIdOrSlug: string): Promise<Record<string, any>> {
    try {
      let entity: any = null;

      if (entityType === 'event') {
        // Intentar primero por ID, luego por slug
        entity = await EventService.findById(entityIdOrSlug).catch(() => null);
        if (!entity) {
          entity = await EventService.findBySlug(entityIdOrSlug);
        }
      } else if (entityType === 'competition') {
        // TODO: Implementar cuando exista CompetitionService
        throw new Error('Competition entity type not yet supported for auto-fetch');
      } else if (entityType === 'post') {
        // TODO: Implementar cuando exista PostService
        throw new Error('Post entity type not yet supported for auto-fetch');
      } else {
        throw new Error(`Unknown entity type: ${entityType}`);
      }

      if (!entity) {
        throw new Error(`Entity not found: ${entityType} ${entityIdOrSlug}`);
      }

      return entity;
    } catch (error: any) {
      logger.error('Error fetching entity data:', error);
      throw error;
    }
  }

  /**
   * Regenerar SEO (eliminar y crear de nuevo)
   * Si no se proporciona 'data', se obtendrá automáticamente de la base de datos
   * Regenera en todos los idiomas
   */
  static async regenerateSEO(input: GenerateSEOInput | { entityType: string; entityId?: string; slug?: string }) {
    try {
      // Buscar TODOS los SEOs existentes (todos los idiomas)
      const existingSEOs = await prisma.sEO.findMany({
        where: {
          entityType: input.entityType,
          ...((input as any).entityId ? { entityId: (input as any).entityId } : {}),
          ...((input as any).slug ? { slug: (input as any).slug } : {}),
        },
      });

      // Eliminar todos los idiomas existentes
      if (existingSEOs.length > 0) {
        logger.info(`🗑️  Deleting ${existingSEOs.length} existing SEO records (all languages)`);
        await prisma.sEO.deleteMany({
          where: {
            id: { in: existingSEOs.map((s) => s.id) },
          },
        });
      }

      // Si no se proporciona 'data', obtenerlo automáticamente
      let generateInput: GenerateSEOInput;
      if (!(input as GenerateSEOInput).data) {
        const entityIdOrSlug = (input as any).entityId || (input as any).slug;
        if (!entityIdOrSlug) {
          throw new Error('Either entityId or slug is required');
        }

        const entityData = await this.fetchEntityData(input.entityType, entityIdOrSlug);
        generateInput = {
          entityType: input.entityType,
          entityId: (input as any).entityId,
          slug: (input as any).slug,
          data: entityData,
        };
      } else {
        generateInput = input as GenerateSEOInput;
      }

      return await this.generateAndSave(generateInput);
    } catch (error: any) {
      logger.error('Error regenerating SEO:', error);
      throw error;
    }
  }

  /**
   * Listar todos los SEO de un tipo de entidad
   */
  static async listSEO(entityType: string, page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;

      const [seos, total] = await Promise.all([
        prisma.sEO.findMany({
          where: { entityType },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.sEO.count({
          where: { entityType },
        }),
      ]);

      return {
        data: seos,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      logger.error('Error listing SEO:', error);
      throw error;
    }
  }

  /**
   * Crear o actualizar configuración de SEO
   */
  static async upsertConfig(data: {
    entityType: string;
    metaTitleTemplate?: string;
    metaDescriptionTemplate?: string;
    qaPrompt?: string;
    availableVariables?: string[];
    autoGenerate?: boolean;
    generateOnCreate?: boolean;
    generateOnUpdate?: boolean;
  }) {
    try {
      return await prisma.sEOConfig.upsert({
        where: { entityType: data.entityType },
        create: {
          ...data,
          availableVariables: data.availableVariables as any,
        },
        update: {
          ...data,
          availableVariables: data.availableVariables as any,
        },
      });
    } catch (error: any) {
      logger.error('Error upserting SEO config:', error);
      throw error;
    }
  }

  /**
   * Listar todas las configuraciones
   */
  static async listConfigs() {
    try {
      return await prisma.sEOConfig.findMany({
        orderBy: { entityType: 'asc' },
      });
    } catch (error: any) {
      logger.error('Error listing SEO configs:', error);
      throw error;
    }
  }
}
