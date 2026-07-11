import apiClientV2 from '../client-v2';
import {
  Organizer,
  OrganizerListItem,
  CreateOrganizerInput,
  UpdateOrganizerInput,
  OrganizerFilters,
  PaginatedResponse,
  ApiResponse,
} from '@/types/v2';

class OrganizersService {
  /**
   * Get all organizers (public - only PUBLISHED)
   */
  async getAll(filters?: OrganizerFilters): Promise<PaginatedResponse<OrganizerListItem>> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.country) params.append('country', filters.country);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await apiClientV2.get<PaginatedResponse<OrganizerListItem>>(
      `/organizers?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get organizer by ID
   */
  async getById(id: string): Promise<Organizer> {
    const response = await apiClientV2.get<ApiResponse<Organizer>>(`/organizers/${id}`);
    return response.data.data!;
  }

  /**
   * Get organizer by slug
   */
  async getBySlug(slug: string): Promise<Organizer> {
    const response = await apiClientV2.get<ApiResponse<Organizer>>(`/organizers/slug/${slug}`);
    return response.data.data!;
  }

  /**
   * Check if slug is available
   */
  async checkSlug(slug: string): Promise<{ available: boolean; slug: string }> {
    const response = await apiClientV2.get<ApiResponse<{ available: boolean; slug: string }>>(
      `/organizers/check-slug/${slug}`
    );
    return response.data.data!;
  }

  /**
   * Create a new organizer (authenticated - ORGANIZER/ADMIN)
   */
  async create(data: CreateOrganizerInput): Promise<Organizer> {
    const response = await apiClientV2.post<ApiResponse<Organizer>>('/organizers', data);
    return response.data.data!;
  }

  /**
   * Update an organizer (authenticated - creator or ADMIN)
   */
  async update(id: string, data: UpdateOrganizerInput): Promise<Organizer> {
    const response = await apiClientV2.patch<ApiResponse<Organizer>>(`/organizers/${id}`, data);
    return response.data.data!;
  }

  /**
   * Approve an organizer (admin only)
   */
  async approve(id: string): Promise<Organizer> {
    const response = await apiClientV2.post<ApiResponse<Organizer>>(`/organizers/${id}/approve`);
    return response.data.data!;
  }

  /**
   * Reject an organizer (admin only)
   */
  async reject(id: string): Promise<Organizer> {
    const response = await apiClientV2.post<ApiResponse<Organizer>>(`/organizers/${id}/reject`);
    return response.data.data!;
  }

  /**
   * Delete an organizer (admin only)
   */
  async delete(id: string): Promise<void> {
    await apiClientV2.delete(`/organizers/${id}`);
  }
}

const organizersService = new OrganizersService();
export default organizersService;
