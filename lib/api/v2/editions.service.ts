// lib/api/v2/editions.service.ts

import { apiClientV2 } from '../client';

/**
 * Editions Service - USA V2
 * Usa apiClientV2 que tiene baseURL=/api/v2
 */

export interface Edition {
  id: string;
  competitionId: string;
  year: number;
  slug: string;
  startDate?: string;
  endDate?: string;
  registrationOpenDate?: string;
  registrationCloseDate?: string;
  distance?: number;
  elevation?: number;
  maxParticipants?: number;
  currentParticipants?: number;
  price?: number;
  city?: string;
  status: 'UPCOMING' | 'ONGOING' | 'FINISHED' | 'CANCELLED';
  registrationStatus: 'NOT_OPEN' | 'OPEN' | 'CLOSED' | 'FULL';
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Campos resueltos con herencia
  resolvedDistance?: number;
  resolvedElevation?: number;
  resolvedMaxParticipants?: number;
  resolvedCity?: string;
  
  // Relaciones
  competition?: {
    id: string;
    name: string;
    slug: string;
    type: string;
    baseDistance?: number;
    baseElevation?: number;
    baseMaxParticipants?: number;
  };
  
  event?: {
    id: string;
    name: string;
    slug: string;
    country: string;
    city: string;
  };
  
  _count?: {
    participants: number;
    results: number;
    reviews: number;
  };
}

export interface EditionStats {
  id: string;
  competitionName: string;
  year: number;
  totalParticipants: number;
  totalResults: number;
  totalReviews: number;
  averageRating?: number;
  currentParticipants: number;
  maxParticipants?: number;
  status: string;
  registrationStatus: string;
}

export const editionsService = {
  /**
   * Get editions by competition ID
   * GET /competitions/:competitionId/editions
   */
  async getByCompetition(
    competitionId: string,
    options?: {
      includeInactive?: boolean;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<Edition[]> {
    const params = {
      includeInactive: options?.includeInactive,
      sortBy: 'year',
      sortOrder: options?.sortOrder || 'desc',
    };
    
    const response = await apiClientV2.get<{
      status: string;
      data: Edition[];
    }>(`/competitions/${competitionId}/editions`, { params });
    
    return response.data.data;
  },

  /**
   * Get edition by ID
   * GET /editions/:id
   */
  async getById(id: string): Promise<Edition> {
    const response = await apiClientV2.get<{
      status: string;
      data: Edition;
    }>(`/editions/${id}`);
    return response.data.data;
  },

  /**
   * Get edition by slug
   * GET /editions/slug/:slug
   */
  async getBySlug(slug: string): Promise<Edition> {
    const response = await apiClientV2.get<{
      status: string;
      data: Edition;
    }>(`/editions/slug/${slug}`);
    return response.data.data;
  },

  /**
   * Get edition by year
   * GET /competitions/:competitionId/editions/year/:year
   * NOTA: Este endpoint puede no existir en el backend
   * En ese caso, usa getByCompetition y filtra por año
   */
  async getByYear(competitionId: string, year: number): Promise<Edition> {
    try {
      const response = await apiClientV2.get<{
        status: string;
        data: Edition;
      }>(`/competitions/${competitionId}/editions/year/${year}`);
      return response.data.data;
    } catch (error: any) {
      // Si el endpoint no existe, buscar manualmente
      if (error.response?.status === 404) {
        const editions = await this.getByCompetition(competitionId);
        const edition = editions.find(e => e.year === year);
        if (!edition) {
          throw new Error(`Edition for year ${year} not found`);
        }
        return edition;
      }
      throw error;
    }
  },

  /**
   * Get edition with inheritance (resolved fields)
   * GET /editions/:id/with-inheritance
   */
  async getWithInheritance(id: string): Promise<Edition> {
    const response = await apiClientV2.get<{
      status: string;
      data: Edition;
    }>(`/editions/${id}/with-inheritance`);
    return response.data.data;
  },

  /**
   * Get edition statistics
   * GET /editions/:id/stats
   */
  async getStats(id: string): Promise<EditionStats> {
    const response = await apiClientV2.get<{
      status: string;
      data: EditionStats;
    }>(`/editions/${id}/stats`);
    return response.data.data;
  },

  /**
   * Create edition (requires auth)
   * POST /competitions/:competitionId/editions
   */
  async create(competitionId: string, data: Partial<Edition>): Promise<Edition> {
    const response = await apiClientV2.post<{
      status: string;
      data: Edition;
    }>(`/competitions/${competitionId}/editions`, data);
    return response.data.data;
  },

  /**
   * Create bulk editions (requires auth)
   * POST /competitions/:competitionId/editions/bulk
   */
  async createBulk(competitionId: string, years: number[]): Promise<Edition[]> {
    const response = await apiClientV2.post<{
      status: string;
      data: Edition[];
    }>(`/competitions/${competitionId}/editions/bulk`, { years });
    return response.data.data;
  },

  /**
   * Update edition (requires auth)
   * PUT /editions/:id
   */
  async update(id: string, data: Partial<Edition>): Promise<Edition> {
    const response = await apiClientV2.put<{
      status: string;
      data: Edition;
    }>(`/editions/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete edition (requires auth)
   * DELETE /editions/:id
   */
  async delete(id: string): Promise<void> {
    await apiClientV2.delete(`/editions/${id}`);
  },

  /**
   * Toggle edition active status (requires auth)
   * POST /editions/:id/toggle-active
   */
  async toggleActive(id: string): Promise<Edition> {
    const response = await apiClientV2.post<{
      status: string;
      data: Edition;
    }>(`/editions/${id}/toggle-active`);
    return response.data.data;
  },
};

export default editionsService;