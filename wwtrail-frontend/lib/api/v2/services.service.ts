import apiClientV2 from '../client-v2';
import {
  Service,
  ServicesResponse,
  ServiceResponse,
  CategoriesResponse,
  CreateServiceInput,
  UpdateServiceInput,
  ServiceFilters,
} from '@/types/v2';

class ServicesService {
  /**
   * Get all services (public)
   */
  async getAll(filters?: ServiceFilters): Promise<ServicesResponse> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.country) params.append('country', filters.country);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await apiClientV2.get<ServicesResponse>(`/services?${params.toString()}`);
    return response.data;
  }

  /**
   * Get all service categories (public)
   */
  async getCategories(): Promise<string[]> {
    const response = await apiClientV2.get<CategoriesResponse>('/services/categories');
    return response.data.data;
  }

  /**
   * Get service by ID
   */
  async getById(id: string): Promise<ServiceResponse> {
    const response = await apiClientV2.get<ServiceResponse>(`/services/${id}`);
    return response.data;
  }

  /**
   * Get service by slug
   */
  async getBySlug(slug: string): Promise<ServiceResponse> {
    const response = await apiClientV2.get<ServiceResponse>(`/services/slug/${slug}`);
    return response.data;
  }

  /**
   * Get services by organizer (authenticated)
   */
  async getByOrganizer(organizerId: string): Promise<{ status: string; data: Service[]; count: number }> {
    const response = await apiClientV2.get<{ status: string; data: Service[]; count: number }>(
      `/services/organizer/${organizerId}`
    );
    return response.data;
  }

  /**
   * Create service (authenticated)
   */
  async create(data: CreateServiceInput): Promise<ServiceResponse> {
    const response = await apiClientV2.post<ServiceResponse>('/services', data);
    return response.data;
  }

  /**
   * Update service (authenticated)
   */
  async update(id: string, data: UpdateServiceInput): Promise<ServiceResponse> {
    const response = await apiClientV2.put<ServiceResponse>(`/services/${id}`, data);
    return response.data;
  }

  /**
   * Delete service (authenticated)
   */
  async delete(id: string): Promise<{ status: string; message: string }> {
    const response = await apiClientV2.delete<{ status: string; message: string }>(`/services/${id}`);
    return response.data;
  }

  /**
   * Toggle featured status (admin only)
   */
  async toggleFeatured(id: string): Promise<ServiceResponse> {
    const response = await apiClientV2.patch<ServiceResponse>(`/services/${id}/featured`);
    return response.data;
  }
}

export default new ServicesService();
