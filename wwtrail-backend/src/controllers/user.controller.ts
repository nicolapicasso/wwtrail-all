// src/controllers/user.controller.ts

import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import { UpdateUserInput, ChangePasswordInput, GetPublicUsersQuery } from '../schemas/user.schema';

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
// USER CONTROLLER
// ============================================

export class UserController {
  /**
   * Obtener perfil propio (autenticado)
   * GET /api/v2/users/me
   */
  static async getOwnProfile(
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

      const user = await userService.getOwnProfile(userId);

      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener perfil público por username
   * GET /api/v2/users/profile/:username
   */
  static async getPublicProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { username } = req.params;

      const user = await userService.getPublicProfileByUsername(username);

      return res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      if (error.message === 'This profile is private') {
        return res.status(403).json({
          success: false,
          message: 'This profile is private',
        });
      }

      next(error);
    }
  }

  /**
   * Listar usuarios públicos
   * GET /api/v2/users
   */
  static async getPublicUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query = req.query as unknown as GetPublicUsersQuery;

      const result = await userService.getPublicUsers(query);

      return res.json({
        success: true,
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar perfil propio
   * PUT /api/v2/users/me
   */
  static async updateOwnProfile(
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

      const data: UpdateUserInput = req.body;

      const updatedUser = await userService.updateProfile(userId, data);

      return res.json({
        success: true,
        data: updatedUser,
        message: 'Profile updated successfully',
      });
    } catch (error: any) {
      if (error.message === 'Username already taken') {
        return res.status(409).json({
          success: false,
          message: 'Username already taken',
        });
      }

      next(error);
    }
  }

  /**
   * Cambiar contraseña
   * POST /api/v2/users/me/change-password
   */
  static async changePassword(
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

      const data: ChangePasswordInput = req.body;

      const result = await userService.changePassword(userId, data);

      return res.json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      if (error.message === 'Current password is incorrect') {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }

      next(error);
    }
  }

  /**
   * Obtener participaciones del usuario autenticado
   * GET /api/v2/users/me/participations
   */
  static async getOwnParticipations(
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

      const participations = await userService.getUserParticipations(userId);

      return res.json({
        success: true,
        data: participations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener participantes de una edición (público)
   * GET /api/v2/editions/:editionId/participants
   */
  static async getEditionParticipants(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { editionId } = req.params;

      const participants = await userService.getEditionParticipants(editionId);

      return res.json({
        success: true,
        data: participants,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
