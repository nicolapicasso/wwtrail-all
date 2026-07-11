// src/controllers/favorites.controller.ts

import { Request, Response, NextFunction } from 'express';
import favoritesService from '../services/favorites.service';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class FavoritesController {
  /**
   * Add competition to favorites
   * POST /api/v2/favorites/:competitionId
   */
  static async addFavorite(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const { competitionId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const favorite = await favoritesService.addFavorite(userId, competitionId);

      return res.status(201).json({
        success: true,
        data: favorite,
        message: 'Competition added to favorites',
      });
    } catch (error: any) {
      if (error.message === 'Competition not found') {
        return res.status(404).json({
          success: false,
          message: 'Competition not found',
        });
      }

      next(error);
    }
  }

  /**
   * Remove competition from favorites
   * DELETE /api/v2/favorites/:competitionId
   */
  static async removeFavorite(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const { competitionId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const result = await favoritesService.removeFavorite(userId, competitionId);

      return res.json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      if (error.message === 'Favorite not found') {
        return res.status(404).json({
          success: false,
          message: 'Favorite not found',
        });
      }

      next(error);
    }
  }

  /**
   * Get all user's favorites
   * GET /api/v2/favorites
   */
  static async getUserFavorites(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const favorites = await favoritesService.getUserFavorites(userId);

      return res.json({
        success: true,
        data: favorites,
        count: favorites.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check if competition is favorited
   * GET /api/v2/favorites/check/:competitionId
   */
  static async checkFavorite(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const { competitionId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const isFavorite = await favoritesService.isFavorite(userId, competitionId);

      return res.json({
        success: true,
        data: { isFavorite },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default FavoritesController;
