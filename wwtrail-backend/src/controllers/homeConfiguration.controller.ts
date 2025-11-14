import { Request, Response, NextFunction } from 'express';
import { HomeConfigurationService } from '../services/homeConfiguration.service';

export class HomeConfigurationController {
  /**
   * GET /api/v2/home/config
   * Obtener la configuración activa de la home (pública)
   */
  static async getActive(req: Request, res: Response, next: NextFunction) {
    try {
      const config = await HomeConfigurationService.getActiveConfiguration();

      res.status(200).json({
        status: 'success',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/home/config/:id
   * Obtener configuración por ID (admin)
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const config = await HomeConfigurationService.getById(id);

      res.status(200).json({
        status: 'success',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v2/home/config
   * Crear nueva configuración (admin)
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      const config = await HomeConfigurationService.create(data);

      res.status(201).json({
        status: 'success',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v2/home/config/:id
   * Actualizar configuración básica (admin)
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;

      const config = await HomeConfigurationService.update(id, data);

      res.status(200).json({
        status: 'success',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v2/home/config/:id/full
   * Actualizar configuración completa (hero + bloques) (admin)
   */
  static async updateFull(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;

      const config = await HomeConfigurationService.updateFull(id, data);

      res.status(200).json({
        status: 'success',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v2/home/config/:id
   * Eliminar configuración (admin)
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await HomeConfigurationService.delete(id);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v2/home/config/:id/reorder
   * Reordenar bloques (admin)
   */
  static async reorderBlocks(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;

      const config = await HomeConfigurationService.reorderBlocks(id, data);

      res.status(200).json({
        status: 'success',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  // =================================
  // BLOQUES INDIVIDUALES
  // =================================

  /**
   * POST /api/v2/home/config/:id/blocks
   * Crear nuevo bloque (admin)
   */
  static async createBlock(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;

      const block = await HomeConfigurationService.createBlock(id, data);

      res.status(201).json({
        status: 'success',
        data: block,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v2/home/blocks/:blockId
   * Actualizar bloque existente (admin)
   */
  static async updateBlock(req: Request, res: Response, next: NextFunction) {
    try {
      const { blockId } = req.params;
      const data = req.body;

      const block = await HomeConfigurationService.updateBlock(blockId, data);

      res.status(200).json({
        status: 'success',
        data: block,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v2/home/blocks/:blockId
   * Eliminar bloque (admin)
   */
  static async deleteBlock(req: Request, res: Response, next: NextFunction) {
    try {
      const { blockId } = req.params;

      const result = await HomeConfigurationService.deleteBlock(blockId);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v2/home/blocks/:blockId/toggle
   * Cambiar visibilidad de un bloque (admin)
   */
  static async toggleBlockVisibility(req: Request, res: Response, next: NextFunction) {
    try {
      const { blockId } = req.params;

      const block = await HomeConfigurationService.toggleBlockVisibility(blockId);

      res.status(200).json({
        status: 'success',
        data: block,
      });
    } catch (error) {
      next(error);
    }
  }
}
