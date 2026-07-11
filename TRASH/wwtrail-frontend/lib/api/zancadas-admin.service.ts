// lib/api/zancadas-admin.service.ts - Servicio para administración de Zancadas

import { apiClientV2 } from './client';

// =============================================
// INTERFACES
// =============================================

export interface ZancadasConfig {
  subdomain: string | null;
  hasToken: boolean;
  hasWebhookSecret: boolean;
  isEnabled: boolean;
}

export interface ZancadasAction {
  id: string;
  actionCode: string;
  actionName: string;
  description: string | null;
  points: number;
  isEnabled: boolean;
  maxPerDay: number | null;
  maxPerUser: number | null;
  triggerStatuses: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ZancadasStats {
  totalTransactions: number;
  totalPointsAwarded: number;
  usersWithPoints: number;
  transactionsByAction: {
    actionCode: string;
    actionName: string;
    count: number;
    points: number;
  }[];
}

export interface UpdateConfigInput {
  subdomain?: string;
  apiToken?: string;
  webhookSecret?: string;
  isEnabled?: boolean;
}

export interface UpdateActionInput {
  points?: number;
  isEnabled?: boolean;
  maxPerDay?: number | null;
  maxPerUser?: number | null;
  triggerStatuses?: string[];
}

// =============================================
// ADMIN SERVICE
// =============================================

export const zancadasAdminService = {
  // ============ CONFIG ============

  /**
   * Obtener configuración de Omniwallet
   * GET /api/v2/zancadas/admin/config
   */
  async getConfig(): Promise<ZancadasConfig | null> {
    const response = await apiClientV2.get('/zancadas/admin/config');
    return response.data.data;
  },

  /**
   * Actualizar configuración de Omniwallet
   * PUT /api/v2/zancadas/admin/config
   */
  async updateConfig(data: UpdateConfigInput): Promise<ZancadasConfig> {
    const response = await apiClientV2.put('/zancadas/admin/config', data);
    return response.data.data;
  },

  /**
   * Probar conexión con Omniwallet
   * POST /api/v2/zancadas/admin/test-connection
   */
  async testConnection(): Promise<{ connected: boolean; message?: string }> {
    const response = await apiClientV2.post('/zancadas/admin/test-connection');
    return {
      connected: response.data.data?.connected || false,
      message: response.data.message,
    };
  },

  // ============ ACTIONS ============

  /**
   * Obtener todas las acciones
   * GET /api/v2/zancadas/admin/actions
   */
  async getActions(): Promise<ZancadasAction[]> {
    const response = await apiClientV2.get('/zancadas/admin/actions');
    return response.data.data;
  },

  /**
   * Actualizar una acción
   * PUT /api/v2/zancadas/admin/actions/:id
   */
  async updateAction(id: string, data: UpdateActionInput): Promise<ZancadasAction> {
    const response = await apiClientV2.put(`/zancadas/admin/actions/${id}`, data);
    return response.data.data;
  },

  // ============ STATS ============

  /**
   * Obtener estadísticas
   * GET /api/v2/zancadas/admin/stats
   */
  async getStats(): Promise<ZancadasStats> {
    const response = await apiClientV2.get('/zancadas/admin/stats');
    return response.data.data;
  },

  /**
   * Reintentar sincronizaciones fallidas
   * POST /api/v2/zancadas/admin/retry-syncs
   */
  async retrySyncs(limit?: number): Promise<{ processed: number; synced: number }> {
    const response = await apiClientV2.post('/zancadas/admin/retry-syncs', {}, {
      params: { limit },
    });
    return response.data.data;
  },
};

export default zancadasAdminService;
