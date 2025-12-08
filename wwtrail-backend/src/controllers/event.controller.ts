import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/event.service';
import prisma from '../config/database';
import { cache } from '../config/redis';
import logger from '../utils/logger';

/**
 * EventController - Maneja todas las peticiones HTTP relacionadas con eventos
 * 
 * Los eventos son el nivel superior en el modelo v2:
 * Event → Competition → Edition
 */
export class EventController {
  /**
   * POST /api/v2/events
   * Crear un nuevo evento
   * @auth Required (ORGANIZER o ADMIN)
   */
  
  /**
   * Crear evento (ahora considera el rol del usuario)
   * POST /api/v2/events
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      // 🔍 DEBUG: Ver qué llega exactamente
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📥 DATOS RECIBIDOS EN CONTROLLER:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Body completo:', JSON.stringify(req.body, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Longitud de cada campo:');
      Object.keys(req.body).forEach(key => {
        const value = req.body[key];
        const length = typeof value === 'string' ? value.length : 'N/A';
        console.log(`  ${key}: ${length} caracteres | tipo: ${typeof value}`);
      });
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      const event = await EventService.create(data, userId, userRole);

      // Mensaje diferente según el status
      const message = userRole === 'ADMIN' 
        ? 'Event created and published successfully'
        : 'Event created successfully. Pending approval by administrator.';

      res.status(201).json({
        status: 'success',
        message,
        data: event,
      });
    } catch (error) {
      next(error);
    }

  }

  /**
   * GET /api/v2/events/check-slug/:slug
   * Verificar si un slug está disponible
   * @auth No requerida
   */
  static async checkSlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const { excludeId } = req.query;

      const available = await EventService.isSlugAvailable(
        slug, 
        excludeId as string | undefined
      );

      res.json({
        status: 'success',
        data: {
          slug,
          available,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/events
   * Listar eventos con filtros y paginación
   * @auth No requerida
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;
      
      const result = await EventService.findAll(filters);

      res.json({
        status: 'success',
        ...result, // Incluye: data, pagination
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/events/search
   * Búsqueda full-text de eventos
   * @auth No requerida
   */
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, limit } = req.query;

      // Validar que query existe
      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          status: 'error',
          message: 'Query parameter "q" is required',
        });
      }

      const limitNum = limit ? parseInt(limit as string, 10) : 20;

      const events = await EventService.search(q, limitNum);

      res.json({
        status: 'success',
        data: events,
        count: events.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/events/nearby
   * Búsqueda geoespacial por coordenadas y radio
   * @auth No requerida
   */
  static async getNearby(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lon, radius } = req.query;

      // Validar coordenadas
      if (!lat || !lon) {
        return res.status(400).json({
          status: 'error',
          message: 'Query parameters "lat" and "lon" are required',
        });
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);
      const radiusKm = radius ? parseFloat(radius as string) : 50;

      // Validar rangos
      if (latitude < -90 || latitude > 90) {
        return res.status(400).json({
          status: 'error',
          message: 'Latitude must be between -90 and 90',
        });
      }

      if (longitude < -180 || longitude > 180) {
        return res.status(400).json({
          status: 'error',
          message: 'Longitude must be between -180 and 180',
        });
      }

      const events = await EventService.findNearby(latitude, longitude, radiusKm);

      res.json({
        status: 'success',
        data: events,
        count: events.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/events/featured
   * Obtener eventos destacados
   * @auth No requerida
   */
  static async getFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit } = req.query;
      const limitNum = limit ? parseInt(limit as string, 10) : 10;

      const events = await EventService.getFeatured(limitNum);

      res.json({
        status: 'success',
        data: events,
        count: events.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/events/country/:country
   * Obtener eventos por país
   * @auth No requerida
   */
  static async getByCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const { country } = req.params;
      const { page, limit } = req.query;

      const pageNum = page ? parseInt(page as string, 10) : 1;
      const limitNum = limit ? parseInt(limit as string, 10) : 20;

      const result = await EventService.getByCountry(country, {
        page: pageNum,
        limit: limitNum,
      });

      res.json({
        status: 'success',
        ...result, // Incluye: data, pagination
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/events/:id
   * Obtener un evento por ID
   * @auth No requerida (pero si está autenticado, incluye info de permisos)
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const event = await EventService.findById(id);

      // Si el usuario está autenticado, añadir info de permisos
      let eventWithPermissions = { ...event };
      if (req.user) {
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole === 'ADMIN') {
          eventWithPermissions.isOwner = false;
          eventWithPermissions.isManager = false;
          eventWithPermissions.canEdit = true;
        } else {
          const isOwner = event.userId === userId;
          // Verificar si es manager asignado
          const manager = await prisma.eventManager.findUnique({
            where: { eventId_userId: { eventId: id, userId } },
          });
          const isManager = !!manager;

          eventWithPermissions.isOwner = isOwner;
          eventWithPermissions.isManager = isManager;
          eventWithPermissions.canEdit = isOwner || isManager;
        }
      }

      res.json({
        status: 'success',
        data: eventWithPermissions,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/events/slug/:slug
   * Obtener un evento por slug
   * @auth No requerida
   */
  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const event = await EventService.findBySlug(slug);

      res.json({
        status: 'success',
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/events/:id/stats
   * Obtener estadísticas de un evento
   * @auth No requerida
   */
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const stats = await EventService.getStats(id);

      res.json({
        status: 'success',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v2/events/:id
   * Actualizar un evento
   * @auth Required (organizador o ADMIN)
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const data = req.body;

      const event = await EventService.update(id, data, userId);

      res.json({
        status: 'success',
        message: 'Event updated successfully',
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v2/events/:id
   * Eliminar un evento (y cascade competitions + editions)
   * @auth Required (organizador o ADMIN)
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await EventService.delete(id, userId);

      res.json({
        status: 'success',
        message: 'Event deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener mis eventos (solo los que he creado)
   * GET /api/v2/events/my-events
   */
  static async getMyEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;
      const filters = req.query;

      const result = await EventService.getMyEvents(userId, userRole, filters);

      res.json({
        status: 'success',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener eventos pendientes de aprobación (solo ADMIN)
   * GET /api/v2/events/pending
   */
  static async getPendingEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;
      const result = await EventService.getPendingEvents(filters);

      res.json({
        status: 'success',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Aprobar evento (solo ADMIN)
   * POST /api/v2/events/:id/approve
   */
  static async approveEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const adminId = req.user!.id;

      const event = await EventService.approveEvent(id, adminId);

      res.json({
        status: 'success',
        message: 'Event approved and published successfully',
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Rechazar evento (solo ADMIN)
   * POST /api/v2/events/:id/reject
   */
  static async rejectEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const adminId = req.user!.id;
      const { reason } = req.body;

      const event = await EventService.rejectEvent(id, adminId, reason);

      res.json({
        status: 'success',
        message: 'Event rejected',
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener estadísticas del usuario
   * GET /api/v2/events/my-stats
   */
  static async getMyStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const stats = await EventService.getUserStats(userId, userRole);

      res.json({
        status: 'success',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar estado de un evento
   * PATCH /api/v1/events/:id/status
   */
  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user!.id;

      // Validar status
      const validStatuses = ['PUBLISHED', 'DRAFT', 'CANCELLED'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid status. Must be PUBLISHED, DRAFT, or CANCELLED',
        });
      }

      // Actualizar evento usando el service existente
      const event = await EventService.update(id, { status }, userId);

      logger.info(`Event status updated: ${id} → ${status} by user ${userId}`);

      res.json({
        status: 'success',
        data: event,
      });
    } catch (error: any) {
      logger.error(`Error updating event status: ${error.message}`);
      res.status(error.message.includes('not found') ? 404 : 500).json({
        status: 'error',
        message: error.message || 'Error updating event status',
      });
    }
  }

  /**
   * Toggle featured status
   * PATCH /events/:id/featured
   */
  static async toggleFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      // Get current event directly from DB (not cached) to ensure fresh data
      const currentEvent = await prisma.event.findUnique({
        where: { id },
        select: { id: true, featured: true },
      });

      if (!currentEvent) {
        return res.status(404).json({
          status: 'error',
          message: 'Event not found',
        });
      }

      // Toggle featured status using the singleton prisma instance
      const event = await prisma.event.update({
        where: { id },
        data: { featured: !currentEvent.featured },
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
            },
          },
        },
      });

      // ✅ Invalidate all event list caches to ensure fresh featured data
      // We use a pattern to clear all event list caches since they may contain featured filters
      try {
        await cache.del(`event:${id}`);
        await cache.del(`event:slug:${event.slug}`);
        // Clear all cached event lists (pattern-based clear isn't available, so we clear the main one)
        await cache.del('events:list');
        // Also try to clear featured-specific caches by deleting common patterns
        const keys = await cache.keys('events:list:*featured*');
        if (keys && keys.length > 0) {
          await Promise.all(keys.map((key: string) => cache.del(key)));
        }
      } catch (cacheError) {
        logger.warn('Failed to invalidate cache after featured toggle:', cacheError);
      }

      logger.info(
        `Event featured status toggled: ${id} → ${event.featured} by user ${userId}`
      );

      res.json({
        status: 'success',
        data: event,
      });
    } catch (error: any) {
      logger.error(`Error toggling event featured status: ${error.message}`);
      res.status(error.message.includes('not found') ? 404 : 500).json({
        status: 'error',
        message: error.message || 'Error toggling featured status',
      });
    }
  }
}