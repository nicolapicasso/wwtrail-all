import apiClientV2 from '../client-v2';

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    services: number;
  };
}

export interface ServiceCategoryWithCount {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

export interface CreateServiceCategoryInput {
  name: string;
  icon: string;
}

export interface UpdateServiceCategoryInput {
  name?: string;
  icon?: string;
}

class ServiceCategoriesService {
  /**
   * Get all service categories
   */
  async getAll(): Promise<ServiceCategory[]> {
    const response = await apiClientV2.get<{ status: string; data: ServiceCategory[] }>('/service-categories');
    return response.data.data;
  }

  /**
   * Get all service categories with count
   */
  async getAllWithCount(): Promise<ServiceCategoryWithCount[]> {
    const response = await apiClientV2.get<{ status: string; data: ServiceCategoryWithCount[] }>('/service-categories/with-count');
    return response.data.data;
  }

  /**
   * Get service category by ID
   */
  async getById(id: string): Promise<ServiceCategory> {
    const response = await apiClientV2.get<{ status: string; data: ServiceCategory }>(`/service-categories/${id}`);
    return response.data.data;
  }

  /**
   * Get service category by slug
   */
  async getBySlug(slug: string): Promise<ServiceCategory> {
    const response = await apiClientV2.get<{ status: string; data: ServiceCategory }>(`/service-categories/slug/${slug}`);
    return response.data.data;
  }

  /**
   * Create a new service category (admin only)
   */
  async create(data: CreateServiceCategoryInput): Promise<ServiceCategory> {
    const response = await apiClientV2.post<{ status: string; message: string; data: ServiceCategory }>('/service-categories', data);
    return response.data.data;
  }

  /**
   * Update a service category (admin only)
   */
  async update(id: string, data: UpdateServiceCategoryInput): Promise<ServiceCategory> {
    const response = await apiClientV2.put<{ status: string; message: string; data: ServiceCategory }>(`/service-categories/${id}`, data);
    return response.data.data;
  }

  /**
   * Delete a service category (admin only)
   */
  async delete(id: string): Promise<{ status: string; message: string }> {
    const response = await apiClientV2.delete<{ status: string; message: string }>(`/service-categories/${id}`);
    return response.data;
  }
}

export default new ServiceCategoriesService();
