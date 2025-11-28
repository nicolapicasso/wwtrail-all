// src/controllers/userEdition.controller.ts

import { Request, Response, NextFunction } from 'express';
import userEditionService from '../services/userEdition.service';
import { UserEditionInput, SearchEditionsQuery } from '../schemas/userEdition.schema';

// ============================================
// INTERFACES
// ============================================

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// ============================================
// USER EDITION CONTROLLER
// ============================================

export class UserEditionController {
  /**
   * Crear o actualizar participación
   * POST /api/v2/users/me/participations/:editionId
   * PUT /api/v2/users/me/participations/:editionId
   */
  static async upsertParticipation(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const { editionId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const data: UserEditionInput = req.body;

      const participation = await userEditionService.upsertParticipation(
        userId,
        editionId,
        data
      );

      return res.json({
        success: true,
        data: participation,
        message: 'Participation saved successfully',
      });
    } catch (error: any) {
      if (error.message === 'Edition not found') {
        return res.status(404).json({
          success: false,
          message: 'Edition not found',
        });
      }

      next(error);
    }
  }

  /**
   * Obtener participación en una edición
   * GET /api/v2/users/me/participations/:editionId
   */
  static async getParticipation(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const { editionId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const participation = await userEditionService.getParticipation(
        userId,
        editionId
      );

      if (!participation) {
        return res.status(404).json({
          success: false,
          message: 'Participation not found',
        });
      }

      return res.json({
        success: true,
        data: participation,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar participación
   * DELETE /api/v2/users/me/participations/:editionId
   */
  static async deleteParticipation(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const { editionId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const result = await userEditionService.deleteParticipation(
        userId,
        editionId
      );

      return res.json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      if (error.message === 'Participation not found') {
        return res.status(404).json({
          success: false,
          message: 'Participation not found',
        });
      }

      next(error);
    }
  }

  /**
   * Buscar ediciones para selector
   * GET /api/v2/editions/search
   */
  static async searchEditions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query = req.query as unknown as SearchEditionsQuery;

      const result = await userEditionService.searchEditions(query);

      return res.json({
        success: true,
        data: result.editions,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserEditionController;
