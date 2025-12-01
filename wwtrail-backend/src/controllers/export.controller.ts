// src/controllers/export.controller.ts
import { Request, Response, NextFunction } from 'express';
import { exportService } from '../services/export.service';

class ExportController {
  /**
   * Get export statistics
   * GET /api/v2/admin/export/stats
   */
  async getStats(_req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const stats = await exportService.getExportStats();

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export all data (full backup)
   * GET /api/v2/admin/export/full
   */
  async exportAll(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const includeRelations = req.query.includeRelations !== 'false';
      const result = await exportService.exportAll(includeRelations);

      // Set headers for file download
      const filename = `wwtrail_backup_${new Date().toISOString().split('T')[0]}.json`;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export events
   * GET /api/v2/admin/export/events
   */
  async exportEvents(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const includeRelations = req.query.includeRelations !== 'false';
      const data = await exportService.exportEvents(includeRelations);

      const filename = `wwtrail_events_${new Date().toISOString().split('T')[0]}.json`;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      return res.status(200).json({
        exportedAt: new Date().toISOString(),
        entity: 'events',
        count: data.length,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export competitions
   * GET /api/v2/admin/export/competitions
   */
  async exportCompetitions(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const includeRelations = req.query.includeRelations !== 'false';
      const data = await exportService.exportCompetitions(includeRelations);

      const filename = `wwtrail_competitions_${new Date().toISOString().split('T')[0]}.json`;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      return res.status(200).json({
        exportedAt: new Date().toISOString(),
        entity: 'competitions',
        count: data.length,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export editions
   * GET /api/v2/admin/export/editions
   */
  async exportEditions(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const includeRelations = req.query.includeRelations !== 'false';
      const data = await exportService.exportEditions(includeRelations);

      const filename = `wwtrail_editions_${new Date().toISOString().split('T')[0]}.json`;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      return res.status(200).json({
        exportedAt: new Date().toISOString(),
        entity: 'editions',
        count: data.length,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export organizers
   * GET /api/v2/admin/export/organizers
   */
  async exportOrganizers(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const includeRelations = req.query.includeRelations !== 'false';
      const data = await exportService.exportOrganizers(includeRelations);

      const filename = `wwtrail_organizers_${new Date().toISOString().split('T')[0]}.json`;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      return res.status(200).json({
        exportedAt: new Date().toISOString(),
        entity: 'organizers',
        count: data.length,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export special series
   * GET /api/v2/admin/export/series
   */
  async exportSpecialSeries(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const includeRelations = req.query.includeRelations !== 'false';
      const data = await exportService.exportSpecialSeries(includeRelations);

      const filename = `wwtrail_special_series_${new Date().toISOString().split('T')[0]}.json`;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      return res.status(200).json({
        exportedAt: new Date().toISOString(),
        entity: 'specialSeries',
        count: data.length,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export services
   * GET /api/v2/admin/export/services
   */
  async exportServices(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const includeRelations = req.query.includeRelations !== 'false';
      const data = await exportService.exportServices(includeRelations);

      const filename = `wwtrail_services_${new Date().toISOString().split('T')[0]}.json`;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      return res.status(200).json({
        exportedAt: new Date().toISOString(),
        entity: 'services',
        count: data.length,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export posts
   * GET /api/v2/admin/export/posts
   */
  async exportPosts(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const includeRelations = req.query.includeRelations !== 'false';
      const data = await exportService.exportPosts(includeRelations);

      const filename = `wwtrail_posts_${new Date().toISOString().split('T')[0]}.json`;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      return res.status(200).json({
        exportedAt: new Date().toISOString(),
        entity: 'posts',
        count: data.length,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export users (excluding sensitive data)
   * GET /api/v2/admin/export/users
   */
  async exportUsers(_req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const data = await exportService.exportUsers();

      const filename = `wwtrail_users_${new Date().toISOString().split('T')[0]}.json`;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      return res.status(200).json({
        exportedAt: new Date().toISOString(),
        entity: 'users',
        count: data.length,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const exportController = new ExportController();
