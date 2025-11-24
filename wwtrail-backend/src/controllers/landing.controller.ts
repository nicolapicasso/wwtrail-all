// src/controllers/landing.controller.ts
import { Request, Response } from 'express';
import LandingService from '../services/landing.service';
import TranslationService from '../services/translation.service';
import logger from '../utils/logger';
import { Language } from '@prisma/client';

class LandingController {
  /**
   * GET /api/v2/landings
   * Get all landings with pagination (admin only)
   */
  static async getAllLandings(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, search, language } = req.query;

      const result = await LandingService.getAllLandings({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
        search: search as string,
        language: language as Language,
      });

      res.json(result);
    } catch (error: any) {
      logger.error('Error in getAllLandings controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las landings',
      });
    }
  }

  /**
   * GET /api/v2/landings/:id
   * Get landing by ID (admin only)
   */
  static async getLandingById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const landing = await LandingService.getLandingById(id);
      res.json(landing);
    } catch (error: any) {
      logger.error('Error in getLandingById controller:', error);
      const status = error.message === 'Landing no encontrado' ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Error al obtener la landing',
      });
    }
  }

  /**
   * GET /api/v2/landings/slug/:slug
   * Get landing by slug (public endpoint with optional language)
   */
  static async getLandingBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const { language } = req.query;

      const landing = await LandingService.getLandingBySlug(
        slug,
        language as Language
      );

      res.json(landing);
    } catch (error: any) {
      logger.error('Error in getLandingBySlug controller:', error);
      const status = error.message === 'Landing no encontrado' ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Error al obtener la landing',
      });
    }
  }

  /**
   * POST /api/v2/landings
   * Create new landing (admin only)
   */
  static async createLanding(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;

      const landing = await LandingService.createLanding(req.body, userId);

      res.status(201).json({
        success: true,
        message: 'Landing creada correctamente',
        data: landing,
      });
    } catch (error: any) {
      logger.error('Error in createLanding controller:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear la landing',
      });
    }
  }

  /**
   * PUT /api/v2/landings/:id
   * Update landing (admin only)
   */
  static async updateLanding(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const landing = await LandingService.updateLanding(id, req.body);

      res.json({
        success: true,
        message: 'Landing actualizada correctamente',
        data: landing,
      });
    } catch (error: any) {
      logger.error('Error in updateLanding controller:', error);
      const status = error.message === 'Landing no encontrado' ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message || 'Error al actualizar la landing',
      });
    }
  }

  /**
   * DELETE /api/v2/landings/:id
   * Delete landing (admin only)
   */
  static async deleteLanding(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await LandingService.deleteLanding(id);

      res.json({
        success: true,
        message: 'Landing eliminada correctamente',
      });
    } catch (error: any) {
      logger.error('Error in deleteLanding controller:', error);
      const status = error.message === 'Landing no encontrado' ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Error al eliminar la landing',
      });
    }
  }

  /**
   * POST /api/v2/landings/:id/translate
   * Auto-translate landing to specified languages (admin only)
   */
  static async translateLanding(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { targetLanguages, overwrite } = req.body;

      const translations = await TranslationService.autoTranslate({
        entityType: 'landing',
        entityId: id,
        targetLanguages,
        overwrite: overwrite || false,
      });

      res.json({
        success: true,
        message: 'Traducciones generadas correctamente',
        data: translations,
      });
    } catch (error: any) {
      logger.error('Error in translateLanding controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al traducir la landing',
      });
    }
  }
}

export default LandingController;
