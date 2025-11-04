// lib/api/v2/competitions.service.ts - Competition API service for v2

import apiClient from '../client';
import {
  Competition,
  CompetitionDetail,
  CreateCompetitionInput,
  UpdateCompetitionInput,
  ReorderCompetitionsInput,
  ApiResponse,
} from '@/types/v2';

const BASE_PATH = '/competitions';

/**
 * Competitions API Service
 */
export const competitionsService = {
  /**
   * Get all competitions for an event
   */
  async getByEvent(eventId: string): Promise<Competition[]> {
    const { data } = await apiClient.get<ApiResponse<Competition[]>>(
      `/events/${eventId}/competitions`
    );
    return data.data!;
  },

  /**
   * Get competition by ID
   */
  async getById(id: string): Promise<CompetitionDetail> {
    const { data } = await apiClient.get<ApiResponse<CompetitionDetail>>(
      `${BASE_PATH}/${id}`
    );
    return data.data!;
  },

  /**
   * Get competition by slug
   */
  async getBySlug(slug: string): Promise<CompetitionDetail> {
    const { data } = await apiClient.get<ApiResponse<CompetitionDetail>>(
      `${BASE_PATH}/slug/${slug}`
    );
    return data.data!;
  },

  /**
   * Create new competition for an event (requires authentication)
   */
  async create(
    eventId: string,
    competitionData: CreateCompetitionInput
  ): Promise<Competition> {
    const { data } = await apiClient.post<ApiResponse<Competition>>(
      `/events/${eventId}/competitions`,
      competitionData
    );
    return data.data!;
  },

  /**
   * Update competition (requires authentication + permissions)
   */
  async update(
    id: string,
    competitionData: UpdateCompetitionInput
  ): Promise<Competition> {
    const { data } = await apiClient.put<ApiResponse<Competition>>(
      `${BASE_PATH}/${id}`,
      competitionData
    );
    return data.data!;
  },

  /**
   * Delete competition (requires authentication + permissions)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${BASE_PATH}/${id}`);
  },

  /**
   * Reorder competitions display order (requires authentication + permissions)
   */
  async reorder(
    eventId: string,
    orderData: ReorderCompetitionsInput
  ): Promise<Competition[]> {
    const { data } = await apiClient.post<ApiResponse<Competition[]>>(
      `/events/${eventId}/competitions/reorder`,
      orderData
    );
    return data.data!;
  },

  /**
   * Toggle competition active status (requires authentication + permissions)
   */
  async toggleActive(id: string): Promise<Competition> {
    const { data } = await apiClient.patch<ApiResponse<Competition>>(
      `${BASE_PATH}/${id}/toggle-active`
    );
    return data.data!;
  },
};

export default competitionsService;
