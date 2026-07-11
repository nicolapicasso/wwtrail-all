// src/controllers/eventManager.controller.ts
// Controlador para gestionar los managers de eventos

import { Request, Response, NextFunction } from 'express';
import { eventManagerService } from '../services/eventManager.service';
import logger from '../utils/logger';

/**
 * GET /api/v2/events/:eventId/managers
 * Obtiene todos los managers de un evento
 */
export const getEventManagers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;

    const managers = await eventManagerService.getEventManagers(eventId);

    res.json({
      status: 'success',
      data: managers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v2/events/:eventId/managers
 * Añade un manager a un evento (solo admin)
 */
export const addEventManager = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;
    const assignedById = req.user!.id;

    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'userId is required',
      });
    }

    const manager = await eventManagerService.addManager({
      eventId,
      userId,
      assignedById,
    });

    res.status(201).json({
      status: 'success',
      message: 'Manager added successfully',
      data: manager,
    });
  } catch (error: any) {
    if (error.message === 'Event not found') {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    if (error.message === 'User not found') {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    if (error.message === 'User must be an ORGANIZER or ADMIN to manage events') {
      return res.status(400).json({ status: 'error', message: error.message });
    }
    if (error.message === 'User is already a manager of this event') {
      return res.status(409).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

/**
 * DELETE /api/v2/events/:eventId/managers/:userId
 * Elimina un manager de un evento (solo admin)
 */
export const removeEventManager = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId, userId } = req.params;

    await eventManagerService.removeManager(eventId, userId);

    res.json({
      status: 'success',
      message: 'Manager removed successfully',
    });
  } catch (error: any) {
    if (error.message === 'Manager not found') {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

/**
 * GET /api/v2/events/:eventId/available-organizers
 * Obtiene usuarios ORGANIZER disponibles para asignar (solo admin)
 */
export const getAvailableOrganizers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;

    const organizers = await eventManagerService.getAvailableOrganizers(eventId);

    res.json({
      status: 'success',
      data: organizers,
    });
  } catch (error: any) {
    if (error.message === 'Event not found') {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

/**
 * GET /api/v2/users/me/managed-events
 * Obtiene todos los eventos que el usuario actual puede gestionar
 */
export const getMyManagedEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const events = await eventManagerService.getUserManagedEvents(userId);

    res.json({
      status: 'success',
      data: events,
    });
  } catch (error) {
    next(error);
  }
};
