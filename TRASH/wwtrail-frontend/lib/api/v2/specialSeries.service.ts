import apiClientV2 from '../client-v2';
import {
  SpecialSeries,
  SpecialSeriesListItem,
  CreateSpecialSeriesInput,
  UpdateSpecialSeriesInput,
  SpecialSeriesFilters,
  PaginatedResponse,
  ApiResponse,
} from '@/types/v2';

class SpecialSeriesService {
  /**
   * Get all special series (public - only PUBLISHED)
   */
  async getAll(filters?: SpecialSeriesFilters): Promise<PaginatedResponse<SpecialSeriesListItem>> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.country) params.append('country', filters.country);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await apiClientV2.get<PaginatedResponse<SpecialSeriesListItem>>(
      `/special-series?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get special series by ID
   */
  async getById(id: string): Promise<SpecialSeries> {
    const response = await apiClientV2.get<ApiResponse<SpecialSeries>>(`/special-series/${id}`);
    return response.data.data!;
  }

  /**
   * Get special series by slug
   */
  async getBySlug(slug: string): Promise<SpecialSeries> {
    const response = await apiClientV2.get<ApiResponse<SpecialSeries>>(`/special-series/slug/${slug}`);
    return response.data.data!;
  }

  /**
   * Check if slug is available
   */
  async checkSlug(slug: string): Promise<{ available: boolean; slug: string }> {
    const response = await apiClientV2.get<ApiResponse<{ available: boolean; slug: string }>>(
      `/special-series/check-slug/${slug}`
    );
    return response.data.data!;
  }

  /**
   * Create a new special series (authenticated - ORGANIZER/ADMIN)
   */
  async create(data: CreateSpecialSeriesInput): Promise<SpecialSeries> {
    const response = await apiClientV2.post<ApiResponse<SpecialSeries>>('/special-series', data);
    return response.data.data!;
  }

  /**
   * Update a special series (authenticated - creator or ADMIN)
   */
  async update(id: string, data: UpdateSpecialSeriesInput): Promise<SpecialSeries> {
    const response = await apiClientV2.patch<ApiResponse<SpecialSeries>>(`/special-series/${id}`, data);
    return response.data.data!;
  }

  /**
   * Approve a special series (admin only)
   */
  async approve(id: string): Promise<SpecialSeries> {
    const response = await apiClientV2.post<ApiResponse<SpecialSeries>>(`/special-series/${id}/approve`);
    return response.data.data!;
  }

  /**
   * Reject a special series (admin only)
   */
  async reject(id: string): Promise<SpecialSeries> {
    const response = await apiClientV2.post<ApiResponse<SpecialSeries>>(`/special-series/${id}/reject`);
    return response.data.data!;
  }

  /**
   * Delete a special series (admin only)
   */
  async delete(id: string): Promise<void> {
    await apiClientV2.delete(`/special-series/${id}`);
  }
}

const specialSeriesService = new SpecialSeriesService();
export default specialSeriesService;
