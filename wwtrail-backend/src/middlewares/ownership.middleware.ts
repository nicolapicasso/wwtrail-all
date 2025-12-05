// src/middlewares/ownership.middleware.ts
// Middleware para verificar que el usuario es dueño del recurso
// o tiene permisos asignados para gestionarlo

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { ForbiddenError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Verifica si un usuario puede gestionar un evento.
 * Puede gestionar si:
 * - Es ADMIN
 * - Es el creador del evento (userId)
 * - Es un EventManager asignado al evento
 */
async function canUserManageEvent(userId: string, eventId: string): Promise<boolean> {
  // Buscar el evento y verificar si es el creador
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { userId: true },
  });

  if (!event) {
    return false;
  }

  // Es el creador
  if (event.userId === userId) {
    return true;
  }

  // Verificar si es un manager asignado
  const manager = await prisma.eventManager.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId,
      },
    },
  });

  return !!manager;
}

/**
 * Verifica que el usuario es el creador del evento,
 * es un EventManager asignado, o es ADMIN
 */
export const checkEventOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const eventId = req.params.id || req.params.eventId;

    // ADMIN puede hacer todo
    if (userRole === 'ADMIN') {
      logger.info(`Admin ${userId} accessing event ${eventId}`);
      return next();
    }

    // Buscar el evento
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { userId: true, name: true },
    });

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    // Verificar si puede gestionar el evento
    const canManage = await canUserManageEvent(userId, eventId);

    if (!canManage) {
      logger.warn(`User ${userId} attempted to access event ${eventId} without permission`);
      throw new ForbiddenError('You do not have permission to modify this event');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verifica que el usuario puede gestionar la competición
 * (a través de los permisos del evento padre)
 */
export const checkCompetitionOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const competitionId = req.params.id || req.params.competitionId;

    // ADMIN puede hacer todo
    if (userRole === 'ADMIN') {
      logger.info(`Admin ${userId} accessing competition ${competitionId}`);
      return next();
    }

    // Buscar la competición con su evento
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
      select: {
        eventId: true,
        event: {
          select: { userId: true },
        },
      },
    });

    if (!competition) {
      throw new NotFoundError('Competition not found');
    }

    // Verificar si puede gestionar el evento padre
    const canManage = await canUserManageEvent(userId, competition.eventId);

    if (!canManage) {
      logger.warn(`User ${userId} attempted to access competition ${competitionId} without permission`);
      throw new ForbiddenError('You do not have permission to modify this competition');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verifica que el usuario puede gestionar la edición
 * (a través de los permisos del evento abuelo)
 */
export const checkEditionOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const editionId = req.params.id || req.params.editionId;

    // ADMIN puede hacer todo
    if (userRole === 'ADMIN') {
      logger.info(`Admin ${userId} accessing edition ${editionId}`);
      return next();
    }

    // Buscar la edición con su competición y evento
    const edition = await prisma.edition.findUnique({
      where: { id: editionId },
      select: {
        competition: {
          select: {
            eventId: true,
            event: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!edition) {
      throw new NotFoundError('Edition not found');
    }

    // Verificar si puede gestionar el evento abuelo
    const canManage = await canUserManageEvent(userId, edition.competition.eventId);

    if (!canManage) {
      logger.warn(`User ${userId} attempted to access edition ${editionId} without permission`);
      throw new ForbiddenError('You do not have permission to modify this edition');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Función helper exportada para usar en services
 */
export { canUserManageEvent };
