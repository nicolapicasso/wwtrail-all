// src/services/favorites.service.ts

import prisma from '../lib/prisma';

export class FavoritesService {
  /**
   * Add a competition to user's favorites
   */
  async addFavorite(userId: string, competitionId: string) {
    // Check if competition exists
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
    });

    if (!competition) {
      throw new Error('Competition not found');
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        competitionId_userId: {
          competitionId,
          userId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    // Create favorite
    return prisma.favorite.create({
      data: {
        competitionId,
        userId,
      },
      include: {
        competition: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            baseDistance: true,
            baseElevation: true,
            event: {
              select: {
                id: true,
                name: true,
                slug: true,
                city: true,
                country: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Remove a competition from user's favorites
   */
  async removeFavorite(userId: string, competitionId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        competitionId_userId: {
          competitionId,
          userId,
        },
      },
    });

    if (!favorite) {
      throw new Error('Favorite not found');
    }

    await prisma.favorite.delete({
      where: {
        competitionId_userId: {
          competitionId,
          userId,
        },
      },
    });

    return { message: 'Favorite removed successfully' };
  }

  /**
   * Get all user's favorites
   */
  async getUserFavorites(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        competition: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            baseDistance: true,
            baseElevation: true,
            logoUrl: true,
            coverImage: true,
            event: {
              select: {
                id: true,
                name: true,
                slug: true,
                city: true,
                country: true,
                logoUrl: true,
              },
            },
            _count: {
              select: {
                editions: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Check if a competition is favorited by user
   */
  async isFavorite(userId: string, competitionId: string): Promise<boolean> {
    const favorite = await prisma.favorite.findUnique({
      where: {
        competitionId_userId: {
          competitionId,
          userId,
        },
      },
    });

    return !!favorite;
  }
}

export default new FavoritesService();
