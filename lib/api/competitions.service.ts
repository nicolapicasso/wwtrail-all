import apiClient from './client';
import { 
  Competition, 
  CompetitionFilters, 
  PaginatedResponse,
  ApiResponse 
} from '../types';

export const competitionsService = {
  // Get all competitions
  async getAll(filters?: CompetitionFilters): Promise<PaginatedResponse<Competition>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Competition>>>('/competitions', {
      params: filters,
    });
    return response.data.data;
  },

  // Get competition by ID
  async getById(id: string): Promise<Competition> {
    const response = await apiClient.get<ApiResponse<Competition>>(`/competitions/${id}`);
    return response.data.data;
  },

  // Create competition (organizer only)
  async create(data: Partial<Competition>): Promise<Competition> {
    const response = await apiClient.post<ApiResponse<Competition>>('/competitions', data);
    return response.data.data;
  },

  // Update competition
  async update(id: string, data: Partial<Competition>): Promise<Competition> {
    const response = await apiClient.put<ApiResponse<Competition>>(`/competitions/${id}`, data);
    return response.data.data;
  },

  // Delete competition
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/competitions/${id}`);
  },
};
