import { Request, Response, NextFunction } from 'express';
import { SpecialSeriesService } from '../services/specialSeries.service';
import logger from '../utils/logger';

/**
 * SpecialSeriesController - Maneja peticiones HTTP para Special Series
 *
 * Las Special Series son circuitos/series especiales que agrupan competiciones
 * - ADMIN: puede crear special series directamente (status PUBLISHED)
 * - ORGANIZER: puede crear special series que quedan pendientes (status DRAFT)
 */
export class SpecialSeriesController {
  /**
   * POST /api/v2/special-series
   * Crear una nueva special series
   * @auth Required (ORGANIZER o ADMIN)
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      logger.info(`Creating special series: ${data.name} by user ${userId} (${userRole})`);

      // Agregar createdById
      data.createdById = userId;

      const specialSeries = await SpecialSeriesService.create(data, userRole);

      // Mensaje diferente según el status
      const message = userRole === 'ADMIN'
        ? 'Special series created and published successfully'
        : 'Special series created successfully. Pending approval by administrator.';

      res.status(201).json({
        status: 'success',
        message,
        data: specialSeries,
      });
    } catch (error) {
      logger.error(`Error creating special series: ${error}`);
      next(error);
    }
  }

  /**
   * GET /api/v2/special-series/check-slug/:slug
   * Verificar si un slug está disponible
   * @auth No requerida
   */
  static async checkSlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const result = await SpecialSeriesService.checkSlug(slug);

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/special-series
   * Listar special series con filtros
   * @auth No requerida para ver PUBLISHED, pero si se incluyen DRAFT requiere ADMIN
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;

      // Si no es admin, forzar filtro status=PUBLISHED
      if (!req.user || req.user.role !== 'ADMIN') {
        filters.status = 'PUBLISHED';
      }

      const result = await SpecialSeriesService.getAll(filters);

      res.json({
        status: 'success',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Error getting special series:', error);
      next(error);
    }
  }

  /**
   * GET /api/v2/special-series/:id
   * Obtener special series por ID
   * @auth No requerida para PUBLISHED, requerida para DRAFT
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const specialSeries = await SpecialSeriesService.getById(id);

      // Si es DRAFT, solo el creador o ADMIN pueden verlo
      if (specialSeries.status === 'DRAFT') {
        if (!req.user || (req.user.role !== 'ADMIN' && req.user.id !== specialSeries.createdById)) {
          return res.status(403).json({
            status: 'error',
            message: 'Access denied',
          });
        }
      }

      res.json({
        status: 'success',
        data: specialSeries,
      });
    } catch (error) {
      logger.error(`Error getting special series ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v2/special-series/slug/:slug
   * Obtener special series por slug
   * @auth No requerida para PUBLISHED
   */
  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const specialSeries = await SpecialSeriesService.getBySlug(slug);

      // Si es DRAFT, solo el creador o ADMIN pueden verlo
      if (specialSeries.status === 'DRAFT') {
        if (!req.user || (req.user.role !== 'ADMIN' && req.user.id !== specialSeries.createdById)) {
          return res.status(403).json({
            status: 'error',
            message: 'Access denied',
          });
        }
      }

      res.json({
        status: 'success',
        data: specialSeries,
      });
    } catch (error) {
      logger.error(`Error getting special series by slug ${req.params.slug}:`, error);
      next(error);
    }
  }

  /**
   * PATCH /api/v2/special-series/:id
   * Actualizar special series
   * @auth Required (creador o ADMIN)
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const updated = await SpecialSeriesService.update(id, data, userId, userRole);

      res.json({
        status: 'success',
        message: 'Special series updated successfully',
        data: updated,
      });
    } catch (error) {
      logger.error(`Error updating special series ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * POST /api/v2/special-series/:id/approve
   * Aprobar special series (DRAFT → PUBLISHED)
   * @auth Required (ADMIN only)
   */
  static async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const updated = await SpecialSeriesService.approve(id, userId);

      res.json({
        status: 'success',
        message: 'Special series approved successfully',
        data: updated,
      });
    } catch (error) {
      logger.error(`Error approving special series ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * POST /api/v2/special-series/:id/reject
   * Rechazar special series (DRAFT → CANCELLED)
   * @auth Required (ADMIN only)
   */
  static async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const updated = await SpecialSeriesService.reject(id, userId);

      res.json({
        status: 'success',
        message: 'Special series rejected successfully',
        data: updated,
      });
    } catch (error) {
      logger.error(`Error rejecting special series ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * DELETE /api/v2/special-series/:id
   * Eliminar special series
   * @auth Required (ADMIN only)
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await SpecialSeriesService.delete(id, userId);

      res.json({
        status: 'success',
        message: 'Special series deleted successfully',
      });
    } catch (error) {
      logger.error(`Error deleting special series ${req.params.id}:`, error);
      next(error);
    }
  }
}

export default SpecialSeriesController;
