import { Request, Response, NextFunction } from 'express';
import { ServiceCategoryService } from '../services/serviceCategory.service';
import logger from '../utils/logger';

/**
 * ServiceCategoryController - Maneja todas las peticiones HTTP relacionadas con categorías de servicios
 */
export class ServiceCategoryController {
  /**
   * POST /api/v2/service-categories
   * Crear una nueva categoría de servicio
   * @auth Required (ORGANIZER or ADMIN)
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, icon } = req.body;

      if (!name || !icon) {
        return res.status(400).json({
          status: 'error',
          message: 'Name and icon are required',
        });
      }

      const category = await ServiceCategoryService.create({ name, icon });

      res.status(201).json({
        status: 'success',
        message: 'Service category created successfully',
        data: category,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          status: 'error',
          message: 'A category with this name already exists',
        });
      }
      next(error);
    }
  }

  /**
   * GET /api/v2/service-categories
   * Obtener todas las categorías de servicio
   * @auth No requerida
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await ServiceCategoryService.getAll();

      res.json({
        status: 'success',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/service-categories/:id
   * Obtener una categoría de servicio por ID
   * @auth No requerida
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const category = await ServiceCategoryService.getById(id);

      if (!category) {
        return res.status(404).json({
          status: 'error',
          message: 'Service category not found',
        });
      }

      res.json({
        status: 'success',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/service-categories/slug/:slug
   * Obtener una categoría de servicio por slug
   * @auth No requerida
   */
  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const category = await ServiceCategoryService.getBySlug(slug);

      if (!category) {
        return res.status(404).json({
          status: 'error',
          message: 'Service category not found',
        });
      }

      res.json({
        status: 'success',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v2/service-categories/:id
   * Actualizar una categoría de servicio
   * @auth Required (ORGANIZER or ADMIN)
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, icon } = req.body;

      const category = await ServiceCategoryService.update(id, { name, icon });

      res.json({
        status: 'success',
        message: 'Service category updated successfully',
        data: category,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          status: 'error',
          message: 'A category with this name already exists',
        });
      }
      if (error.code === 'P2025') {
        return res.status(404).json({
          status: 'error',
          message: 'Service category not found',
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/v2/service-categories/:id
   * Eliminar una categoría de servicio
   * @auth Required (ORGANIZER or ADMIN)
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await ServiceCategoryService.delete(id);

      res.json({
        status: 'success',
        message: 'Service category deleted successfully',
      });
    } catch (error: any) {
      if (error.message && error.message.includes('Cannot delete category with')) {
        return res.status(400).json({
          status: 'error',
          message: error.message,
        });
      }
      if (error.code === 'P2025') {
        return res.status(404).json({
          status: 'error',
          message: 'Service category not found',
        });
      }
      next(error);
    }
  }

  /**
   * GET /api/v2/service-categories/with-count
   * Obtener categorías con conteo de servicios
   * @auth No requerida
   */
  static async getCategoriesWithCount(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await ServiceCategoryService.getCategoriesWithCount();

      res.json({
        status: 'success',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }
}
