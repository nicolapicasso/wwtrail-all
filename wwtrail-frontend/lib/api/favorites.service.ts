// lib/api/favorites.service.ts

import { apiClientV2 } from './client';

export interface FavoriteCompetition {
  id: string;
  competitionId: string;
  userId: string;
  createdAt: string;
  competition: {
    id: string;
    name: string;
    slug: string;
    type: string;
    baseDistance: number | null;
    baseElevation: number | null;
    logoUrl: string | null;
    coverImage: string | null;
    event: {
      id: string;
      name: string;
      slug: string;
      city: string;
      country: string;
      logoUrl: string | null;
    };
    _count: {
      editions: number;
    };
  };
}

export const favoritesService = {
  /**
   * Get all user's favorite competitions
   */
  async getFavorites(): Promise<FavoriteCompetition[]> {
    const response = await apiClientV2.get('/favorites');
    return response.data.data;
  },

  /**
   * Check if a competition is favorited by the current user
   */
  async isFavorite(competitionId: string): Promise<boolean> {
    const response = await apiClientV2.get(`/favorites/check/${competitionId}`);
    return response.data.data.isFavorite;
  },

  /**
   * Add a competition to favorites
   */
  async addFavorite(competitionId: string): Promise<FavoriteCompetition> {
    const response = await apiClientV2.post(`/favorites/${competitionId}`);
    return response.data.data;
  },

  /**
   * Remove a competition from favorites
   */
  async removeFavorite(competitionId: string): Promise<void> {
    await apiClientV2.delete(`/favorites/${competitionId}`);
  },

  /**
   * Toggle favorite status
   */
  async toggleFavorite(competitionId: string, isFavorite: boolean): Promise<boolean> {
    if (isFavorite) {
      await this.removeFavorite(competitionId);
      return false;
    } else {
      await this.addFavorite(competitionId);
      return true;
    }
  },
};

export default favoritesService;
