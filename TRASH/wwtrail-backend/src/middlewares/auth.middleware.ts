import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import prisma from '../config/database';
import { UserRole } from '@prisma/client';

// Extender Request para incluir usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('No token provided', 401));
    }

    const token = authHeader.substring(7);

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: UserRole;
    };

    // Verificar que el usuario existe y está activo
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return next(new AppError('User not found or inactive', 401));
    }

    // Agregar usuario al request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para verificar roles
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

// Middleware para verificar que el usuario accede a su propia información
export const authorizeOwner = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', 401));
  }

  const userId = req.params.userId || req.params.id;

  if (req.user.role !== 'ADMIN' && req.user.id !== userId) {
    return next(new AppError('Insufficient permissions', 403));
  }

  next();
};

// Middleware de autenticación OPCIONAL
// Detecta si hay un token válido pero NO falla si no hay
export const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    // Si no hay token, continuar sin usuario
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        email: string;
        role: UserRole;
      };

      // Verificar que el usuario existe y está activo
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true, isActive: true },
      });

      if (user && user.isActive) {
        // Agregar usuario al request
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      }
    } catch (error) {
      // Si el token es inválido, continuar sin usuario (no lanzar error)
    }

    next();
  } catch (error) {
    next(error);
  }
};
