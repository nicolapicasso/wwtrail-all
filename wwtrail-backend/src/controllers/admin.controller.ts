// src/controllers/admin.controller.ts

import { Request, Response, NextFunction } from 'express';
import AdminService from '../services/admin.service';
import { UserRole } from '@prisma/client';

// ============================================
// INTERFACES
// ============================================

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

// ============================================
// ADMIN CONTROLLER
// ============================================

class AdminController {
  /**
   * @route   GET /api/v1/admin/stats
   * @desc    Obtener estadísticas generales del dashboard
   * @access  Admin
   */
  async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/v1/admin/stats/comprehensive
   * @desc    Obtener estadísticas completas del portal
   * @access  Admin
   */
  async getComprehensiveStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getComprehensiveStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/v1/admin/users
   * @desc    Listar usuarios con filtros y paginación
   * @access  Admin
   */
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        search: req.query.search as string | undefined,
        role: req.query.role as UserRole | undefined,
        isActive:
          req.query.isActive === 'true'
            ? true
            : req.query.isActive === 'false'
            ? false
            : undefined,
        isInsider:
          req.query.isInsider === 'true'
            ? true
            : req.query.isInsider === 'false'
            ? false
            : undefined,
        sortBy: (req.query.sortBy as any) || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };

      const result = await AdminService.getUsers(filters);

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/v1/admin/users/:id
   * @desc    Obtener un usuario por ID con información detallada
   * @access  Admin
   */
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await AdminService.getUserById(id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
      } else {
        next(error);
      }
    }
  }

  /**
   * @route   PATCH /api/v1/admin/users/:id/role
   * @desc    Cambiar el rol de un usuario
   * @access  Admin
   */
  async updateUserRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const adminId = req.user!.id;

      const updatedUser = await AdminService.updateUserRole(
        id,
        role as UserRole,
        adminId
      );

      res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          res.status(404).json({
            success: false,
            message: 'User not found',
          });
        } else if (error.message === 'Cannot remove your own admin role') {
          res.status(403).json({
            success: false,
            message: 'Cannot remove your own admin role',
          });
        } else {
          next(error);
        }
      } else {
        next(error);
      }
    }
  }

  /**
   * @route   PATCH /api/v1/admin/users/:id/toggle-status
   * @desc    Activar/Desactivar un usuario
   * @access  Admin
   */
  async toggleUserStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const adminId = req.user!.id;

      const updatedUser = await AdminService.toggleUserStatus(id, adminId);

      res.status(200).json({
        success: true,
        message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
        data: updatedUser,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          res.status(404).json({
            success: false,
            message: 'User not found',
          });
        } else if (error.message === 'Cannot deactivate your own account') {
          res.status(403).json({
            success: false,
            message: 'Cannot deactivate your own account',
          });
        } else {
          next(error);
        }
      } else {
        next(error);
      }
    }
  }

  /**
   * @route   PATCH /api/v1/admin/users/:id
   * @desc    Actualizar datos de un usuario
   * @access  Admin
   */
  async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await AdminService.updateUser(id, updateData);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
      } else {
        next(error);
      }
    }
  }

  /**
   * @route   DELETE /api/v1/admin/users/:id
   * @desc    Eliminar un usuario
   * @access  Admin
   */
  async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const adminId = req.user!.id;

      const result = await AdminService.deleteUser(id, adminId);

      if (result.deleted) {
        res.status(200).json({
          success: true,
          message: result.message,
        });
      } else {
        res.status(200).json({
          success: true,
          message: result.message,
          data: result.user,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          res.status(404).json({
            success: false,
            message: 'User not found',
          });
        } else if (error.message === 'Cannot delete your own account') {
          res.status(403).json({
            success: false,
            message: 'Cannot delete your own account',
          });
        } else {
          next(error);
        }
      } else {
        next(error);
      }
    }
  }

  /**
   * @route   GET /api/v1/admin/users/:id/stats
   * @desc    Obtener estadísticas de un usuario específico
   * @access  Admin
   */
  async getUserStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const stats = await AdminService.getUserStats(id);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
      } else {
        next(error);
      }
    }
  }

  /**
   * @route   GET /api/v1/admin/pending/count
   * @desc    Obtener contadores de contenido pendiente de revisión
   * @access  Admin
   */
  async getPendingContentCounts(_req: Request, res: Response, next: NextFunction) {
    try {
      const counts = await AdminService.getPendingContentCounts();

      res.status(200).json({
        success: true,
        data: counts,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/v1/admin/pending
   * @desc    Obtener listado de contenido pendiente de revisión
   * @access  Admin
   */
  async getPendingContent(_req: Request, res: Response, next: NextFunction) {
    try {
      const content = await AdminService.getPendingContent();

      res.status(200).json({
        success: true,
        data: content,
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // USER CREATION
  // ============================================

  /**
   * @route   POST /api/v1/admin/users
   * @desc    Crear un nuevo usuario
   * @access  Admin
   */
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, username, firstName, lastName, role, country, gender } = req.body;

      if (!email || !username || !firstName || !role) {
        res.status(400).json({
          success: false,
          message: 'Email, username, firstName and role are required',
        });
        return;
      }

      const result = await AdminService.createUser({
        email,
        username,
        firstName,
        lastName,
        role,
        country,
        gender,
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: result.user,
        generatedPassword: result.generatedPassword,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Email already exists') {
          res.status(409).json({
            success: false,
            message: 'Email already exists',
          });
        } else if (error.message === 'Username already exists') {
          res.status(409).json({
            success: false,
            message: 'Username already exists',
          });
        } else {
          next(error);
        }
      } else {
        next(error);
      }
    }
  }

  // ============================================
  // INSIDER MANAGEMENT
  // ============================================

  /**
   * @route   GET /api/v1/admin/insiders
   * @desc    Get all insiders with stats
   * @access  Admin
   */
  async getInsiders(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getInsiders();

      res.status(200).json({
        success: true,
        data: result.insiders,
        stats: result.stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   PATCH /api/v1/admin/users/:id/toggle-insider
   * @desc    Toggle insider status for a user
   * @access  Admin
   */
  async toggleInsiderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const updatedUser = await AdminService.toggleInsiderStatus(id);

      res.status(200).json({
        success: true,
        message: `User ${updatedUser.isInsider ? 'marked as' : 'removed from'} Insider`,
        data: updatedUser,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
      } else {
        next(error);
      }
    }
  }

  /**
   * @route   PATCH /api/v1/admin/users/:id/toggle-public
   * @desc    Toggle public status for a user
   * @access  Admin
   */
  async togglePublicStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const updatedUser = await AdminService.togglePublicStatus(id);

      res.status(200).json({
        success: true,
        message: `User profile ${updatedUser.isPublic ? 'made public' : 'made private'}`,
        data: updatedUser,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
      } else {
        next(error);
      }
    }
  }

  /**
   * @route   GET /api/v1/admin/insiders/config
   * @desc    Get insider config (badge, intro texts)
   * @access  Admin
   */
  async getInsiderConfig(_req: Request, res: Response, next: NextFunction) {
    try {
      const config = await AdminService.getInsiderConfig();

      res.status(200).json({
        success: true,
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   PUT /api/v1/admin/insiders/config
   * @desc    Update insider config
   * @access  Admin
   */
  async updateInsiderConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const config = await AdminService.updateInsiderConfig(req.body);

      res.status(200).json({
        success: true,
        message: 'Insider config updated',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
