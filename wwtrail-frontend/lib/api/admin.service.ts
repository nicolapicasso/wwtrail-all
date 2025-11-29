// lib/api/admin.service.ts

import { apiClientV1 } from './client';
import apiClientV2 from './client-v2';

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalCompetitions: number;
  totalEditions: number;
  pendingApprovals: number;
  newUsersThisMonth: number;
  newEventsThisMonth: number;
  activeUsers: number;
  usersByRole: Array<{
    role: string;
    count: number;
  }>;
  recentActivity: Array<{
    type: string;
    count: number;
    date: string;
  }>;
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: 'ADMIN' | 'ORGANIZER' | 'ATHLETE' | 'VIEWER';
  isActive: boolean;
  isInsider?: boolean;
  isPublic?: boolean;
  avatar?: string;
  country?: string;
  gender?: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    competitions: number;
    reviews: number;
  };
}

// Alias for backwards compatibility
export type AdminUser = User;

export interface UsersPagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Interface para evento pendiente (simplificada)
 * @deprecated - Usar PendingCompetition en su lugar
 */
export interface PendingEvent {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

/**
 * Interface completa para competición pendiente
 * Usada en /admin/competitions/pending
 */
export interface PendingCompetition {
  id: string;
  name: string;
  slug: string;
  type: string;
  baseDistance: number | null;
  baseElevation: number | null;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  event: {
    id: string;
    name: string;
    slug: string;
    country: string;
    city: string;
    organizer: {
      id: string;
      email: string;
      username: string;
      fullName: string;
    };
  };
  totalEditions: number;
}

export interface CompetitionsPagination {
  currentPage: number;
  totalPages: number;
  totalCompetitions: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Interface para contadores de contenido pendiente
 */
export interface PendingContentCounts {
  competitions: number;
  editions: number;
  events: number;
  services: number;
  magazines: number;
  total: number;
}

/**
 * Interface para item de contenido pendiente
 */
export interface PendingContentItem {
  id: string;
  type: 'competition' | 'edition' | 'event' | 'service' | 'magazine';
  name: string;
  status: string;
  createdAt: string;
  createdBy?: {
    id: string;
    username: string;
    email: string;
  };
}

// Comprehensive stats interface
export interface ComprehensiveStats {
  overview: {
    totalUsers: number;
    totalEvents: number;
    totalCompetitions: number;
    totalEditions: number;
    totalSpecialSeries: number;
    totalServices: number;
    totalReviews: number;
    totalOrganizers: number;
    totalCategories: number;
    totalParticipants: number;
    totalFavorites: number;
  };
  users: {
    total: number;
    active: number;
    inactive: number;
    insiders: number;
    publicProfiles: number;
    privateProfiles: number;
    newThisMonth: number;
    newThisWeek: number;
    byRole: Array<{ role: string; count: number }>;
  };
  events: {
    total: number;
    newThisMonth: number;
    byStatus: Array<{ status: string; count: number }>;
    byCountry: Array<{ country: string; count: number }>;
  };
  competitions: {
    total: number;
    newThisMonth: number;
    byStatus: Array<{ status: string; count: number }>;
    byType: Array<{ type: string; count: number }>;
  };
  editions: {
    total: number;
    upcoming: number;
    past: number;
    newThisMonth: number;
    byStatus: Array<{ status: string; count: number }>;
  };
  specialSeries: {
    total: number;
    byStatus: Array<{ status: string; count: number }>;
  };
  services: {
    total: number;
    featured: number;
    byStatus: Array<{ status: string; count: number }>;
    byCategory: Array<{ categoryId: string; categoryName: string; count: number }>;
  };
  reviews: {
    total: number;
    thisMonth: number;
    thisWeek: number;
    averageRating: number;
  };
  organizers: {
    total: number;
    verified: number;
    unverified: number;
  };
  recentActivity: {
    usersThisWeek: number;
    eventsThisMonth: number;
    competitionsThisMonth: number;
    editionsThisMonth: number;
    reviewsThisWeek: number;
  };
}

class AdminService {
  // Dashboard stats
  async getStats(): Promise<AdminStats> {
    const { data } = await apiClientV1.get('/admin/stats');
    return data.data;
  }

  // Comprehensive stats
  async getComprehensiveStats(): Promise<ComprehensiveStats> {
    const { data } = await apiClientV1.get('/admin/stats/comprehensive');
    return data.data;
  }

  // ============================================
  // PENDING CONTENT (V2 API)
  // ============================================

  /**
   * Obtener contadores de contenido pendiente
   * Para mostrar badge en el menú admin
   */
  async getPendingContentCounts(): Promise<PendingContentCounts> {
    const { data } = await apiClientV2.get('/admin/pending/count');
    return data.data;
  }

  /**
   * Obtener listado de todo el contenido pendiente
   */
  async getPendingContent(): Promise<PendingContentItem[]> {
    const { data } = await apiClientV2.get('/admin/pending');
    const result = data.data;

    // Flatten the grouped response into a single array
    const items: PendingContentItem[] = [];

    if (result.events) {
      items.push(...result.events.map((e: any) => ({
        id: e.id,
        type: 'event' as const,
        name: e.name,
        status: 'DRAFT',
        createdAt: e.createdAt,
        createdBy: e.user ? {
          id: e.user.id,
          username: e.user.username,
          email: '',
        } : undefined,
      })));
    }

    if (result.competitions) {
      items.push(...result.competitions.map((c: any) => ({
        id: c.id,
        type: 'competition' as const,
        name: c.name,
        status: 'DRAFT',
        createdAt: c.createdAt,
        createdBy: c.organizer ? {
          id: c.organizer.id,
          username: c.organizer.username,
          email: '',
        } : undefined,
      })));
    }

    if (result.services) {
      items.push(...result.services.map((s: any) => ({
        id: s.id,
        type: 'service' as const,
        name: s.name,
        status: 'DRAFT',
        createdAt: s.createdAt,
        createdBy: s.organizer ? {
          id: s.organizer.id,
          username: s.organizer.username,
          email: '',
        } : undefined,
      })));
    }

    if (result.organizers) {
      items.push(...result.organizers.map((o: any) => ({
        id: o.id,
        type: 'service' as const, // organizers shown as service type for compatibility
        name: o.name,
        status: 'DRAFT',
        createdAt: o.createdAt,
        createdBy: o.createdBy ? {
          id: o.createdBy.id,
          username: o.createdBy.username,
          email: '',
        } : undefined,
      })));
    }

    if (result.specialSeries) {
      items.push(...result.specialSeries.map((ss: any) => ({
        id: ss.id,
        type: 'edition' as const, // special series shown as edition type for compatibility
        name: ss.name,
        status: 'DRAFT',
        createdAt: ss.createdAt,
        createdBy: ss.createdBy ? {
          id: ss.createdBy.id,
          username: ss.createdBy.username,
          email: '',
        } : undefined,
      })));
    }

    if (result.posts) {
      items.push(...result.posts.map((p: any) => ({
        id: p.id,
        type: 'magazine' as const,
        name: p.title,
        status: 'DRAFT',
        createdAt: p.createdAt,
        createdBy: p.author ? {
          id: p.author.id,
          username: p.author.username,
          email: '',
        } : undefined,
      })));
    }

    if (result.promotions) {
      items.push(...result.promotions.map((pr: any) => ({
        id: pr.id,
        type: 'service' as const, // promotions shown as service type
        name: pr.title,
        status: 'DRAFT',
        createdAt: pr.createdAt,
        createdBy: pr.createdBy ? {
          id: pr.createdBy.id,
          username: pr.createdBy.username,
          email: '',
        } : undefined,
      })));
    }

    // Sort by createdAt descending
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return items;
  }

  // Users management
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ users: User[]; pagination: UsersPagination }> {
    const { data } = await apiClientV1.get('/admin/users', { params });
    return {
      users: data.data,
      pagination: data.pagination,
    };
  }

  async getUserById(userId: string): Promise<User> {
    const { data } = await apiClientV1.get(`/admin/users/${userId}`);
    return data.data;
  }

  async getUserStats(userId: string) {
    const { data } = await apiClientV1.get(`/admin/users/${userId}/stats`);
    return data.data;
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const { data } = await apiClientV1.patch(`/admin/users/${userId}/role`, { role });
    return data.data;
  }

  async toggleUserStatus(userId: string): Promise<User> {
    const { data } = await apiClientV1.patch(`/admin/users/${userId}/toggle-status`);
    return data.data;
  }

  async deleteUser(userId: string) {
    const { data } = await apiClientV1.delete(`/admin/users/${userId}`);
    return data;
  }

  /**
   * Update user data (admin only)
   */
  async updateUser(userId: string, userData: {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    country?: string;
    gender?: string;
  }): Promise<User> {
    const { data } = await apiClientV1.patch(`/admin/users/${userId}`, userData);
    return data.data;
  }

  /**
   * Create a new user (admin only)
   */
  async createUser(userData: {
    email: string;
    username: string;
    firstName: string;
    lastName?: string;
    role: string;
    country?: string;
    gender?: string;
  }): Promise<{ user: User; generatedPassword: string }> {
    const { data } = await apiClientV1.post('/admin/users', userData);
    return {
      user: data.data,
      generatedPassword: data.generatedPassword,
    };
  }

  /**
   * Toggle insider status for a user
   */
  async toggleInsiderStatus(userId: string): Promise<User> {
    const { data } = await apiClientV1.patch(`/admin/users/${userId}/toggle-insider`);
    return data.data;
  }

  /**
   * Toggle public status for a user
   */
  async togglePublicStatus(userId: string): Promise<User> {
    const { data } = await apiClientV1.patch(`/admin/users/${userId}/toggle-public`);
    return data.data;
  }

  // ============================================
  // INSIDERS MANAGEMENT
  // ============================================

  /**
   * Get all insiders with stats
   */
  async getInsiders(): Promise<{
    insiders: Array<User & { isInsider: boolean }>;
    stats: {
      total: number;
      byCountry: Record<string, number>;
      byGender: Record<string, number>;
    };
  }> {
    const { data } = await apiClientV1.get('/admin/insiders');
    return {
      insiders: data.data,
      stats: data.stats,
    };
  }

  /**
   * Get insider config (badge and intro texts)
   */
  async getInsiderConfig(): Promise<{
    id: string;
    badgeUrl?: string;
    introTextES?: string;
    introTextEN?: string;
    introTextIT?: string;
    introTextCA?: string;
    introTextFR?: string;
    introTextDE?: string;
  }> {
    const { data } = await apiClientV1.get('/admin/insiders/config');
    return data.data;
  }

  /**
   * Update insider config
   */
  async updateInsiderConfig(configData: {
    badgeUrl?: string;
    introTextES?: string;
    introTextEN?: string;
    introTextIT?: string;
    introTextCA?: string;
    introTextFR?: string;
    introTextDE?: string;
  }): Promise<any> {
    const { data } = await apiClientV1.put('/admin/insiders/config', configData);
    return data.data;
  }

  // ============================================
  // COMPETITIONS MANAGEMENT
  // ============================================

  /**
   * Obtener competiciones pendientes de aprobación
   * Devuelve todas las competiciones con status DRAFT
   */
  async getPendingEvents(params?: {
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'name' | 'startDate';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: PendingCompetition[]; pagination: CompetitionsPagination }> {
    const { data } = await apiClientV1.get('/admin/competitions/pending', { params });
    return {
      data: data.data,
      pagination: data.pagination,
    };
  }

  /**
   * Aprobar una competición
   * NUEVO: Acepta adminNotes opcional
   */
  async approveEvent(competitionId: string, adminNotes?: string) {
    const body = adminNotes ? { adminNotes } : {};
    const { data } = await apiClientV1.post(
      `/admin/competitions/${competitionId}/approve`,
      body
    );
    return data.data;
  }

  /**
   * Rechazar una competición
   * Acepta razón opcional
   */
  async rejectEvent(competitionId: string, reason?: string) {
    const body = reason ? { reason } : {};
    const { data } = await apiClientV1.post(
      `/admin/competitions/${competitionId}/reject`,
      body
    );
    return data.data;
  }

  /**
   * Obtener estadísticas de competiciones
   */
  async getCompetitionStats() {
    const { data } = await apiClientV1.get('/admin/competitions/stats');
    return data.data;
  }

  // Activity logs (no implementado en backend aún, devuelve array vacío)
  async getActivityLogs(params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) {
    try {
      const { data } = await apiClientV1.get('/admin/logs', { params });
      return data;
    } catch (error) {
      // Endpoint no implementado aún, devolver estructura vacía
      return {
        success: true,
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          total: 0,
        },
      };
    }
  }
}

export const adminService = new AdminService();
