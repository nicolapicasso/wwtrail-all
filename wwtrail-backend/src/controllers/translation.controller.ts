import { Request, Response, NextFunction } from 'express';
import { TranslationService } from '../services/translation.service';
import logger from '../utils/logger';
import { Language } from '@prisma/client';

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
      const { targetLanguages, overwrite } = req.body;

      logger.info(`Auto-traduciendo competición ${competitionId}`);

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
      const { targetLanguages, overwrite } = req.body;

      logger.info(`Auto-traduciendo post ${postId}`);

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
      const { targetLanguages, overwrite } = req.body;

      logger.info(`Auto-traduciendo evento ${eventId}`);

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
      const { targetLanguages, overwrite } = req.body;

      logger.info(`Auto-traduciendo servicio ${serviceId}`);

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
      const { targetLanguages, overwrite } = req.body;

      logger.info(`Auto-traduciendo serie especial ${specialSeriesId}`);

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
