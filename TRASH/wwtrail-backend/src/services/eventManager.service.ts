// src/services/eventManager.service.ts
// Servicio para gestionar los managers de eventos

import { prisma } from '../config/database';
import logger from '../utils/logger';

export interface EventManagerWithUser {
  id: string;
  eventId: string;
  userId: string;
  assignedById: string | null;
  createdAt: Date;
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
  };
}

export interface AddManagerInput {
  eventId: string;
  userId: string;
  assignedById: string;
}

class EventManagerService {
  /**
   * Obtiene todos los managers de un evento
   */
  async getEventManagers(eventId: string): Promise<EventManagerWithUser[]> {
    const managers = await prisma.eventManager.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return managers;
  }

  /**
   * Añade un manager a un evento
   * Solo los admins pueden añadir managers
   */
  async addManager(input: AddManagerInput): Promise<EventManagerWithUser> {
    const { eventId, userId, assignedById } = input;

    // Verificar que el evento existe
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, name: true },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Verificar que el usuario existe y es ORGANIZER o ADMIN
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'ORGANIZER' && user.role !== 'ADMIN') {
      throw new Error('User must be an ORGANIZER or ADMIN to manage events');
    }

    // Verificar si ya es manager
    const existing = await prisma.eventManager.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (existing) {
      throw new Error('User is already a manager of this event');
    }

    // Crear el manager
    const manager = await prisma.eventManager.create({
      data: {
        eventId,
        userId,
        assignedById,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    logger.info(`User ${userId} added as manager to event ${eventId} by ${assignedById}`);

    return manager;
  }

  /**
   * Elimina un manager de un evento
   */
  async removeManager(eventId: string, userId: string): Promise<void> {
    const manager = await prisma.eventManager.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (!manager) {
      throw new Error('Manager not found');
    }

    await prisma.eventManager.delete({
      where: { id: manager.id },
    });

    logger.info(`User ${userId} removed as manager from event ${eventId}`);
  }

  /**
   * Obtiene todos los eventos que un usuario puede gestionar
   * (donde es creador o manager)
   */
  async getUserManagedEvents(userId: string): Promise<any[]> {
    // Eventos donde es creador
    const createdEvents = await prisma.event.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        city: true,
        country: true,
      },
    });

    // Eventos donde es manager asignado
    const managedEvents = await prisma.eventManager.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            city: true,
            country: true,
          },
        },
      },
    });

    // Combinar y eliminar duplicados
    const allEvents = [
      ...createdEvents.map((e) => ({ ...e, role: 'CREATOR' })),
      ...managedEvents.map((m) => ({ ...m.event, role: 'MANAGER' })),
    ];

    // Eliminar duplicados por id
    const uniqueEvents = allEvents.reduce((acc, event) => {
      if (!acc.find((e) => e.id === event.id)) {
        acc.push(event);
      }
      return acc;
    }, [] as typeof allEvents);

    return uniqueEvents;
  }

  /**
   * Obtiene usuarios ORGANIZER disponibles para asignar a un evento
   */
  async getAvailableOrganizers(eventId: string): Promise<any[]> {
    // Obtener IDs de usuarios que ya son managers
    const existingManagers = await prisma.eventManager.findMany({
      where: { eventId },
      select: { userId: true },
    });

    const existingManagerIds = existingManagers.map((m) => m.userId);

    // Obtener el creador del evento
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { userId: true },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Excluir también al creador
    const excludeIds = [...existingManagerIds, event.userId];

    // Buscar usuarios ORGANIZER que no están asignados
    const organizers = await prisma.user.findMany({
      where: {
        role: 'ORGANIZER',
        id: { notIn: excludeIds },
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });

    return organizers;
  }
}

export const eventManagerService = new EventManagerService();
