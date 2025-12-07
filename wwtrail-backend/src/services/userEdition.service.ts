// src/services/userEdition.service.ts

import { Prisma, PodiumType, ParticipationStatus } from '@prisma/client';
import prisma from '../config/database';
import { UserEditionInput, SearchEditionsQuery } from '../schemas/userEdition.schema';
import { zancadasService } from './zancadas.service';
import logger from '../utils/logger';

// ============================================
// INTERFACES
// ============================================

interface UserEditionResult {
  id: string;
  editionId: string;
  status: ParticipationStatus;
  finishTime: string | null;
  position: number | null;
  categoryPosition: number | null;
  categoryType: PodiumType | null;
  categoryName: string | null;
  bibNumber: string | null;
  notes: string | null;
  personalRating: number | null;
  edition: {
    id: string;
    year: number;
    slug: string;
    competition: {
      id: string;
      name: string;
      slug: string;
      event: {
        id: string;
        name: string;
        slug: string;
      };
    };
  };
}

// ============================================
// USER EDITION SERVICE
// ============================================

class UserEditionService {
  /**
   * Convertir tiempo HH:MM:SS a segundos
   */
  private timeToSeconds(time: string): number {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Crear o actualizar participación en una edición
   */
  async upsertParticipation(
    userId: string,
    editionId: string,
    data: UserEditionInput
  ): Promise<UserEditionResult> {
    // Verificar que la edición existe
    const edition = await prisma.edition.findUnique({
      where: { id: editionId },
      select: { id: true },
    });

    if (!edition) {
      throw new Error('Edition not found');
    }

    // Obtener estado anterior para comparar (si existe)
    const existingParticipation = await prisma.userEdition.findUnique({
      where: {
        userId_editionId: { userId, editionId },
      },
      select: { status: true },
    });
    const previousStatus = existingParticipation?.status;

    // Preparar datos
    const updateData: Prisma.UserEditionUpdateInput = {
      status: data.status as ParticipationStatus,
      finishTime: data.finishTime || null,
      finishTimeSeconds: data.finishTime ? this.timeToSeconds(data.finishTime) : null,
      position: data.position || null,
      categoryPosition: data.categoryPosition || null,
      categoryType: data.categoryType as PodiumType || null,
      categoryName: data.categoryType === 'CATEGORY' ? data.categoryName : null,
      bibNumber: data.bibNumber || null,
      notes: data.notes || null,
      personalRating: data.personalRating || null,
      completedAt: data.status === 'COMPLETED' ? new Date() : null,
    };

    // Upsert: crear o actualizar
    const participation = await prisma.userEdition.upsert({
      where: {
        userId_editionId: {
          userId,
          editionId,
        },
      },
      create: {
        userId,
        editionId,
        status: data.status as ParticipationStatus,
        finishTime: data.finishTime || null,
        finishTimeSeconds: data.finishTime ? this.timeToSeconds(data.finishTime) : null,
        position: data.position || null,
        categoryPosition: data.categoryPosition || null,
        categoryType: data.categoryType as PodiumType || null,
        categoryName: data.categoryType === 'CATEGORY' ? data.categoryName : null,
        bibNumber: data.bibNumber || null,
        notes: data.notes || null,
        personalRating: data.personalRating || null,
        completedAt: data.status === 'COMPLETED' ? new Date() : null,
      },
      update: updateData,
      select: {
        id: true,
        editionId: true,
        status: true,
        finishTime: true,
        position: true,
        categoryPosition: true,
        categoryType: true,
        categoryName: true,
        bibNumber: true,
        notes: true,
        personalRating: true,
        edition: {
          select: {
            id: true,
            year: true,
            slug: true,
            competition: {
              select: {
                id: true,
                name: true,
                slug: true,
                event: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Integración Zancadas: otorgar puntos si el estado cambió a uno que los otorga
    // Solo si es un cambio de estado (no si el estado anterior era el mismo)
    const newStatus = data.status as ParticipationStatus;
    if (newStatus !== previousStatus) {
      zancadasService.onParticipationMarked(userId, editionId, newStatus).catch((error) => {
        logger.error(`Error in Zancadas onParticipationMarked: ${error}`);
      });
    }

    return participation;
  }

  /**
   * Obtener participación de un usuario en una edición
   */
  async getParticipation(userId: string, editionId: string) {
    const participation = await prisma.userEdition.findUnique({
      where: {
        userId_editionId: {
          userId,
          editionId,
        },
      },
      select: {
        id: true,
        editionId: true,
        status: true,
        finishTime: true,
        position: true,
        categoryPosition: true,
        categoryType: true,
        categoryName: true,
        bibNumber: true,
        notes: true,
        personalRating: true,
        createdAt: true,
        edition: {
          select: {
            id: true,
            year: true,
            slug: true,
            competition: {
              select: {
                id: true,
                name: true,
                slug: true,
                event: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    country: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return participation;
  }

  /**
   * Eliminar participación
   */
  async deleteParticipation(userId: string, editionId: string) {
    // Verificar que existe
    const participation = await prisma.userEdition.findUnique({
      where: {
        userId_editionId: {
          userId,
          editionId,
        },
      },
    });

    if (!participation) {
      throw new Error('Participation not found');
    }

    await prisma.userEdition.delete({
      where: {
        userId_editionId: {
          userId,
          editionId,
        },
      },
    });

    return { message: 'Participation deleted successfully' };
  }

  /**
   * Buscar ediciones para selector (con buscador)
   */
  async searchEditions(query: SearchEditionsQuery) {
    const { search } = query;
    // Parse page and limit to integers (query params come as strings)
    const page = typeof query.page === 'string' ? parseInt(query.page, 10) : (query.page || 1);
    const limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : (query.limit || 20);
    const skip = (page - 1) * limit;

    // Build where clause - simplified structure
    let where: Prisma.EditionWhereInput;

    if (search) {
      // With search: filter by name in competition or event
      where = {
        competition: {
          status: 'PUBLISHED',
          event: {
            status: 'PUBLISHED',
          },
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { event: { name: { contains: search, mode: 'insensitive' } } },
          ],
        },
      };
    } else {
      // Without search: just filter by status
      where = {
        competition: {
          status: 'PUBLISHED',
          event: {
            status: 'PUBLISHED',
          },
        },
      };
    }

    const [editions, total] = await Promise.all([
      prisma.edition.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { year: 'desc' },
          { competition: { name: 'asc' } },
        ],
        select: {
          id: true,
          year: true,
          slug: true,
          startDate: true,
          distance: true,
          elevation: true,
          competition: {
            select: {
              id: true,
              name: true,
              slug: true,
              baseDistance: true,
              baseElevation: true,
              event: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  country: true,
                  city: true,
                },
              },
            },
          },
        },
      }),
      prisma.edition.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      editions: editions.map((e) => ({
        id: e.id,
        year: e.year,
        slug: e.slug,
        startDate: e.startDate,
        distance: e.distance || e.competition.baseDistance,
        elevation: e.elevation || e.competition.baseElevation,
        competitionName: e.competition.name,
        eventName: e.competition.event.name,
        eventCountry: e.competition.event.country,
        eventCity: e.competition.event.city,
        displayName: `${e.competition.event.name} - ${e.competition.name} ${e.year}`,
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalEditions: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }
}

export default new UserEditionService();
