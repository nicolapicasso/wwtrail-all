import { Request, Response, NextFunction } from 'express';
import { ServiceService } from '../services/service.service';
import logger from '../utils/logger';

/**
 * ServiceController - Maneja todas las peticiones HTTP relacionadas con servicios
 * (Alojamientos, Restaurantes, Tiendas, Puntos de Información, etc.)
 */
export class ServiceController {
  /**
   * POST /api/v2/services
   * Crear un nuevo servicio
   * @auth Required (ORGANIZER o ADMIN)
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const userId = req.user!.id;

      const service = await ServiceService.create({
        ...data,
        organizerId: userId,
      });

      res.status(201).json({
        status: 'success',
        message: 'Service created successfully',
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/services
   * Obtener todos los servicios con filtros opcionales
   * @auth No requerida
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;

      const result = await ServiceService.getAll(filters);

      res.json({
        status: 'success',
        data: result.services,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/services/categories
   * Obtener todas las categorías únicas
   * @auth No requerida
   */
  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await ServiceService.getCategories();

      res.json({
        status: 'success',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/services/slug/:slug
   * Obtener un servicio por slug
   * @auth No requerida
   */
  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const service = await ServiceService.getBySlug(slug);

      if (!service) {
        return res.status(404).json({
          status: 'error',
          message: 'Service not found',
        });
      }

      res.json({
        status: 'success',
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/services/:id
   * Obtener un servicio por ID
   * @auth No requerida
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const service = await ServiceService.getById(id);

      if (!service) {
        return res.status(404).json({
          status: 'error',
          message: 'Service not found',
        });
      }

      res.json({
        status: 'success',
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v2/services/:id
   * Actualizar un servicio
   * @auth Required (Owner o ADMIN)
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      // Verificar que el usuario sea el organizador o admin
      const existingService = await ServiceService.getById(id);
      if (!existingService) {
        return res.status(404).json({
          status: 'error',
          message: 'Service not found',
        });
      }

      if (existingService.organizerId !== userId && userRole !== 'ADMIN') {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to update this service',
        });
      }

      const service = await ServiceService.update(id, data);

      res.json({
        status: 'success',
        message: 'Service updated successfully',
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v2/services/:id
   * Eliminar un servicio
   * @auth Required (Owner o ADMIN)
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      // Verificar que el usuario sea el organizador o admin
      const existingService = await ServiceService.getById(id);
      if (!existingService) {
        return res.status(404).json({
          status: 'error',
          message: 'Service not found',
        });
      }

      if (existingService.organizerId !== userId && userRole !== 'ADMIN') {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to delete this service',
        });
      }

      await ServiceService.delete(id);

      res.json({
        status: 'success',
        message: 'Service deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v2/services/:id/featured
   * Toggle featured status de un servicio
   * @auth Required (ADMIN)
   */
  static async toggleFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const service = await ServiceService.toggleFeatured(id);

      logger.info(
        `Service featured status toggled: ${id} → ${service.featured} by user ${userId}`
      );

      res.json({
        status: 'success',
        message: `Service ${service.featured ? 'marked' : 'unmarked'} as featured`,
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/services/organizer/:organizerId
   * Obtener servicios de un organizador
   * @auth Required (Owner o ADMIN)
   */
  static async getByOrganizer(req: Request, res: Response, next: NextFunction) {
    try {
      const { organizerId } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      // Verificar que el usuario sea el organizador o admin
      if (organizerId !== userId && userRole !== 'ADMIN') {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to view these services',
        });
      }

      const services = await ServiceService.getByOrganizer(organizerId);

      res.json({
        status: 'success',
        data: services,
        count: services.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/services/categories
   * Obtener todas las categorías únicas de servicios
   * @auth Public
   */
  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await ServiceService.getCategories();

      res.json({
        status: 'success',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/services/categories/count
   * Obtener todas las categorías con conteo de servicios
   * @auth Required (ADMIN)
   */
  static async getCategoriesWithCount(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await ServiceService.getCategoriesWithCount();

      res.json({
        status: 'success',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v2/services/categories/:category
   * Eliminar una categoría (actualiza servicios a "Sin categoría")
   * @auth Required (ADMIN)
   */
  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.params;

      if (!category) {
        return res.status(400).json({
          status: 'error',
          message: 'Category parameter is required',
        });
      }

      const result = await ServiceService.deleteCategory(decodeURIComponent(category));

      res.json({
        status: 'success',
        message: `Category deleted successfully. ${result.updatedCount} services updated.`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/services/nearby
   * Obtener servicios cercanos por coordenadas
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

      const services = await ServiceService.findNearby(latitude, longitude, radiusKm);

      res.json({
        status: 'success',
        data: services,
        count: services.length,
      });
    } catch (error) {
      next(error);
    }
  }
}
