import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/event.service';
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
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = req.body;

      const event = await EventService.create(data, userId);

      res.status(201).json({
        status: 'success',
        message: 'Event created successfully',
        data: event,
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
   * @auth No requerida
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const event = await EventService.findById(id);

      res.json({
        status: 'success',
        data: event,
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
}
