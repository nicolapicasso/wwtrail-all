import { Request, Response, NextFunction } from 'express';
import { TranslationService } from '../services/translation.service';
import logger from '../utils/logger';
import { Language } from '@prisma/client';
import prisma from '../config/database';

// Todos los idiomas soportados por el sistema
const ALL_LANGUAGES: Language[] = ['ES', 'EN', 'IT', 'CA', 'FR', 'DE'];

/**
 * Obtiene los idiomas de destino: todos excepto el idioma base del contenido
 */
async function getTargetLanguages(
  entityType: 'event' | 'competition' | 'post' | 'service' | 'specialSeries',
  entityId: string,
  providedLanguages?: Language[]
): Promise<Language[]> {
  // Si se proporcionan idiomas específicos, usarlos
  if (providedLanguages && Array.isArray(providedLanguages) && providedLanguages.length > 0) {
    return providedLanguages;
  }

  // Obtener el idioma base del contenido
  let sourceLanguage: Language = 'ES'; // Default

  try {
    switch (entityType) {
      case 'event':
        const event = await prisma.event.findUnique({
          where: { id: entityId },
          select: { language: true },
        });
        if (event) sourceLanguage = event.language;
        break;
      case 'competition':
        const competition = await prisma.competition.findUnique({
          where: { id: entityId },
          select: { language: true },
        });
        if (competition) sourceLanguage = competition.language;
        break;
      case 'post':
        const post = await prisma.post.findUnique({
          where: { id: entityId },
          select: { language: true },
        });
        if (post) sourceLanguage = post.language;
        break;
      case 'service':
        const service = await prisma.service.findUnique({
          where: { id: entityId },
          select: { language: true },
        });
        if (service) sourceLanguage = service.language;
        break;
      case 'specialSeries':
        const specialSeries = await prisma.specialSeries.findUnique({
          where: { id: entityId },
          select: { language: true },
        });
        if (specialSeries) sourceLanguage = specialSeries.language;
        break;
    }
  } catch (error) {
    logger.warn(`No se pudo obtener idioma base de ${entityType} ${entityId}, usando ES`);
  }

  // Retornar todos los idiomas excepto el idioma base
  return ALL_LANGUAGES.filter((lang) => lang !== sourceLanguage);
}

/**
 * TranslationController - Maneja peticiones HTTP para traducciones automáticas
 *
 * Sistema de traducciones con IA (OpenAI GPT):
 * - Auto-traduce contenido a múltiples idiomas
 * - Soporta: Competition, Post, Event, Service, SpecialSeries
 * - ORGANIZER y ADMIN pueden traducir su propio contenido
 */
export class TranslationController {
  /**
   * POST /api/v2/translations/auto-translate
   * Auto-traducir contenido usando IA
   * @auth Required (ORGANIZER o ADMIN)
   */
  static async autoTranslate(req: Request, res: Response, next: NextFunction) {
    try {
      const { entityType, entityId, targetLanguages, overwrite } = req.body;

      logger.info(`Auto-traduciendo ${entityType} ${entityId} a idiomas: ${targetLanguages.join(', ')}`);

      // Validar que entityType sea válido
      const validTypes = ['competition', 'post', 'event', 'service', 'specialSeries'];
      if (!validTypes.includes(entityType)) {
        return res.status(400).json({
          status: 'error',
          message: `Tipo de entidad inválido. Debe ser uno de: ${validTypes.join(', ')}`,
        });
      }

      // Auto-traducir
      const translations = await TranslationService.autoTranslate({
        entityType,
        entityId,
        targetLanguages,
        overwrite: overwrite || false,
      });

      res.status(200).json({
        status: 'success',
        message: `${translations.length} traducciones creadas exitosamente`,
        data: translations,
      });
    } catch (error: any) {
      logger.error(`Error en auto-traducción: ${error.message}`);
      next(error);
    }
  }

  /**
   * POST /api/v2/translations/competition/:competitionId
   * Auto-traducir una competición específica
   * @auth Required (ORGANIZER o ADMIN)
   */
  static async autoTranslateCompetition(req: Request, res: Response, next: NextFunction) {
    try {
      const { competitionId } = req.params;
      const { targetLanguages: providedLanguages, overwrite } = req.body;

      // Obtener idiomas de destino (todos excepto el idioma base si no se especifican)
      const targetLanguages = await getTargetLanguages('competition', competitionId, providedLanguages);

      logger.info(`Auto-traduciendo competición ${competitionId} a idiomas: ${targetLanguages.join(', ')}`);

      const translations = await TranslationService.autoTranslateCompetition(
        competitionId,
        targetLanguages,
        overwrite || false
      );

      res.status(200).json({
        status: 'success',
        message: `Competición traducida a ${translations.length} idiomas`,
        data: translations,
      });
    } catch (error: any) {
      logger.error(`Error traduciendo competición: ${error.message}`);
      next(error);
    }
  }

  /**
   * POST /api/v2/translations/post/:postId
   * Auto-traducir un post específico
   * @auth Required (ORGANIZER o ADMIN)
   */
  static async autoTranslatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const { targetLanguages: providedLanguages, overwrite } = req.body;

      // Obtener idiomas de destino (todos excepto el idioma base si no se especifican)
      const targetLanguages = await getTargetLanguages('post', postId, providedLanguages);

      logger.info(`Auto-traduciendo post ${postId} a idiomas: ${targetLanguages.join(', ')}`);

      const translations = await TranslationService.autoTranslatePost(
        postId,
        targetLanguages,
        overwrite || false
      );

      res.status(200).json({
        status: 'success',
        message: `Post traducido a ${translations.length} idiomas`,
        data: translations,
      });
    } catch (error: any) {
      logger.error(`Error traduciendo post: ${error.message}`);
      next(error);
    }
  }

  /**
   * POST /api/v2/translations/event/:eventId
   * Auto-traducir un evento específico
   * @auth Required (ORGANIZER o ADMIN)
   */
  static async autoTranslateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const { targetLanguages: providedLanguages, overwrite } = req.body;

      // Obtener idiomas de destino (todos excepto el idioma base si no se especifican)
      const targetLanguages = await getTargetLanguages('event', eventId, providedLanguages);

      logger.info(`Auto-traduciendo evento ${eventId} a idiomas: ${targetLanguages.join(', ')}`);

      const translations = await TranslationService.autoTranslateEvent(
        eventId,
        targetLanguages,
        overwrite || false
      );

      res.status(200).json({
        status: 'success',
        message: `Evento traducido a ${translations.length} idiomas`,
        data: translations,
      });
    } catch (error: any) {
      logger.error(`Error traduciendo evento: ${error.message}`);
      next(error);
    }
  }

  /**
   * POST /api/v2/translations/service/:serviceId
   * Auto-traducir un servicio específico
   * @auth Required (ORGANIZER o ADMIN)
   */
  static async autoTranslateService(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId } = req.params;
      const { targetLanguages: providedLanguages, overwrite } = req.body;

      // Obtener idiomas de destino (todos excepto el idioma base si no se especifican)
      const targetLanguages = await getTargetLanguages('service', serviceId, providedLanguages);

      logger.info(`Auto-traduciendo servicio ${serviceId} a idiomas: ${targetLanguages.join(', ')}`);

      const translations = await TranslationService.autoTranslateService(
        serviceId,
        targetLanguages,
        overwrite || false
      );

      res.status(200).json({
        status: 'success',
        message: `Servicio traducido a ${translations.length} idiomas`,
        data: translations,
      });
    } catch (error: any) {
      logger.error(`Error traduciendo servicio: ${error.message}`);
      next(error);
    }
  }

  /**
   * POST /api/v2/translations/special-series/:specialSeriesId
   * Auto-traducir una serie especial
   * @auth Required (ORGANIZER o ADMIN)
   */
  static async autoTranslateSpecialSeries(req: Request, res: Response, next: NextFunction) {
    try {
      const { specialSeriesId } = req.params;
      const { targetLanguages: providedLanguages, overwrite } = req.body;

      // Obtener idiomas de destino (todos excepto el idioma base si no se especifican)
      const targetLanguages = await getTargetLanguages('specialSeries', specialSeriesId, providedLanguages);

      logger.info(`Auto-traduciendo serie especial ${specialSeriesId} a idiomas: ${targetLanguages.join(', ')}`);

      const translations = await TranslationService.autoTranslateSpecialSeries(
        specialSeriesId,
        targetLanguages,
        overwrite || false
      );

      res.status(200).json({
        status: 'success',
        message: `Serie especial traducida a ${translations.length} idiomas`,
        data: translations,
      });
    } catch (error: any) {
      logger.error(`Error traduciendo serie especial: ${error.message}`);
      next(error);
    }
  }

  /**
   * GET /api/v2/translations/competition/:competitionId
   * Obtener traducciones de una competición
   * @auth No required (público)
   */
  static async getCompetitionTranslations(req: Request, res: Response, next: NextFunction) {
    try {
      const { competitionId } = req.params;
      const { language } = req.query;

      const translations = await TranslationService.getCompetitionTranslations(
        competitionId,
        language as Language | undefined
      );

      res.json({
        status: 'success',
        data: translations,
      });
    } catch (error: any) {
      logger.error(`Error obteniendo traducciones: ${error.message}`);
      next(error);
    }
  }

  /**
   * GET /api/v2/translations/post/:postId
   * Obtener traducciones de un post
   * @auth No required (público)
   */
  static async getPostTranslations(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const { language } = req.query;

      const translations = await TranslationService.getPostTranslations(
        postId,
        language as Language | undefined
      );

      res.json({
        status: 'success',
        data: translations,
      });
    } catch (error: any) {
      logger.error(`Error obteniendo traducciones de post: ${error.message}`);
      next(error);
    }
  }
}
