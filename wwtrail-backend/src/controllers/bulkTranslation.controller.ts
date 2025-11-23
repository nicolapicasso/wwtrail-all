import { Request, Response } from 'express';
import { TranslationService } from '../services/translation.service';
import prisma from '../config/database';
import logger from '../utils/logger';
import { Language } from '@prisma/client';

/**
 * Controller para operaciones masivas de traducción
 */
export class BulkTranslationController {
  /**
   * POST /api/v2/translations/bulk/generate
   * Generar traducciones para todas las entidades de un tipo
   */
  static async generateBulkTranslations(req: Request, res: Response) {
    try {
      const { entityType, targetLanguages } = req.body;

      if (!entityType) {
        return res.status(400).json({
          status: 'error',
          message: 'entityType is required (event, competition, post, service)',
        });
      }

      const languages = targetLanguages || [Language.EN, Language.IT, Language.CA, Language.FR, Language.DE];

      logger.info(`Starting bulk translation for ${entityType} to languages: ${languages.join(', ')}`);

      let count = 0;
      let errors = 0;

      // Procesar según el tipo de entidad
      switch (entityType) {
        case 'event': {
          const events = await prisma.event.findMany({
            where: { status: 'PUBLISHED' },
            include: { translations: true },
          });

          for (const event of events) {
            try {
              // Verificar qué idiomas ya tienen traducción
              const existingLanguages = event.translations.map(t => t.language);
              const missingLanguages = languages.filter(lang => !existingLanguages.includes(lang));

              if (missingLanguages.length > 0) {
                await TranslationService.translateEvent(event.id, missingLanguages as Language[]);
                count++;
                logger.info(`Translated event ${event.id} to ${missingLanguages.join(', ')}`);
              }
            } catch (error) {
              logger.error(`Error translating event ${event.id}:`, error);
              errors++;
            }
          }
          break;
        }

        case 'competition': {
          const competitions = await prisma.competition.findMany({
            include: { translations: true, event: true },
          });

          for (const competition of competitions) {
            try {
              const existingLanguages = competition.translations.map(t => t.language);
              const missingLanguages = languages.filter(lang => !existingLanguages.includes(lang));

              if (missingLanguages.length > 0) {
                await TranslationService.translateCompetition(competition.id, missingLanguages as Language[]);
                count++;
                logger.info(`Translated competition ${competition.id} to ${missingLanguages.join(', ')}`);
              }
            } catch (error) {
              logger.error(`Error translating competition ${competition.id}:`, error);
              errors++;
            }
          }
          break;
        }

        case 'post': {
          const posts = await prisma.post.findMany({
            where: { status: 'PUBLISHED' },
            include: { translations: true },
          });

          for (const post of posts) {
            try {
              const existingLanguages = post.translations.map(t => t.language);
              const missingLanguages = languages.filter(lang => !existingLanguages.includes(lang));

              if (missingLanguages.length > 0) {
                await TranslationService.translatePost(post.id, missingLanguages as Language[]);
                count++;
                logger.info(`Translated post ${post.id} to ${missingLanguages.join(', ')}`);
              }
            } catch (error) {
              logger.error(`Error translating post ${post.id}:`, error);
              errors++;
            }
          }
          break;
        }

        case 'service': {
          const services = await prisma.service.findMany({
            where: { status: 'PUBLISHED' },
            include: { translations: true },
          });

          for (const service of services) {
            try {
              const existingLanguages = service.translations.map(t => t.language);
              const missingLanguages = languages.filter(lang => !existingLanguages.includes(lang));

              if (missingLanguages.length > 0) {
                await TranslationService.translateService(service.id, missingLanguages as Language[]);
                count++;
                logger.info(`Translated service ${service.id} to ${missingLanguages.join(', ')}`);
              }
            } catch (error) {
              logger.error(`Error translating service ${service.id}:`, error);
              errors++;
            }
          }
          break;
        }

        default:
          return res.status(400).json({
            status: 'error',
            message: 'Invalid entityType. Use: event, competition, post, service',
          });
      }

      res.json({
        status: 'success',
        message: `Bulk translation completed`,
        data: {
          entityType,
          translated: count,
          errors,
          targetLanguages: languages,
        },
      });
    } catch (error: any) {
      logger.error('Error in bulk translation:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Error generating bulk translations',
      });
    }
  }

  /**
   * GET /api/v2/translations/bulk/status
   * Obtener estado de traducciones por tipo de entidad
   */
  static async getTranslationStatus(req: Request, res: Response) {
    try {
      const stats = {
        events: {
          total: 0,
          withTranslations: 0,
          missingTranslations: 0,
        },
        competitions: {
          total: 0,
          withTranslations: 0,
          missingTranslations: 0,
        },
        posts: {
          total: 0,
          withTranslations: 0,
          missingTranslations: 0,
        },
        services: {
          total: 0,
          withTranslations: 0,
          missingTranslations: 0,
        },
      };

      // Events
      const events = await prisma.event.findMany({
        where: { status: 'PUBLISHED' },
        include: { _count: { select: { translations: true } } },
      });
      stats.events.total = events.length;
      stats.events.withTranslations = events.filter(e => e._count.translations > 0).length;
      stats.events.missingTranslations = events.filter(e => e._count.translations === 0).length;

      // Competitions
      const competitions = await prisma.competition.findMany({
        include: { _count: { select: { translations: true } } },
      });
      stats.competitions.total = competitions.length;
      stats.competitions.withTranslations = competitions.filter(c => c._count.translations > 0).length;
      stats.competitions.missingTranslations = competitions.filter(c => c._count.translations === 0).length;

      // Posts
      const posts = await prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        include: { _count: { select: { translations: true } } },
      });
      stats.posts.total = posts.length;
      stats.posts.withTranslations = posts.filter(p => p._count.translations > 0).length;
      stats.posts.missingTranslations = posts.filter(p => p._count.translations === 0).length;

      // Services
      const services = await prisma.service.findMany({
        where: { status: 'PUBLISHED' },
        include: { _count: { select: { translations: true } } },
      });
      stats.services.total = services.length;
      stats.services.withTranslations = services.filter(s => s._count.translations > 0).length;
      stats.services.missingTranslations = services.filter(s => s._count.translations === 0).length;

      res.json({
        status: 'success',
        data: stats,
      });
    } catch (error: any) {
      logger.error('Error getting translation status:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Error getting translation status',
      });
    }
  }
}
