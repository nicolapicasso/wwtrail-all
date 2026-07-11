import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';

// Extender Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data: RegisterInput = req.body;
      const result = await AuthService.register(data);

      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data: LoginInput = req.body;
      const result = await AuthService.login(data);

      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({
          status: 'error',
          message: 'Refresh token is required',
        });
      }

      const result = await AuthService.refreshToken(refreshToken);

      res.status(200).json({
        status: 'success',
        message: 'Token refreshed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({
          status: 'error',
          message: 'Refresh token is required',
        });
      }

      const result = await AuthService.logout(refreshToken);

      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Logout de todos los dispositivos (requiere autenticación)
  static async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required',
        });
      }

      const result = await AuthService.logoutAll(req.user.id);

      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          tokensDeleted: result.tokensDeleted,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener información del usuario actual (requiere autenticación)
  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required',
        });
      }

      const user = await AuthService.getCurrentUser(req.user.id);

      res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Mantener compatibilidad con getProfile (alias de me)
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    return AuthController.me(req, res, next);
  }
}
