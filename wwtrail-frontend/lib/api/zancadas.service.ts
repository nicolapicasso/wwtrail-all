// lib/api/zancadas.service.ts - Servicio para Zancadas (usuario)

import { apiClientV2 } from './client';

// =============================================
// INTERFACES
// =============================================

export interface ZancadasBalance {
  balance: number;
  omniwalletBalance: number | null;
  synced: boolean;
  syncedAt: string | null;
  omniwalletCustomerId: string | null;
  cardNumber: string | null;
}

export interface ZancadasTransaction {
  id: string;
  points: number;
  createdAt: string;
  referenceType: string | null;
  referenceId: string | null;
  omniwalletSynced: boolean;
  actionCode: string;
  syncStatus: 'SYNCED' | 'PENDING' | 'FAILED';
  action: {
    actionName: string;
    actionCode: string;
  };
}

export interface TransactionsMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface TransactionsResponse {
  data: ZancadasTransaction[];
  meta: TransactionsMeta;
}

export interface CompetitionReference {
  id: string;
  name: string;
  slug: string;
  baseDistance: number;
  baseElevation: number | null;
  progress: number;
  event: {
    slug: string;
    name: string;
  };
}

export interface EquivalentCompetitionsResponse {
  equivalentKm: number;
  equivalentElevation: number;
  byDistance: CompetitionReference | null;
  byElevation: CompetitionReference | null;
}

// =============================================
// USER SERVICE (para usuarios autenticados)
// =============================================

export const zancadasService = {
  /**
   * Obtener mi balance de Zancadas
   * GET /api/v2/zancadas/balance
   */
  async getBalance(): Promise<ZancadasBalance | null> {
    try {
      const response = await apiClientV2.get('/zancadas/balance');
      const data = response.data.data;

      return {
        balance: data.zancadas ?? 0,
        omniwalletBalance: data.omniwalletBalance,
        synced: data.synced,
        syncedAt: data.syncedAt || null,
        omniwalletCustomerId: data.omniwalletCustomerId || null,
        cardNumber: data.cardNumber || null,
      };
    } catch {
      // Return null if Zancadas is not configured or user not authenticated
      return null;
    }
  },

  /**
   * Obtener mi historial de transacciones
   * GET /api/v2/zancadas/transactions
   */
  async getTransactions(page = 1, pageSize = 20): Promise<ZancadasTransaction[]> {
    try {
      const response = await apiClientV2.get('/zancadas/transactions', {
        params: { page, pageSize }
      });

      // Transform backend response to match frontend interface
      const transactions = response.data.data || [];
      return transactions.map((tx: Record<string, unknown>) => ({
        id: tx.id,
        points: tx.points,
        createdAt: tx.createdAt,
        referenceType: tx.referenceType,
        referenceId: tx.referenceId,
        omniwalletSynced: tx.omniwalletSynced,
        actionCode: (tx.action as Record<string, string>)?.actionCode || 'UNKNOWN',
        syncStatus: tx.omniwalletSynced
          ? 'SYNCED'
          : tx.omniwalletError
            ? 'FAILED'
            : 'PENDING',
        action: tx.action,
      }));
    } catch {
      return [];
    }
  },

  /**
   * Sincronizar mi balance con Omniwallet
   * POST /api/v2/zancadas/sync
   */
  async syncBalance(): Promise<{ balance: number; syncedAt: string }> {
    const response = await apiClientV2.post('/zancadas/sync');
    return {
      balance: response.data.data.zancadas ?? 0,
      syncedAt: new Date().toISOString(),
    };
  },

  /**
   * Obtener una competición equivalente basada en las zancadas (legacy)
   * GET /api/v2/zancadas/equivalent-competition
   */
  async getEquivalentCompetition(zancadas: number): Promise<{
    id: string;
    name: string;
    slug: string;
    baseDistance: number;
    baseElevation: number;
    event: {
      slug: string;
      name: string;
    };
  } | null> {
    try {
      const response = await apiClientV2.get('/zancadas/equivalent-competition', {
        params: { zancadas }
      });
      return response.data.data;
    } catch {
      return null;
    }
  },

  /**
   * Obtener competiciones equivalentes por distancia y desnivel
   * GET /api/v2/zancadas/equivalent-competitions
   */
  async getEquivalentCompetitions(zancadas: number): Promise<EquivalentCompetitionsResponse | null> {
    try {
      const response = await apiClientV2.get('/zancadas/equivalent-competitions', {
        params: { zancadas }
      });
      return response.data.data;
    } catch {
      return null;
    }
  },
};

export default zancadasService;
