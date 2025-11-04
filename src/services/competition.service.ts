import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import { slugify } from '../utils/slugify';

const prisma = new PrismaClient();

/**
 * CompetitionService v2
 * 
 * Maneja las COMPETICIONES (distancias/carreras) dentro de un evento.
 * Ejemplo: UTMB 171K, CCC 101K, OCC 56K son competitions del evento UTMB Mont Blanc
 * 
 * Competition tiene datos BASE que heredan las Editions:
 * - baseDistance, baseElevation, baseMaxParticipants
 */
export class CompetitionService {
  /**
   * Crear una nueva competición dentro de un evento
   * @param eventId - ID del evento padre
   * @param data - Datos de la competición
   * @param userId - ID del usuario (debe ser organizador del evento o ADMIN)
   */
  static async create(eventId: string, data: any, userId: string) {
    // Verificar que el evento existe
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, organizerId: true, slug: true },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Verificar permisos (organizador del evento o ADMIN)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN' && event.organizerId !== userId) {
      throw new Error('Unauthorized: Only event organizer or admin can create competitions');
    }

    // Generar slug único basado en evento + nombre de competición
    const baseSlug = `${event.slug}-${slugify(data.name)}`;
    const slug = await this.generateUniqueSlug(baseSlug);

    // Crear competición
    const competition = await prisma.competition.create({
      data: {
        eventId,
        name: data.name,
        slug,
        description: data.description,
        type: data.type,
        
        // Datos base que heredarán las editions
        baseDistance: data.baseDistance,
        baseElevation: data.baseElevation,
        baseMaxParticipants: data.baseMaxParticipants,
        

        
        // Orden de visualización
        displayOrder: data.displayOrder || 0,
        
        // Estado
        isActive: true,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            country: true,
            city: true,
          },
        },
        _count: {
          select: {
            editions: true,
          },
        },
      },
    });

    logger.info(`Competition created: ${competition.id} - ${competition.name} (Event: ${event.slug})`);

    return competition;
  }

  /**
   * Obtener todas las competiciones de un evento
   * @param eventId - ID del evento
   */
  static async findByEvent(eventId: string) {
    const competitions = await prisma.competition.findMany({
      where: {
        eventId,
        isActive: true,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            editions: true,
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return competitions;
  }

  /**
   * Obtener una competición por ID
   * @param id - ID de la competición
   */
  static async findById(id: string) {
    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            country: true,
            city: true,
            organizerId: true,
          },
        },
        editions: {
          where: { isActive: true },
          orderBy: { year: 'desc' },
          take: 10,
          select: {
            id: true,
            year: true,
            slug: true,
            startDate: true,
            status: true,
            price: true,
            registrationStatus: true,
          },
        },
        _count: {
          select: {
            editions: true,
          },
        },
      },
    });

    if (!competition) {
      throw new Error('Competition not found');
    }

    return competition;
  }

  /**
   * Obtener una competición por slug
   * @param slug - Slug de la competición
   */
  static async findBySlug(slug: string) {
    const competition = await prisma.competition.findFirst({
      where: { slug },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            country: true,
            city: true,
          },
        },
        editions: {
          orderBy: { year: 'desc' },
          take: 10,
          select: {
            id: true,
            year: true,
            slug: true,
            startDate: true,
            status: true,
            price: true,
            registrationStatus: true,
          },
        },
        _count: {
          select: {
            editions: true,
          },
        },
      },
    });

    if (!competition) {
      throw new Error('Competition not found');
    }

    return competition;
  }

  /**
   * Actualizar una competición
   * @param id - ID de la competición
   * @param data - Datos a actualizar
   * @param userId - ID del usuario
   */
  static async update(id: string, data: any, userId: string) {
    // Verificar que existe
    const existing = await prisma.competition.findUnique({
      where: { id },
      include: {
        event: {
          select: { organizerId: true },
        },
      },
    });

    if (!existing) {
      throw new Error('Competition not found');
    }

    // Verificar permisos
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN' && existing.event.organizerId !== userId) {
      throw new Error('Unauthorized: Only event organizer or admin can update this competition');
    }

    // Actualizar
    const competition = await prisma.competition.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        baseDistance: data.baseDistance,
        baseElevation: data.baseElevation,
        baseMaxParticipants: data.baseMaxParticipants,
        displayOrder: data.displayOrder,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            editions: true,
          },
        },
      },
    });

    logger.info(`Competition updated: ${id}`);

    return competition;
  }

  /**
   * Eliminar una competición
   * CUIDADO: También elimina todas sus editions (cascade)
   * @param id - ID de la competición
   * @param userId - ID del usuario
   */
  static async delete(id: string, userId: string) {
    // Verificar que existe
    const existing = await prisma.competition.findUnique({
      where: { id },
      include: {
        event: {
          select: { organizerId: true },
        },
        _count: {
          select: {
            editions: true,
          },
        },
      },
    });

    if (!existing) {
      throw new Error('Competition not found');
    }

    // Verificar permisos
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN' && existing.event.organizerId !== userId) {
      throw new Error('Unauthorized: Only event organizer or admin can delete this competition');
    }

    // Advertir si tiene editions
    if (existing._count.editions > 0) {
      logger.warn(
        `Deleting competition ${id} with ${existing._count.editions} editions (cascade delete)`
      );
    }

    // Eliminar (cascade a editions)
    await prisma.competition.delete({
      where: { id },
    });

    logger.warn(`Competition deleted: ${id} - ${existing.name}`);

    return { message: 'Competition deleted successfully' };
  }

  /**
   * Reordenar competiciones de un evento
   * @param eventId - ID del evento
   * @param order - Array de { id, displayOrder }
   * @param userId - ID del usuario
   */
  static async reorder(eventId: string, order: { id: string; displayOrder: number }[], userId: string) {
    // Verificar que el evento existe
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, organizerId: true },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Verificar permisos
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN' && event.organizerId !== userId) {
      throw new Error('Unauthorized');
    }

    // Actualizar orden en transacción
    await prisma.$transaction(
      order.map((item) =>
        prisma.competition.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        })
      )
    );

    logger.info(`Competitions reordered for event ${eventId}`);

    return { message: 'Competitions reordered successfully' };
  }

  /**
   * Activar/desactivar una competición
   * @param id - ID de la competición
   * @param userId - ID del usuario
   */
  static async toggleActive(id: string, userId: string) {
    // Verificar que existe
    const existing = await prisma.competition.findUnique({
      where: { id },
      include: {
        event: {
          select: { organizerId: true },
        },
      },
    });

    if (!existing) {
      throw new Error('Competition not found');
    }

    // Verificar permisos
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN' && existing.event.organizerId !== userId) {
      throw new Error('Unauthorized');
    }

    // Toggle
    const competition = await prisma.competition.update({
      where: { id },
      data: {
        isActive: !existing.isActive,
      },
    });

    logger.info(`Competition ${id} active status changed to: ${competition.isActive}`);

    return competition;
  }

  /**
   * Generar slug único para una competición
   * @param baseSlug - Slug base
   */
  private static async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.competition.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existing) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }
}
