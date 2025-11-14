// lib/api/v2/competitions.service.ts
import { apiClientV2 } from '../client';
import { Competition, CompetitionFilters, PaginatedCompetitionsResponse } from '@/types/competition';

/**
 * Competitions Service - USA V2
 * Usa apiClientV2 que tiene baseURL=/api/v2
 */

export interface Edition {
  id: string;
  competitionId: string;
  year: number;
  slug: string;
  startDate?: string;
  endDate?: string;
  distance?: number;
  elevation?: number;
  maxParticipants?: number;
  currentParticipants?: number;
  price?: number;
  city?: string;
  status: string;
  registrationStatus: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const competitionsService = {
  /**
   * Get all competitions with optional filters
   * GET /competitions
   */
  async getAll(filters?: { limit?: number; offset?: number }): Promise<{ competitions: Competition[] }> {
    const params = new URLSearchParams();
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await apiClientV2.get<{
      status: string;
      data: { competitions: Competition[] };
    }>(`/competitions${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data.data;
  },

  /**
   * Get competitions by event ID
   * GET /events/:eventId/competitions
   */
  async getByEvent(eventId: string): Promise<Competition[]> {
    const response = await apiClientV2.get<{
      status: string;
      data: Competition[];
    }>(`/events/${eventId}/competitions`);
    return response.data.data;
  },

  /**
   * Get competition by ID
   * GET /competitions/:id
   */
  async getById(id: string): Promise<Competition> {
    const response = await apiClientV2.get<{
      status: string;
      data: Competition;
    }>(`/competitions/${id}`);
    return response.data.data;
  },

  /**
   * Get competition by slug
   * GET /competitions/slug/:slug
   */
  async getBySlug(slug: string): Promise<Competition> {
    const response = await apiClientV2.get<{
      status: string;
      data: Competition;
    }>(`/competitions/slug/${slug}`);
    return response.data.data;
  },

  /**
   * Create competition (requires auth)
   * POST /events/:eventId/competitions
   */
  async create(eventId: string, data: Partial<Competition>): Promise<Competition> {
    const response = await apiClientV2.post<{
      status: string;
      data: Competition;
    }>(`/events/${eventId}/competitions`, data);
    return response.data.data;
  },

  /**
   * Update competition (requires auth)
   * PUT /competitions/:id
   */
  async update(id: string, data: Partial<Competition>): Promise<Competition> {
    const response = await apiClientV2.put<{
      status: string;
      data: Competition;
    }>(`/competitions/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete competition (requires auth)
   * DELETE /competitions/:id
   */
  async delete(id: string): Promise<void> {
    await apiClientV2.delete(`/competitions/${id}`);
  },

  /**
   * Reorder competitions (requires auth)
   * POST /events/:eventId/competitions/reorder
   */
  async reorder(
    eventId: string,
    order: { id: string; displayOrder: number }[]
  ): Promise<void> {
    await apiClientV2.post(`/events/${eventId}/competitions/reorder`, { order });
  },

  /**
   * Toggle competition active status (requires auth)
   * POST /competitions/:id/toggle-active
   */
  async toggleActive(id: string): Promise<Competition> {
    const response = await apiClientV2.post<{
      status: string;
      data: Competition;
    }>(`/competitions/${id}/toggle-active`);
    return response.data.data;
  },
};

export default competitionsService;