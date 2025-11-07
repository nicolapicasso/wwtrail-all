import { PrismaClient, ParticipationStatus } from '@prisma/client';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors';

const prisma = new PrismaClient();

export class UserCompetitionService {
  /**
   * Marcar una competición (crear seguimiento)
   * Si ya está marcada, actualiza el estado
   */
  static async markCompetition(userId: string, competitionId: string, status: ParticipationStatus = ParticipationStatus.INTERESTED) {
    // Verificar que la competición existe
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
    });

    if (!competition) {
      throw new NotFoundError('Competition not found');
    }

    // Verificar si ya está marcada
    const existing = await prisma.userCompetition.findUnique({
      where: {
        userId_competitionId: {
          userId,
          competitionId,
        },
      },
    });

    // Si ya existe, actualizar el estado
    if (existing) {
      const updated = await prisma.userCompetition.update({
        where: { id: existing.id },
        data: { status },
        include: {
          competition: {
            include: {
              event: true,
            },
          },
        },
      });
      return updated;
    }

    // Si no existe, crear el seguimiento
    const userCompetition = await prisma.userCompetition.create({
      data: {
        userId,
        competitionId,
        status,
      },
      include: {
        competition: {
          include: {
            event: true,
          },
        },
      },
    });

    return userCompetition;
  }

  /**
   * Obtener todas las competiciones marcadas por el usuario
   */
  static async getUserCompetitions(userId: string, filters?: {
    status?: ParticipationStatus;
  }) {
    const where: any = { userId };

    if (filters?.status) {
      where.status = filters.status;
    }

    const userCompetitions = await prisma.userCompetition.findMany({
      where,
      include: {
        competition: {
          include: {
            event: true,
          },
        },
      },
      orderBy: {
        markedAt: 'desc',
      },
    });

    return userCompetitions;
  }

  /**
   * Obtener estado de una competición para un usuario
   */
  static async getCompetitionStatus(userId: string, competitionId: string) {
    const userCompetition = await prisma.userCompetition.findUnique({
      where: {
        userId_competitionId: {
          userId,
          competitionId,
        },
      },
    });

    return userCompetition;
  }

  /**
   * Actualizar estado de una competición marcada
   */
  static async updateStatus(
    id: string,
    userId: string,
    data: {
      status?: ParticipationStatus;
      notes?: string;
      personalRating?: number;
      finishTime?: string;
      finishTimeSeconds?: number;
      position?: number;
      categoryPosition?: number;
      completedAt?: Date;
    }
  ) {
    // Verificar que existe y pertenece al usuario
    const existing = await prisma.userCompetition.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError('User competition not found');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenError('You can only update your own competitions');
    }

    // Actualizar
    const updated = await prisma.userCompetition.update({
      where: { id },
      data,
      include: {
        competition: {
          include: {
            event: true,
          },
        },
      },
    });

    return updated;
  }

  /**
   * Desmarcar una competición (eliminar seguimiento)
   */
  static async unmarkCompetition(id: string, userId: string) {
    // Verificar que existe y pertenece al usuario
    const existing = await prisma.userCompetition.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError('User competition not found');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenError('You can only delete your own competitions');
    }

    // Eliminar
    await prisma.userCompetition.delete({
      where: { id },
    });

    return { message: 'Competition unmarked successfully' };
  }

  /**
   * Obtener estadísticas del usuario
   */
  static async getUserStats(userId: string) {
    const userCompetitions = await prisma.userCompetition.findMany({
      where: { userId },
    });

    const stats = {
      total: userCompetitions.length,
      interested: userCompetitions.filter(uc => uc.status === ParticipationStatus.INTERESTED).length,
      registered: userCompetitions.filter(uc => uc.status === ParticipationStatus.REGISTERED).length,
      confirmed: userCompetitions.filter(uc => uc.status === ParticipationStatus.CONFIRMED).length,
      completed: userCompetitions.filter(uc => uc.status === ParticipationStatus.COMPLETED).length,
      dns: userCompetitions.filter(uc => uc.status === ParticipationStatus.DNS).length,
      dnf: userCompetitions.filter(uc => uc.status === ParticipationStatus.DNF).length,
      dsq: userCompetitions.filter(uc => uc.status === ParticipationStatus.DSQ).length,
    };

    return stats;
  }

  /**
   * Verificar si un usuario tiene marcada una competición
   */
  static async isMarked(userId: string, competitionId: string): Promise<boolean> {
    const userCompetition = await prisma.userCompetition.findUnique({
      where: {
        userId_competitionId: {
          userId,
          competitionId,
        },
      },
    });

    return !!userCompetition;
  }
}