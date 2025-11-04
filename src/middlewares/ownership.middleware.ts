// src/middlewares/ownership.middleware.ts
// Middleware para verificar que el usuario es dueño del recurso

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { ForbiddenError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Verifica que el usuario es el organizador del evento
 * O que es ADMIN (los admin pueden editar cualquier cosa)
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
      select: { organizerId: true, name: true },
    });

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    // Verificar ownership
    if (event.organizerId !== userId) {
      logger.warn(`User ${userId} attempted to access event ${eventId} without permission`);
      throw new ForbiddenError('You do not have permission to modify this event');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verifica que el usuario es el organizador de la competición
 * O que es ADMIN
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
        event: {
          select: { organizerId: true },
        },
      },
    });

    if (!competition) {
      throw new NotFoundError('Competition not found');
    }

    // Verificar ownership a través del evento
    if (competition.event.organizerId !== userId) {
      logger.warn(`User ${userId} attempted to access competition ${competitionId} without permission`);
      throw new ForbiddenError('You do not have permission to modify this competition');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verifica que el usuario es el organizador de la edición
 * O que es ADMIN
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
            event: {
              select: { organizerId: true },
            },
          },
        },
      },
    });

    if (!edition) {
      throw new NotFoundError('Edition not found');
    }

    // Verificar ownership a través del evento
    if (edition.competition.event.organizerId !== userId) {
      logger.warn(`User ${userId} attempted to access edition ${editionId} without permission`);
      throw new ForbiddenError('You do not have permission to modify this edition');
    }

    next();
  } catch (error) {
    next(error);
  }
};
