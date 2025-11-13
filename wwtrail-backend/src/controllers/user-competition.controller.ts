import { Request, Response, NextFunction } from 'express';
import { UserCompetitionService } from '../services/user-competition.service';
import { ParticipationStatus } from '@prisma/client';

export class UserCompetitionController {
  /**
   * POST /api/v1/user-competitions
   * Marcar una competición
   */
  static async markCompetition(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { competitionId, status } = req.body;

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
   * GET /api/v1/user-competitions
   * Obtener todas las competiciones marcadas por el usuario autenticado
   */
  static async getUserCompetitions(req: Request, res: Response, next: NextFunction) {
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
   * GET /api/v1/user-competitions/competition/:competitionId
   * Obtener estado de una competición específica para el usuario
   */
  static async getCompetitionStatus(req: Request, res: Response, next: NextFunction) {
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
   * GET /api/v1/user-competitions/stats
   * Obtener estadísticas del usuario
   */
  static async getUserStats(req: Request, res: Response, next: NextFunction) {
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

  /**
   * PUT /api/v1/user-competitions/:id
   * Actualizar una competición marcada
   */
  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const updateData = req.body;

      const updated = await UserCompetitionService.updateStatus(id, userId, updateData);

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/user-competitions/:id
   * Desmarcar una competición
   */
  static async unmarkCompetition(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const result = await UserCompetitionService.unmarkCompetition(id, userId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}