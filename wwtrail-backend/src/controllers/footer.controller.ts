// src/controllers/footer.controller.ts
import { Request, Response } from 'express';
import FooterService from '../services/footer.service';
import logger from '../utils/logger';
import { Language } from '@prisma/client';

class FooterController {
  /**
   * GET /api/v1/footer
   * Get full footer configuration (admin only)
   */
  static async getFooter(req: Request, res: Response): Promise<void> {
    try {
      const footer = await FooterService.getFooter();
      res.json(footer);
    } catch (error: any) {
      logger.error('Error in getFooter controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la configuración del footer',
      });
    }
  }

  /**
   * GET /api/v1/footer/public
   * Get footer content for specific language (public endpoint)
   */
  static async getPublicFooter(req: Request, res: Response): Promise<void> {
    try {
      const language = (req.query.language as Language) || Language.ES;

      const footer = await FooterService.getFooterForLanguage(language);
      res.json(footer);
    } catch (error: any) {
      logger.error('Error in getPublicFooter controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el footer',
      });
    }
  }

  /**
   * PUT /api/v1/footer
   * Update footer configuration (admin only)
   */
  static async updateFooter(req: Request, res: Response): Promise<void> {
    try {
      const footer = await FooterService.updateFooter(req.body);
      res.json({
        success: true,
        message: 'Footer actualizado correctamente',
        data: footer,
      });
    } catch (error: any) {
      logger.error('Error in updateFooter controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al actualizar el footer',
      });
    }
  }
}

export default FooterController;
