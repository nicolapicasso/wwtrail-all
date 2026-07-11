import { Request, Response, NextFunction } from 'express';
import { OrganizerService } from '../services/organizer.service';
import logger from '../utils/logger';

/**
 * OrganizerController - Maneja peticiones HTTP para entidades organizadoras
 *
 * Las entidades organizadoras son clubs/sociedades que organizan eventos
 * - ADMIN: puede crear organizadores directamente (status PUBLISHED)
 * - ORGANIZER: puede crear organizadores que quedan pendientes (status DRAFT)
 */
export class OrganizerController {
  /**
   * POST /api/v2/organizers
   * Crear un nuevo organizador
   * @auth Required (ORGANIZER o ADMIN)
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      logger.info(`Creating organizer: ${data.name} by user ${userId} (${userRole})`);

      // Agregar createdById
      data.createdById = userId;

      const organizer = await OrganizerService.create(data, userRole);

      // Mensaje diferente según el status
      const message = userRole === 'ADMIN'
        ? 'Organizer created and published successfully'
        : 'Organizer created successfully. Pending approval by administrator.';

      res.status(201).json({
        status: 'success',
        message,
        data: organizer,
      });
    } catch (error) {
      logger.error(`Error creating organizer: ${error}`);
      next(error);
    }
  }

  /**
   * GET /api/v2/organizers/check-slug/:slug
   * Verificar si un slug está disponible
   * @auth No requerida
   */
  static async checkSlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const result = await OrganizerService.checkSlug(slug);

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/organizers
   * Listar organizadores con filtros
   * @auth No requerida para ver PUBLISHED, pero si se incluyen DRAFT requiere ADMIN
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;

      // Si no es admin, forzar filtro status=PUBLISHED
      if (!req.user || req.user.role !== 'ADMIN') {
        filters.status = 'PUBLISHED';
      }

      const result = await OrganizerService.getAll(filters);

      res.json({
        status: 'success',
        ...result,
      });
    } catch (error) {
      logger.error(`Error fetching organizers: ${error}`);
      next(error);
    }
  }

  /**
   * GET /api/v2/organizers/:id
   * Obtener organizador por ID
   * @auth No requerida para PUBLISHED, requerida para DRAFT
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const organizer = await OrganizerService.getById(id);

      // Si está en DRAFT, solo permitir acceso al creador o admin
      if (organizer.status === 'DRAFT') {
        if (!req.user || (req.user.role !== 'ADMIN' && organizer.createdById !== req.user.id)) {
          return res.status(403).json({
            status: 'error',
            message: 'Unauthorized to view this draft organizer',
          });
        }
      }

      res.json({
        status: 'success',
        data: organizer,
      });
    } catch (error) {
      logger.error(`Error fetching organizer ${req.params.id}: ${error}`);
      next(error);
    }
  }

  /**
   * GET /api/v2/organizers/slug/:slug
   * Obtener organizador por slug
   * @auth No requerida para PUBLISHED
   */
  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const organizer = await OrganizerService.getBySlug(slug);

      // Si está en DRAFT, solo permitir acceso al creador o admin
      if (organizer.status === 'DRAFT') {
        if (!req.user || (req.user.role !== 'ADMIN' && organizer.createdById !== req.user.id)) {
          return res.status(403).json({
            status: 'error',
            message: 'Unauthorized to view this draft organizer',
          });
        }
      }

      res.json({
        status: 'success',
        data: organizer,
      });
    } catch (error) {
      logger.error(`Error fetching organizer by slug ${req.params.slug}: ${error}`);
      next(error);
    }
  }

  /**
   * PATCH /api/v2/organizers/:id
   * Actualizar organizador
   * @auth Required (Creador o ADMIN)
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;
      const userId = req.user!.id;

      logger.info(`Updating organizer ${id} by user ${userId}`);

      const organizer = await OrganizerService.update(id, data, userId);

      res.json({
        status: 'success',
        message: 'Organizer updated successfully',
        data: organizer,
      });
    } catch (error) {
      logger.error(`Error updating organizer ${req.params.id}: ${error}`);
      next(error);
    }
  }

  /**
   * POST /api/v2/organizers/:id/approve
   * Aprobar organizador
   * @auth Required (ADMIN only)
   */
  static async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      logger.info(`Admin ${userId} approving organizer ${id}`);

      const organizer = await OrganizerService.approve(id, userId);

      res.json({
        status: 'success',
        message: 'Organizer approved successfully',
        data: organizer,
      });
    } catch (error) {
      logger.error(`Error approving organizer ${req.params.id}: ${error}`);
      next(error);
    }
  }

  /**
   * POST /api/v2/organizers/:id/reject
   * Rechazar organizador
   * @auth Required (ADMIN only)
   */
  static async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      logger.info(`Admin ${userId} rejecting organizer ${id}`);

      const organizer = await OrganizerService.reject(id, userId);

      res.json({
        status: 'success',
        message: 'Organizer rejected successfully',
        data: organizer,
      });
    } catch (error) {
      logger.error(`Error rejecting organizer ${req.params.id}: ${error}`);
      next(error);
    }
  }

  /**
   * DELETE /api/v2/organizers/:id
   * Eliminar organizador
   * @auth Required (ADMIN only)
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      logger.info(`Admin ${userId} deleting organizer ${id}`);

      const result = await OrganizerService.delete(id, userId);

      res.json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      logger.error(`Error deleting organizer ${req.params.id}: ${error}`);
      next(error);
    }
  }
}
