// lib/api/home.service.ts - Home Configuration API Service

import { apiClient } from './client';
import type {
  HomeConfiguration,
  UpdateHomeConfigurationDTO,
  UpdateFullHomeConfigDTO,
  CreateHomeBlockDTO,
  UpdateHomeBlockDTO,
  HomeBlock,
} from '@/types/home';

class HomeService {
  /**
   * Obtener la configuración activa de la home (público)
   */
  async getActiveConfiguration(): Promise<HomeConfiguration> {
    const response = await apiClient.get<{ data: HomeConfiguration }>('/home/config');
    return response.data.data;
  }

  /**
   * Obtener configuración por ID (admin)
   */
  async getConfigurationById(id: string): Promise<HomeConfiguration> {
    const response = await apiClient.get<{ data: HomeConfiguration }>(`/home/config/${id}`);
    return response.data.data;
  }

  /**
   * Crear nueva configuración (admin)
   */
  async createConfiguration(data: UpdateHomeConfigurationDTO): Promise<HomeConfiguration> {
    const response = await apiClient.post<{ data: HomeConfiguration }>('/home/config', data);
    return response.data.data;
  }

  /**
   * Actualizar configuración básica (admin)
   */
  async updateConfiguration(
    id: string,
    data: UpdateHomeConfigurationDTO
  ): Promise<HomeConfiguration> {
    const response = await apiClient.patch<{ data: HomeConfiguration }>(
      `/home/config/${id}`,
      data
    );
    return response.data.data;
  }

  /**
   * Actualizar configuración completa (admin)
   */
  async updateFullConfiguration(
    id: string,
    data: UpdateFullHomeConfigDTO
  ): Promise<HomeConfiguration> {
    const response = await apiClient.put<{ data: HomeConfiguration }>(
      `/home/config/${id}/full`,
      data
    );
    return response.data.data;
  }

  /**
   * Eliminar configuración (admin)
   */
  async deleteConfiguration(id: string): Promise<void> {
    await apiClient.delete(`/home/config/${id}`);
  }

  /**
   * Reordenar bloques (admin)
   */
  async reorderBlocks(
    configId: string,
    blockOrders: Array<{ id: string; order: number }>
  ): Promise<HomeConfiguration> {
    const response = await apiClient.post<{ data: HomeConfiguration }>(
      `/home/config/${configId}/reorder`,
      { blockOrders }
    );
    return response.data.data;
  }

  /**
   * Crear bloque (admin)
   */
  async createBlock(configId: string, data: CreateHomeBlockDTO): Promise<HomeBlock> {
    const response = await apiClient.post<{ data: HomeBlock }>(
      `/home/config/${configId}/blocks`,
      data
    );
    return response.data.data;
  }

  /**
   * Actualizar bloque (admin)
   */
  async updateBlock(blockId: string, data: UpdateHomeBlockDTO): Promise<HomeBlock> {
    const response = await apiClient.patch<{ data: HomeBlock }>(`/home/blocks/${blockId}`, data);
    return response.data.data;
  }

  /**
   * Eliminar bloque (admin)
   */
  async deleteBlock(blockId: string): Promise<void> {
    await apiClient.delete(`/home/blocks/${blockId}`);
  }

  /**
   * Toggle visibilidad de bloque (admin)
   */
  async toggleBlockVisibility(blockId: string): Promise<HomeBlock> {
    const response = await apiClient.post<{ data: HomeBlock }>(
      `/home/blocks/${blockId}/toggle`
    );
    return response.data.data;
  }
}

export const homeService = new HomeService();
