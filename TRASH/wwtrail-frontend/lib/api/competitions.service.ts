import { apiClientV2 } from './client';
import { 
  Competition, 
  CompetitionFilters, 
  PaginatedResponse,
  ApiResponse 
} from '../types';

export const competitionsService = {
  // Get all competitions
  async getAll(filters?: CompetitionFilters): Promise<PaginatedResponse<Competition>> {
    const response = await apiClientV2.get('/competitions', {
      params: filters,
    });

    // ✅ Adaptar respuesta del backend al formato esperado
    const backendData = response.data;

    return {
      data: backendData.data?.competitions || [],
      pagination: {
        page: 1,
        limit: filters?.limit || 50,
        total: backendData.count || 0,
        totalPages: 1,
      }
    };
  },

  // Get competition by ID
  async getById(id: string): Promise<Competition> {
    const response = await apiClientV2.get<ApiResponse<Competition>>(`/competitions/${id}`);
    return response.data.data;
  },

  // Create competition (organizer only)
  async create(data: Partial<Competition>): Promise<Competition> {
    const response = await apiClientV2.post<ApiResponse<Competition>>('/competitions', data);
    return response.data.data;
  },

  // Update competition
  async update(id: string, data: Partial<Competition>): Promise<Competition> {
    const response = await apiClientV2.put<ApiResponse<Competition>>(`/competitions/${id}`, data);
    return response.data.data;
  },

  // Delete competition
  async delete(id: string): Promise<void> {
    await apiClientV2.delete(`/competitions/${id}`);
  },
};