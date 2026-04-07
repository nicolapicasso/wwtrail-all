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
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.language) params.append('language', filters.language);

    const response = await apiClientV2.get(`/services?${params.toString()}`);

    // apiSuccess wraps as { success, data: { services, total, page, totalPages } }
    const inner = response.data?.data || response.data;
    return {
      status: 'success',
      data: inner.services || inner.data || [],
      pagination: inner.pagination || {
        page: inner.page || 1,
        limit: filters?.limit || 50,
        total: inner.total || 0,
        totalPages: inner.totalPages || 0,
      },
    };
  }

  /**
   * Get service by ID
   */
  async getById(id: string): Promise<ServiceResponse> {
    const response = await apiClientV2.get<ServiceResponse>(`/services/${id}`);
    return response.data?.data || response.data;
  }

  /**
   * Get service by slug
   */
  async getBySlug(slug: string): Promise<ServiceResponse> {
    const response = await apiClientV2.get<ServiceResponse>(`/services/slug/${slug}`);
    return response.data?.data || response.data;
  }

  /**
   * Get services by organizer (authenticated)
   */
  async getByOrganizer(organizerId: string): Promise<{ status: string; data: Service[]; count: number }> {
    const response = await apiClientV2.get<{ status: string; data: Service[]; count: number }>(
      `/services/organizer/${organizerId}`
    );
    const inner = response.data?.data || response.data;
    return {
      status: 'success',
      data: Array.isArray(inner) ? inner : (inner.data || []),
      count: Array.isArray(inner) ? inner.length : (inner.count || 0),
    };
  }

  /**
   * Create service (authenticated)
   */
  async create(data: CreateServiceInput): Promise<ServiceResponse> {
    const response = await apiClientV2.post<ServiceResponse>('/services', data);
    return response.data?.data || response.data;
  }

  /**
   * Update service (authenticated)
   */
  async update(id: string, data: UpdateServiceInput): Promise<ServiceResponse> {
    const response = await apiClientV2.put<ServiceResponse>(`/services/${id}`, data);
    return response.data?.data || response.data;
  }

  /**
   * Delete service (authenticated)
   */
  async delete(id: string): Promise<{ status: string; message: string }> {
    const response = await apiClientV2.delete<{ status: string; message: string }>(`/services/${id}`);
    return response.data?.data || response.data;
  }

  /**
   * Toggle featured status (admin only)
   */
  async toggleFeatured(id: string): Promise<ServiceResponse> {
    const response = await apiClientV2.patch<ServiceResponse>(`/services/${id}/featured`);
    return response.data?.data || response.data;
  }

  /**
   * Get nearby services by coordinates
   */
  async getNearby(lat: number, lon: number, radius: number = 50): Promise<Service[]> {
    const response = await apiClientV2.get<{ status: string; data: Service[] }>(
      `/services/nearby?lat=${lat}&lon=${lon}&radius=${radius}`
    );
    const inner = response.data?.data || response.data;
    const items = inner?.data || inner;
    return Array.isArray(items) ? items : [];
  }
}

export default new ServicesService();
