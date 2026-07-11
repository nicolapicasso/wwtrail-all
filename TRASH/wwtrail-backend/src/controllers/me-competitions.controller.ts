import { Request, Response, NextFunction } from 'express';
import { UserCompetitionService } from '../services/user-competition.service';
import { ParticipationStatus } from '@prisma/client';

export class MeCompetitionsController {
  /**
   * POST /api/v1/me/competitions/:competitionId/mark
   * Marcar una competición
   */
  static async markCompetition(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { competitionId } = req.params;
      const { status } = req.body;

      const userCompetition = await UserCompetitionService.markCompetition(
        userId,
        competitionId,
        status || ParticipationStatus.INTERESTED
      );

      res.status(201).json({
        success: true,
        data: userCompetition,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/me/competitions/:competitionId/unmark
   * Desmarcar una competición por competitionId
   */
  static async unmarkCompetition(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { competitionId } = req.params;

      // Buscar el userCompetition por userId y competitionId
      const userCompetition = await UserCompetitionService.getCompetitionStatus(userId, competitionId);
      
      if (!userCompetition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not marked',
        });
      }

      // Eliminar usando el id del userCompetition
      const result = await UserCompetitionService.unmarkCompetition(userCompetition.id, userId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/me/competitions/:competitionId/status
   * Actualizar el estado de una competición marcada
   */
  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { competitionId } = req.params;
      const updateData = req.body;

      // Buscar el userCompetition
      const userCompetition = await UserCompetitionService.getCompetitionStatus(userId, competitionId);
      
      if (!userCompetition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not marked',
        });
      }

      // Actualizar usando el id del userCompetition
      const updated = await UserCompetitionService.updateStatus(userCompetition.id, userId, updateData);

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/me/competitions/:competitionId/status
   * Obtener el estado de una competición
   */
  static async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { competitionId } = req.params;

      const status = await UserCompetitionService.getCompetitionStatus(userId, competitionId);

      res.json({
        success: true,
        data: status,
        isMarked: !!status,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/me/competitions
   * Obtener todas las competiciones marcadas del usuario autenticado
   */
  static async getMyCompetitions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { status } = req.query;

      const filters: any = {};
      if (status) {
        filters.status = status as ParticipationStatus;
      }

      const userCompetitions = await UserCompetitionService.getUserCompetitions(userId, filters);

      res.json({
        success: true,
        data: userCompetitions,
        count: userCompetitions.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/me/competitions/stats
   * Obtener estadísticas
   */
  static async getMyStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const stats = await UserCompetitionService.getUserStats(userId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}
