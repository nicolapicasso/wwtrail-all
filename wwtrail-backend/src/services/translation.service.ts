// src/services/translation.service.ts
import prisma from '../config/database';
import { cache, CACHE_TTL } from '../config/redis';
import logger from '../utils/logger';
import { Language, TranslationStatus } from '@prisma/client';
import axios from 'axios';

// Configuración de OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Mapeo de nombres de idiomas para el prompt
const LANGUAGE_NAMES: Record<Language, string> = {
  ES: 'Spanish',
  EN: 'English',
  IT: 'Italian',
  CA: 'Catalan',
  FR: 'French',
  DE: 'German',
};

interface TranslationRequest {
  text: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  context?: string; // Contexto adicional (ej: "trail running competition")
}

interface TranslationResult {
  translatedText: string;
  sourceLanguage: Language;
  targetLanguage: Language;
}

interface AutoTranslateInput {
  entityType: 'competition' | 'post' | 'event' | 'service' | 'specialSeries' | 'promotion' | 'landing';
  entityId: string;
  targetLanguages: Language[];
  overwrite?: boolean;
}

export class TranslationService {
  /**
   * Traduce un texto usando OpenAI ChatGPT
   */
  static async translateWithAI(request: TranslationRequest): Promise<TranslationResult> {
    try {
      if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY no configurada en variables de entorno');
      }

      const sourceLang = LANGUAGE_NAMES[request.sourceLanguage];
      const targetLang = LANGUAGE_NAMES[request.targetLanguage];

      const systemPrompt = `You are a professional translator specializing in trail running and outdoor sports content.
Translate the following text from ${sourceLang} to ${targetLang}.
Maintain the original tone, style, and technical terminology related to trail running.
${request.context ? `Context: ${request.context}` : ''}
Return ONLY the translated text, without any explanations or additional comments.`;

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4o-mini', // Modelo más económico y rápido
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: request.text },
          ],
          temperature: 0.3, // Baja temperatura para traducciones más consistentes
          max_tokens: 2000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const translatedText = response.data.choices[0]?.message?.content?.trim();

      if (!translatedText) {
        throw new Error('No se recibió traducción de OpenAI');
      }

      logger.info(`Traducción exitosa: ${request.sourceLanguage} → ${request.targetLanguage}`);

      return {
        translatedText,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
      };
    } catch (error: any) {
      logger.error('Error al traducir con OpenAI:', error.response?.data || error.message);
      throw new Error(`Error en traducción: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Traduce múltiples textos en una sola llamada (optimización)
   */
  static async translateMultipleTexts(
    texts: Array<{ key: string; text: string }>,
    sourceLanguage: Language,
    targetLanguage: Language,
    context?: string
  ): Promise<Record<string, string>> {
    try {
      if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY no configurada');
      }

      const sourceLang = LANGUAGE_NAMES[sourceLanguage];
      const targetLang = LANGUAGE_NAMES[targetLanguage];

      // Construir JSON con todos los textos
      const textsObject = texts.reduce((acc, item) => {
        acc[item.key] = item.text;
        return acc;
      }, {} as Record<string, string>);

      const systemPrompt = `You are a professional translator specializing in trail running and outdoor sports content.
Translate ALL the values in the following JSON object from ${sourceLang} to ${targetLang}.
${context ? `Context: ${context}` : ''}
IMPORTANT: Return ONLY a valid JSON object with the same keys but translated values. Do not include any markdown formatting, code blocks, or explanations.`;

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: JSON.stringify(textsObject, null, 2) },
          ],
          temperature: 0.3,
          max_tokens: 3000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      let translatedContent = response.data.choices[0]?.message?.content?.trim();

      if (!translatedContent) {
        throw new Error('No se recibió traducción');
      }

      // Limpiar posibles bloques de código markdown
      translatedContent = translatedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');

      const translatedObject = JSON.parse(translatedContent);

      logger.info(`Traducción múltiple exitosa: ${sourceLanguage} → ${targetLanguage} (${texts.length} textos)`);

      return translatedObject;
    } catch (error: any) {
      logger.error('Error en traducción múltiple:', error.response?.data || error.message);
      throw new Error(`Error en traducción múltiple: ${error.message}`);
    }
  }

  /**
   * Auto-traduce una competición a los idiomas especificados
   */
  static async autoTranslateCompetition(competitionId: string, targetLanguages: Language[], overwrite = false) {
    try {
      // Obtener la competición original
      const competition = await prisma.competition.findUnique({
        where: { id: competitionId },
        select: {
          id: true,
          name: true,
          description: true,
          language: true,
          translations: true,
        },
      });

      if (!competition) {
        throw new Error('Competición no encontrada');
      }

      const sourceLanguage: Language = competition.language;

      const results = [];

      for (const targetLang of targetLanguages) {
        // Verificar si ya existe traducción
        const existingTranslation = competition.translations.find((t) => t.language === targetLang);

        if (existingTranslation && !overwrite) {
          logger.info(`Traducción ya existe para ${targetLang}, se omite`);
          results.push(existingTranslation);
          continue;
        }

        // Traducir usando OpenAI
        const textsToTranslate = [
          { key: 'name', text: competition.name },
          ...(competition.description ? [{ key: 'description', text: competition.description }] : []),
        ];

        const translated = await this.translateMultipleTexts(
          textsToTranslate,
          sourceLanguage,
          targetLang,
          'trail running competition'
        );

        // Guardar o actualizar traducción
        const translationData = {
          competitionId: competition.id,
          language: targetLang,
          name: translated.name,
          description: translated.description || null,
          status: 'APPROVED' as TranslationStatus,
        };

        const savedTranslation = await prisma.competitionTranslation.upsert({
          where: {
            competitionId_language: {
              competitionId: competition.id,
              language: targetLang,
            },
          },
          update: translationData,
          create: translationData,
        });

        results.push(savedTranslation);
      }

      // Invalidar caché
      await cache.del(`competition:${competitionId}`);

      logger.info(`Auto-traducción completada para competición ${competitionId}: ${results.length} traducciones`);

      return results;
    } catch (error: any) {
      logger.error('Error en auto-traducción de competición:', error);
      throw error;
    }
  }

  /**
   * Auto-traduce un post a los idiomas especificados
   */
  static async autoTranslatePost(postId: string, targetLanguages: Language[], overwrite = false) {
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
          title: true,
          excerpt: true,
          content: true,
          language: true,
          translations: true,
        },
      });

      if (!post) {
        throw new Error('Post no encontrado');
      }

      const sourceLanguage: Language = post.language;
      const results = [];

      for (const targetLang of targetLanguages) {
        const existingTranslation = post.translations.find((t) => t.language === targetLang);

        if (existingTranslation && !overwrite) {
          logger.info(`Traducción de post ya existe para ${targetLang}`);
          results.push(existingTranslation);
          continue;
        }

        const textsToTranslate = [
          { key: 'title', text: post.title },
          ...(post.excerpt ? [{ key: 'excerpt', text: post.excerpt }] : []),
          { key: 'content', text: post.content },
        ];

        const translated = await this.translateMultipleTexts(
          textsToTranslate,
          sourceLanguage,
          targetLang,
          'trail running blog post'
        );

        const translationData = {
          postId: post.id,
          language: targetLang,
          title: translated.title,
          excerpt: translated.excerpt || null,
          content: translated.content,
          status: 'APPROVED' as TranslationStatus,
        };

        const savedTranslation = await prisma.postTranslation.upsert({
          where: {
            postId_language: {
              postId: post.id,
              language: targetLang,
            },
          },
          update: translationData,
          create: translationData,
        });

        results.push(savedTranslation);
      }

      await cache.del(`post:${postId}`);

      logger.info(`Auto-traducción de post completada: ${results.length} traducciones`);

      return results;
    } catch (error: any) {
      logger.error('Error en auto-traducción de post:', error);
      throw error;
    }
  }

  /**
   * Auto-traduce un evento
   */
  static async autoTranslateEvent(eventId: string, targetLanguages: Language[], overwrite = false) {
    try {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
          name: true,
          description: true,
          language: true,
          translations: true,
        },
      });

      if (!event) {
        throw new Error('Evento no encontrado');
      }

      const sourceLanguage: Language = event.language;
      const results = [];

      for (const targetLang of targetLanguages) {
        const existingTranslation = event.translations.find((t) => t.language === targetLang);

        if (existingTranslation && !overwrite) {
          results.push(existingTranslation);
          continue;
        }

        const textsToTranslate = [
          { key: 'name', text: event.name },
          ...(event.description ? [{ key: 'description', text: event.description }] : []),
        ];

        const translated = await this.translateMultipleTexts(
          textsToTranslate,
          sourceLanguage,
          targetLang,
          'trail running event'
        );

        const translationData = {
          eventId: event.id,
          language: targetLang,
          name: translated.name,
          description: translated.description || null,
          status: 'APPROVED' as TranslationStatus,
        };

        const savedTranslation = await prisma.eventTranslation.upsert({
          where: {
            eventId_language: {
              eventId: event.id,
              language: targetLang,
            },
          },
          update: translationData,
          create: translationData,
        });

        results.push(savedTranslation);
      }

      await cache.del(`event:${eventId}`);

      return results;
    } catch (error: any) {
      logger.error('Error en auto-traducción de evento:', error);
      throw error;
    }
  }

  /**
   * Auto-traduce un servicio
   */
  static async autoTranslateService(serviceId: string, targetLanguages: Language[], overwrite = false) {
    try {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        select: {
          id: true,
          name: true,
          description: true,
          language: true,
          translations: true,
        },
      });

      if (!service) {
        throw new Error('Servicio no encontrado');
      }

      const sourceLanguage: Language = service.language;
      const results = [];

      for (const targetLang of targetLanguages) {
        const existingTranslation = service.translations.find((t) => t.language === targetLang);

        if (existingTranslation && !overwrite) {
          results.push(existingTranslation);
          continue;
        }

        const textsToTranslate = [
          { key: 'name', text: service.name },
          ...(service.description ? [{ key: 'description', text: service.description }] : []),
        ];

        const translated = await this.translateMultipleTexts(
          textsToTranslate,
          sourceLanguage,
          targetLang,
          'service for trail runners (accommodation, restaurant, shop, etc.)'
        );

        const translationData = {
          serviceId: service.id,
          language: targetLang,
          name: translated.name,
          description: translated.description || null,
          status: 'APPROVED' as TranslationStatus,
        };

        const savedTranslation = await prisma.serviceTranslation.upsert({
          where: {
            serviceId_language: {
              serviceId: service.id,
              language: targetLang,
            },
          },
          update: translationData,
          create: translationData,
        });

        results.push(savedTranslation);
      }

      await cache.del(`service:${serviceId}`);

      return results;
    } catch (error: any) {
      logger.error('Error en auto-traducción de servicio:', error);
      throw error;
    }
  }

  /**
   * Auto-traduce una serie especial
   */
  static async autoTranslateSpecialSeries(specialSeriesId: string, targetLanguages: Language[], overwrite = false) {
    try {
      const specialSeries = await prisma.specialSeries.findUnique({
        where: { id: specialSeriesId },
        select: {
          id: true,
          name: true,
          description: true,
          language: true,
          translations: true,
        },
      });

      if (!specialSeries) {
        throw new Error('Serie especial no encontrada');
      }

      const sourceLanguage: Language = specialSeries.language;
      const results = [];

      for (const targetLang of targetLanguages) {
        const existingTranslation = specialSeries.translations.find((t) => t.language === targetLang);

        if (existingTranslation && !overwrite) {
          results.push(existingTranslation);
          continue;
        }

        const textsToTranslate = [
          { key: 'name', text: specialSeries.name },
          ...(specialSeries.description ? [{ key: 'description', text: specialSeries.description }] : []),
        ];

        const translated = await this.translateMultipleTexts(
          textsToTranslate,
          sourceLanguage,
          targetLang,
          'trail running special series or championship'
        );

        const translationData = {
          specialSeriesId: specialSeries.id,
          language: targetLang,
          name: translated.name,
          description: translated.description || null,
          status: 'APPROVED' as TranslationStatus,
        };

        const savedTranslation = await prisma.specialSeriesTranslation.upsert({
          where: {
            specialSeriesId_language: {
              specialSeriesId: specialSeries.id,
              language: targetLang,
            },
          },
          update: translationData,
          create: translationData,
        });

        results.push(savedTranslation);
      }

      await cache.del(`specialSeries:${specialSeriesId}`);

      return results;
    } catch (error: any) {
      logger.error('Error en auto-traducción de serie especial:', error);
      throw error;
    }
  }

  /**
   * Auto-traduce una promoción
   */
  static async autoTranslatePromotion(promotionId: string, targetLanguages: Language[], overwrite = false) {
    try {
      const promotion = await prisma.promotion.findUnique({
        where: { id: promotionId },
        select: {
          id: true,
          title: true,
          description: true,
          exclusiveContent: true,
          language: true,
          translations: true,
        },
      });

      if (!promotion) {
        throw new Error('Promoción no encontrada');
      }

      const sourceLanguage: Language = promotion.language;
      const results = [];

      for (const targetLang of targetLanguages) {
        const existingTranslation = promotion.translations.find((t) => t.language === targetLang);

        if (existingTranslation && !overwrite) {
          results.push(existingTranslation);
          continue;
        }

        const textsToTranslate = [
          { key: 'title', text: promotion.title },
          ...(promotion.description ? [{ key: 'description', text: promotion.description }] : []),
          ...(promotion.exclusiveContent ? [{ key: 'exclusiveContent', text: promotion.exclusiveContent }] : []),
        ];

        const translated = await this.translateMultipleTexts(
          textsToTranslate,
          sourceLanguage,
          targetLang,
          'promotional content for trail runners (brand discounts, exclusive content)'
        );

        const translationData = {
          promotionId: promotion.id,
          language: targetLang,
          title: translated.title,
          description: translated.description || null,
          exclusiveContent: translated.exclusiveContent || null,
        };

        const savedTranslation = await prisma.promotionTranslation.upsert({
          where: {
            promotionId_language: {
              promotionId: promotion.id,
              language: targetLang,
            },
          },
          update: translationData,
          create: translationData,
        });

        results.push(savedTranslation);
      }

      await cache.del(`promotion:${promotionId}`);

      return results;
    } catch (error: any) {
      logger.error('Error en auto-traducción de promoción:', error);
      throw error;
    }
  }

  /**
   * Auto-traduce una landing page
   */
  static async autoTranslateLanding(landingId: string, targetLanguages: Language[], overwrite = false) {
    try {
      const landing = await prisma.landing.findUnique({
        where: { id: landingId },
        select: {
          id: true,
          title: true,
          content: true,
          metaTitle: true,
          metaDescription: true,
          language: true,
          translations: true,
        },
      });

      if (!landing) {
        throw new Error('Landing no encontrada');
      }

      const sourceLanguage: Language = landing.language;
      const results = [];

      for (const targetLang of targetLanguages) {
        const existingTranslation = landing.translations.find((t) => t.language === targetLang);

        if (existingTranslation && !overwrite) {
          results.push(existingTranslation);
          continue;
        }

        const textsToTranslate = [
          { key: 'title', text: landing.title },
          { key: 'content', text: landing.content },
          ...(landing.metaTitle ? [{ key: 'metaTitle', text: landing.metaTitle }] : []),
          ...(landing.metaDescription ? [{ key: 'metaDescription', text: landing.metaDescription }] : []),
        ];

        const translated = await this.translateMultipleTexts(
          textsToTranslate,
          sourceLanguage,
          targetLang,
          'landing page content for trail running website'
        );

        const translationData = {
          landingId: landing.id,
          language: targetLang,
          title: translated.title,
          content: translated.content,
          metaTitle: translated.metaTitle || null,
          metaDescription: translated.metaDescription || null,
        };

        const savedTranslation = await prisma.landingTranslation.upsert({
          where: {
            landingId_language: {
              landingId: landing.id,
              language: targetLang,
            },
          },
          update: translationData,
          create: translationData,
        });

        results.push(savedTranslation);
      }

      return results;
    } catch (error: any) {
      logger.error('Error en auto-traducción de landing:', error);
      throw error;
    }
  }

  /**
   * Función genérica de auto-traducción
   */
  static async autoTranslate(input: AutoTranslateInput) {
    switch (input.entityType) {
      case 'competition':
        return this.autoTranslateCompetition(input.entityId, input.targetLanguages, input.overwrite);
      case 'post':
        return this.autoTranslatePost(input.entityId, input.targetLanguages, input.overwrite);
      case 'event':
        return this.autoTranslateEvent(input.entityId, input.targetLanguages, input.overwrite);
      case 'service':
        return this.autoTranslateService(input.entityId, input.targetLanguages, input.overwrite);
      case 'specialSeries':
        return this.autoTranslateSpecialSeries(input.entityId, input.targetLanguages, input.overwrite);
      case 'promotion':
        return this.autoTranslatePromotion(input.entityId, input.targetLanguages, input.overwrite);
      case 'landing':
        return this.autoTranslateLanding(input.entityId, input.targetLanguages, input.overwrite);
      default:
        throw new Error(`Tipo de entidad no soportado: ${input.entityType}`);
    }
  }

  // Alias methods for backwards compatibility
  static async translateEvent(eventId: string, targetLanguages: Language[]) {
    return this.autoTranslateEvent(eventId, targetLanguages, false);
  }

  static async translateCompetition(competitionId: string, targetLanguages: Language[]) {
    return this.autoTranslateCompetition(competitionId, targetLanguages, false);
  }

  static async translatePost(postId: string, targetLanguages: Language[]) {
    return this.autoTranslatePost(postId, targetLanguages, false);
  }

  static async translateService(serviceId: string, targetLanguages: Language[]) {
    return this.autoTranslateService(serviceId, targetLanguages, false);
  }

  static async translatePromotion(promotionId: string, targetLanguages: Language[]) {
    return this.autoTranslatePromotion(promotionId, targetLanguages, false);
  }

  static async translateLanding(landingId: string, targetLanguages: Language[]) {
    return this.autoTranslateLanding(landingId, targetLanguages, false);
  }

  /**
   * Obtener traducciones de una competición
   */
  static async getCompetitionTranslations(competitionId: string, language?: Language) {
    const where: any = { competitionId };
    if (language) {
      where.language = language;
    }

    return prisma.competitionTranslation.findMany({
      where,
      orderBy: { language: 'asc' },
    });
  }

  /**
   * Obtener traducciones de un post
   */
  static async getPostTranslations(postId: string, language?: Language) {
    const where: any = { postId };
    if (language) {
      where.language = language;
    }

    return prisma.postTranslation.findMany({
      where,
      orderBy: { language: 'asc' },
    });
  }
}
