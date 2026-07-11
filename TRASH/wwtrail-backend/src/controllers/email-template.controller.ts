import { Request, Response, NextFunction } from 'express';
import { EmailTemplateService } from '../services/email-template.service';
import logger from '../utils/logger';

/**
 * EmailTemplateController - Handles all email template-related HTTP requests
 */
export class EmailTemplateController {
  /**
   * GET /api/v2/email-templates
   * Get all email templates
   * @auth Required (ADMIN)
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const templates = await EmailTemplateService.getAll();

      res.json({
        status: 'success',
        data: templates,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/email-templates/:id
   * Get email template by ID
   * @auth Required (ADMIN)
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const template = await EmailTemplateService.getById(id);

      if (!template) {
        return res.status(404).json({
          status: 'error',
          message: 'Email template not found',
        });
      }

      res.json({
        status: 'success',
        data: template,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v2/email-templates
   * Create new email template
   * @auth Required (ADMIN)
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      const template = await EmailTemplateService.create(data);

      res.status(201).json({
        status: 'success',
        message: 'Email template created successfully',
        data: template,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v2/email-templates/:id
   * Update email template
   * @auth Required (ADMIN)
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;

      const template = await EmailTemplateService.update(id, data);

      res.json({
        status: 'success',
        message: 'Email template updated successfully',
        data: template,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v2/email-templates/:id
   * Delete email template
   * @auth Required (ADMIN)
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await EmailTemplateService.delete(id);

      res.json({
        status: 'success',
        message: 'Email template deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v2/email-templates/:id/preview
   * Preview email template with sample data
   * @auth Required (ADMIN)
   */
  static async preview(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { sampleData } = req.body;

      if (!sampleData) {
        return res.status(400).json({
          status: 'error',
          message: 'sampleData is required',
        });
      }

      const preview = await EmailTemplateService.preview(id, sampleData);

      res.json({
        status: 'success',
        data: preview,
      });
    } catch (error) {
      next(error);
    }
  }
}
