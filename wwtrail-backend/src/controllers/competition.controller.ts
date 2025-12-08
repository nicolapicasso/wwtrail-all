import { Request, Response, NextFunction } from 'express';
import { CompetitionService } from '../services/competition.service';
import logger from '../utils/logger';

/**
 * CompetitionController v2
 * 
 * Maneja peticiones HTTP para competiciones (distancias/carreras dentro de eventos)
 */
export class CompetitionController {
  /**
   * GET /api/v2/competitions
   * Listar todas las competiciones
   * @auth No requerida
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        limit = 50,
        sortBy = 'name',
        isFeatured,
        search,
        type,
        country,
        minDistance,
        maxDistance,
        minElevation,
        maxElevation,
        specialSeriesId,
        language,
      } = req.query;

      const competitions = await CompetitionService.findAll({
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        isFeatured: isFeatured === 'true',
        search: search as string,
        type: type as string,
        country: country as string,
        minDistance: minDistance ? parseFloat(minDistance as string) : undefined,
        maxDistance: maxDistance ? parseFloat(maxDistance as string) : undefined,
        minElevation: minElevation ? parseFloat(minElevation as string) : undefined,
        maxElevation: maxElevation ? parseFloat(maxElevation as string) : undefined,
        specialSeriesId: specialSeriesId as string,
        language: language as string,
      });

      res.json({
        status: 'success',
        data: { competitions },
        count: competitions.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v2/events/:eventId/competitions
   * Crear una nueva competición dentro de un evento
   * @auth Required (organizador del evento o ADMIN)
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const userId = req.user!.id;
      const data = req.body;

      const competition = await CompetitionService.create(eventId, data, userId);

      res.status(201).json({
        status: 'success',
        message: 'Competition created successfully',
        data: competition,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/events/:eventId/competitions
   * Obtener todas las competiciones de un evento
   * @auth No requerida
   */
  static async getByEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;

      const competitions = await CompetitionService.findByEvent(eventId);

      res.json({
        status: 'success',
        data: competitions,
        count: competitions.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/competitions/:id
   * Obtener una competición por ID
   * @auth No requerida
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const competition = await CompetitionService.findById(id);

      res.json({
        status: 'success',
        data: competition,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/competitions/slug/:slug
   * Obtener una competición por slug
   * @auth No requerida
   */
  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const competition = await CompetitionService.findBySlug(slug);

      // Log coordinates for debugging
      logger.info(`Competition ${slug} coordinates:`, {
        hasEvent: !!competition.event,
        eventId: competition.event?.id,
        eventName: competition.event?.name,
        latitude: (competition.event as any)?.latitude,
        longitude: (competition.event as any)?.longitude,
      });

      res.json({
        status: 'success',
        data: competition,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v2/competitions/:id
   * Actualizar una competición
   * @auth Required (organizador del evento o ADMIN)
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;
      const data = req.body;

      // Organizadores no pueden publicar directamente - forzar DRAFT
      let statusWarning = '';
      if (userRole !== 'ADMIN' && data.status === 'PUBLISHED') {
        data.status = 'DRAFT';
        statusWarning = 'El contenido ha quedado en borrador pendiente de revisión por un administrador.';
      }

      const competition = await CompetitionService.update(id, data, userId);

      res.json({
        status: 'success',
        message: statusWarning || 'Competition updated successfully',
        warning: statusWarning || undefined,
        data: competition,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v2/competitions/:id
   * Eliminar una competición (y todas sus editions en cascade)
   * @auth Required (organizador del evento o ADMIN)
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await CompetitionService.delete(id, userId);

      res.json({
        status: 'success',
        message: 'Competition deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v2/events/:eventId/competitions/reorder
   * Reordenar competiciones de un evento
   * @auth Required (organizador del evento o ADMIN)
   */
  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const userId = req.user!.id;
      const { order } = req.body;

      if (!Array.isArray(order)) {
        return res.status(400).json({
          status: 'error',
          message: 'Order must be an array of { id, displayOrder }',
        });
      }

      await CompetitionService.reorder(eventId, order, userId);

      res.json({
        status: 'success',
        message: 'Competitions reordered successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v2/competitions/:id/toggle
   * Activar/desactivar una competición
   * @auth Required (organizador del evento o ADMIN)
   */
  static async toggleActive(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const competition = await CompetitionService.toggleActive(id, userId);

      res.json({
        status: 'success',
        message: `Competition ${true ? 'activated' : 'deactivated'}`,
        data: competition,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v2/competitions/:id/featured
   * Toggle featured status de una competición
   * @auth Required (solo ADMIN)
   */
  static async toggleFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const competition = await CompetitionService.toggleFeatured(id, userId);

      logger.info(
        `Competition featured status toggled: ${id} → ${competition.featured} by user ${userId}`
      );

      res.json({
        status: 'success',
        message: `Competition ${competition.featured ? 'marked as featured' : 'unmarked as featured'}`,
        data: competition,
      });
    } catch (error) {
      next(error);
    }
  }
}
