// src/services/seo.service.ts
import prisma from '../config/database';
import logger from '../utils/logger';
import axios from 'axios';
import { Language } from '@prisma/client';

// Configuración de OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface GenerateSEOInput {
  entityType: string;
  entityId?: string;
  slug?: string;
  data: Record<string, any>; // Datos de la entidad para rellenar variables
}

interface SEOResult {
  metaTitle: string;
  metaDescription: string;
  llmFaq: Array<{ question: string; answer: string }>;
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
        throw new Error('OPENAI_API_KEY no configurada');
      }

      // Aplicar variables al prompt
      const processedPrompt = this.applyTemplate(prompt, entityData);

      logger.info('Generating FAQ with OpenAI...');
      logger.debug('Prompt:', processedPrompt.substring(0, 200) + '...');

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

      const parsed = JSON.parse(content);

      // Normalizar respuesta - esperamos {faq: [{question, answer}]}
      const faq = parsed.faq || parsed.questions || parsed;

      if (!Array.isArray(faq)) {
        throw new Error('Invalid FAQ format from OpenAI');
      }

      logger.info(`Generated ${faq.length} FAQ items`);
      return faq.slice(0, 5); // Limitar a 5 preguntas
    } catch (error: any) {
      logger.error('Error generating FAQ with OpenAI:', error.response?.data || error.message);
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
        llmFaq = await this.generateFAQ(config.qaPrompt, input.data);
      }

      return {
        metaTitle,
        metaDescription,
        llmFaq,
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
      const existingSEO = await prisma.sEO.findFirst({
        where: {
          entityType: input.entityType,
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
            autoGenerated: true,
            lastRegenerated: new Date(),
          },
        });
      } else {
        // Crear nuevo
        return await prisma.sEO.create({
          data: {
            entityType: input.entityType,
            entityId: input.entityId,
            slug: input.slug,
            metaTitle: seoData.metaTitle,
            metaDescription: seoData.metaDescription,
            llmFaq: seoData.llmFaq as any,
            autoGenerated: true,
            lastRegenerated: new Date(),
          },
        });
      }
    } catch (error: any) {
      logger.error('Error saving SEO:', error);
      throw error;
    }
  }

  /**
   * Generar y guardar SEO (proceso completo)
   */
  static async generateAndSave(input: GenerateSEOInput) {
    try {
      const seoData = await this.generateSEO(input);
      const saved = await this.saveSEO(input, seoData);
      logger.info(`SEO generated and saved for ${input.entityType} ${input.entityId || input.slug}`);
      return saved;
    } catch (error: any) {
      logger.error('Error in generateAndSave:', error);
      throw error;
    }
  }

  /**
   * Obtener SEO de una entidad
   */
  static async getSEO(entityType: string, entityIdOrSlug: string) {
    try {
      const seo = await prisma.sEO.findFirst({
        where: {
          entityType,
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
   * Regenerar SEO (eliminar y crear de nuevo)
   */
  static async regenerateSEO(input: GenerateSEOInput) {
    try {
      // Buscar SEO existente
      const existingSEO = await prisma.sEO.findFirst({
        where: {
          entityType: input.entityType,
          ...(input.entityId ? { entityId: input.entityId } : {}),
          ...(input.slug ? { slug: input.slug } : {}),
        },
      });

      if (existingSEO) {
        await this.deleteSEO(existingSEO.id);
      }

      return await this.generateAndSave(input);
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
