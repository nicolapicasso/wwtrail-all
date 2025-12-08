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
  specialSeries: number;
  total: number;
}

/**
 * Interface para item de contenido pendiente
 */
export interface PendingContentItem {
  id: string;
  type: 'competition' | 'edition' | 'event' | 'service' | 'magazine' | 'specialSeries';
  name: string;
  status: string;
  createdAt: string;
  createdBy?: {
    id: string;
    username: string;
    email: string;
  };
}

// Zancadas stats interface
export interface ZancadasStats {
  totalTransactions: number;
  totalPointsAwarded: number;
  usersWithPoints: number;
  transactionsByAction: Array<{
    actionCode: string;
    actionName: string;
    count: number;
    points: number;
  }>;
  recentTransactions: Array<{
    id: string;
    points: number;
    createdAt: string;
    actionName: string;
    actionCode: string;
    userName: string;
    userEmail: string;
  }>;
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

  // Zancadas stats
  async getZancadasStats(): Promise<ZancadasStats | null> {
    try {
      const { data } = await apiClientV2.get('/admin/zancadas/stats');
      return data.data;
    } catch {
      // Return null if Zancadas is not configured
      return null;
    }
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
    const breakdown = data.data.breakdown || data.data;

    return {
      competitions: breakdown.competitions || 0,
      editions: breakdown.editions || 0,
      events: breakdown.events || 0,
      services: (breakdown.services || 0) + (breakdown.organizers || 0) + (breakdown.promotions || 0),
      magazines: breakdown.posts || 0,
      specialSeries: breakdown.specialSeries || 0,
      total: data.data.total || 0,
    };
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
        type: 'specialSeries' as const,
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
   * Regenerate password for a user (admin only)
   */
  async regeneratePassword(userId: string): Promise<{ user: User; generatedPassword: string }> {
    const { data } = await apiClientV1.post(`/admin/users/${userId}/regenerate-password`);
    return {
      user: data.data,
      generatedPassword: data.generatedPassword,
    };
  }

  /**
   * Get user by ID for admin editing
   */
  async getUserById(userId: string): Promise<User> {
    const { data } = await apiClientV1.get(`/admin/users/${userId}`);
    return data.data;
  }

  /**
   * Update user by ID (admin editing another user)
   */
  async updateUserById(userId: string, userData: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    phone?: string;
    city?: string;
    country?: string;
    language?: string;
    gender?: string;
    birthDate?: string;
    isPublic?: boolean;
    avatar?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    twitterUrl?: string;
    youtubeUrl?: string;
  }): Promise<User> {
    const { data } = await apiClientV1.put(`/admin/users/${userId}`, userData);
    return data.data;
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
   * Aprobar cualquier tipo de contenido pendiente
   * @param type - Tipo de contenido (event, competition, service, magazine, specialSeries)
   * @param id - ID del elemento
   */
  async approveContent(type: string, id: string): Promise<any> {
    switch (type) {
      case 'competition':
        return this.approveEvent(id);
      case 'event':
        // Publicar evento directamente
        const { data: eventData } = await apiClientV2.patch(`/events/${id}`, { status: 'PUBLISHED' });
        return eventData.data;
      case 'service':
        // Publicar servicio directamente
        const { data: serviceData } = await apiClientV2.patch(`/services/${id}`, { status: 'PUBLISHED' });
        return serviceData.data;
      case 'magazine':
        // Publicar post directamente
        const { data: postData } = await apiClientV2.patch(`/posts/${id}`, { status: 'PUBLISHED' });
        return postData.data;
      case 'edition':
        // Las ediciones normalmente no tienen status de aprobación, pero si lo tienen:
        const { data: editionData } = await apiClientV2.patch(`/editions/${id}`, { status: 'PUBLISHED' });
        return editionData.data;
      case 'specialSeries':
        // Publicar serie especial
        const { data: seriesData } = await apiClientV2.patch(`/special-series/${id}`, { status: 'PUBLISHED' });
        return seriesData.data;
      default:
        throw new Error(`Tipo de contenido no soportado: ${type}`);
    }
  }

  /**
   * Rechazar (eliminar) cualquier tipo de contenido pendiente
   * @param type - Tipo de contenido (competition, event, service, magazine, edition, specialSeries)
   * @param id - ID del elemento
   */
  async rejectContent(type: string, id: string): Promise<any> {
    switch (type) {
      case 'competition':
        const { data: compData } = await apiClientV2.delete(`/competitions/${id}`);
        return compData.data;
      case 'event':
        const { data: eventData } = await apiClientV2.delete(`/events/${id}`);
        return eventData.data;
      case 'service':
        const { data: serviceData } = await apiClientV2.delete(`/services/${id}`);
        return serviceData.data;
      case 'magazine':
        const { data: postData } = await apiClientV2.delete(`/posts/${id}`);
        return postData.data;
      case 'edition':
        const { data: editionData } = await apiClientV2.delete(`/editions/${id}`);
        return editionData.data;
      case 'specialSeries':
        const { data: seriesData } = await apiClientV2.delete(`/special-series/${id}`);
        return seriesData.data;
      default:
        throw new Error(`Tipo de contenido no soportado: ${type}`);
    }
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

  // ============================================
  // IMPORT SYSTEM
  // ============================================

  /**
   * Get import statistics
   */
  async getImportStats(): Promise<{
    organizers: number;
    specialSeries: number;
    events: number;
    competitions: number;
    terrainTypes: number;
  }> {
    const { data } = await apiClientV1.get('/admin/import/stats');
    return data.data;
  }

  /**
   * Ensure terrain types exist
   */
  async ensureTerrainTypes(): Promise<{
    created: number;
    skipped: number;
    errors: Array<{ identifier: string; error: string }>;
  }> {
    const { data } = await apiClientV1.post('/admin/import/terrain-types');
    return data.data;
  }

  /**
   * Import organizers
   */
  async importOrganizers(organizers: Array<{ id: string; slug: string; name: string }>): Promise<{
    created: number;
    skipped: number;
    errors: Array<{ identifier: string; error: string }>;
  }> {
    const { data } = await apiClientV1.post('/admin/import/organizers', organizers);
    return data.data;
  }

  /**
   * Import special series
   */
  async importSeries(series: Array<{ id: string; slug: string; name: string }>): Promise<{
    created: number;
    skipped: number;
    errors: Array<{ identifier: string; error: string }>;
  }> {
    const { data } = await apiClientV1.post('/admin/import/series', series);
    return data.data;
  }

  /**
   * Import events
   */
  async importEvents(events: any[]): Promise<{
    created: number;
    skipped: number;
    errors: Array<{ identifier: string; error: string }>;
  }> {
    const { data } = await apiClientV1.post('/admin/import/events', events);
    return data.data;
  }

  /**
   * Import competitions
   */
  async importCompetitions(competitions: any[]): Promise<{
    created: number;
    skipped: number;
    errors: Array<{ identifier: string; error: string }>;
  }> {
    const { data } = await apiClientV1.post('/admin/import/competitions', competitions);
    return data.data;
  }

  /**
   * Full import (organizers + series + events + competitions)
   */
  async importFull(importData: {
    organizers?: any[];
    series?: any[];
    events?: any[];
    competitions?: any[];
  }): Promise<{
    organizers?: { created: number; skipped: number; errors: any[] };
    series?: { created: number; skipped: number; errors: any[] };
    events?: { created: number; skipped: number; errors: any[] };
    competitions?: { created: number; skipped: number; errors: any[] };
    terrainTypes?: { created: number; skipped: number; errors: any[] };
  }> {
    const { data } = await apiClientV1.post('/admin/import/full', importData);
    return data.data;
  }

  // ============================================
  // BULK DELETE METHODS
  // ============================================

  /**
   * Delete all competitions
   */
  async deleteAllCompetitions(): Promise<{ deleted: number }> {
    const { data } = await apiClientV1.delete('/admin/import/competitions');
    return data.data;
  }

  /**
   * Delete all events (and competitions)
   */
  async deleteAllEvents(): Promise<{ deleted: number }> {
    const { data } = await apiClientV1.delete('/admin/import/events');
    return data.data;
  }

  /**
   * Delete all series
   */
  async deleteAllSeries(): Promise<{ deleted: number }> {
    const { data } = await apiClientV1.delete('/admin/import/series');
    return data.data;
  }

  /**
   * Delete all organizers
   */
  async deleteAllOrganizers(): Promise<{ deleted: number }> {
    const { data } = await apiClientV1.delete('/admin/import/organizers');
    return data.data;
  }

  /**
   * Delete all editions
   */
  async deleteAllEditions(): Promise<{ deleted: number }> {
    const { data } = await apiClientV1.delete('/admin/import/editions');
    return data.data;
  }

  /**
   * Delete all imported data (full reset)
   */
  async deleteAllImportedData(): Promise<{
    competitions: number;
    events: number;
    series: number;
    organizers: number;
  }> {
    const { data } = await apiClientV1.delete('/admin/import/all');
    return data.data;
  }

  // ============================================
  // NATIVE IMPORT SYSTEM (Import using export format)
  // ============================================

  /**
   * Validate native import file and detect conflicts
   */
  async validateNativeImport(
    entityType: NativeImportEntityType,
    file: NativeImportFile
  ): Promise<NativeValidationResult> {
    const { data } = await apiClientV2.post('/admin/import/native/validate', {
      ...file,
      entity: entityType,
    }, {
      params: { entityType },
    });
    return data.data;
  }

  /**
   * Import from native export format
   */
  async importNative(
    entityType: NativeImportEntityType,
    file: NativeImportFile,
    options: NativeImportOptions = {}
  ): Promise<NativeImportResult> {
    const { data } = await apiClientV2.post('/admin/import/native', {
      ...file,
      entity: entityType,
      conflictResolution: options.conflictResolution || 'skip',
      dryRun: options.dryRun || false,
    }, {
      params: { entityType },
    });
    return data.data;
  }

  // ============================================
  // EXPORT SYSTEM
  // ============================================

  /**
   * Get export statistics (counts)
   */
  async getExportStats(): Promise<{
    events: number;
    competitions: number;
    editions: number;
    organizers: number;
    specialSeries: number;
    services: number;
    posts: number;
    users: number;
  }> {
    const { data } = await apiClientV2.get('/admin/export/stats');
    return data.data;
  }

  /**
   * Export all data (full backup) - returns download URL
   */
  async exportAll(includeRelations = true): Promise<Blob> {
    const { data } = await apiClientV2.get('/admin/export/full', {
      params: { includeRelations },
      responseType: 'blob',
    });
    return data;
  }

  /**
   * Export specific entity type
   */
  async exportEntity(
    entityType: 'events' | 'competitions' | 'editions' | 'organizers' | 'series' | 'services' | 'posts' | 'users',
    includeRelations = true
  ): Promise<Blob> {
    const { data } = await apiClientV2.get(`/admin/export/${entityType}`, {
      params: { includeRelations },
      responseType: 'blob',
    });
    return data;
  }

  // ============================================
  // BULK EDIT SYSTEM
  // ============================================

  /**
   * Get metadata for all entities (fields, types, etc.)
   */
  async getBulkEditMetadata(): Promise<EntityMetadata[]> {
    const { data } = await apiClientV2.get('/admin/bulk-edit/metadata');
    return data.data;
  }

  /**
   * Get options for a relation field (for dropdowns)
   */
  async getBulkEditRelationOptions(relationEntity: string): Promise<{ id: string; name: string }[]> {
    const { data } = await apiClientV2.get(`/admin/bulk-edit/relations/${relationEntity}`);
    return data.data;
  }

  /**
   * Query records with filters (for preview)
   */
  async bulkEditQuery(
    entityType: BulkEditEntityType,
    filters: BulkEditFilters,
    limit = 100
  ): Promise<{ count: number; data: any[] }> {
    const { data } = await apiClientV2.post('/admin/bulk-edit/query', {
      entityType,
      filters,
      limit,
    });
    return { count: data.count, data: data.data };
  }

  /**
   * Preview bulk edit operation
   */
  async bulkEditPreview(
    entityType: BulkEditEntityType,
    filters: BulkEditFilters,
    operation: BulkEditOperation
  ): Promise<BulkEditPreview> {
    const { data } = await apiClientV2.post('/admin/bulk-edit/preview', {
      entityType,
      filters,
      operation,
    });
    return data.data;
  }

  /**
   * Execute bulk edit operation
   */
  async bulkEditExecute(
    entityType: BulkEditEntityType,
    filters: BulkEditFilters,
    operation: BulkEditOperation
  ): Promise<BulkEditResult> {
    const { data } = await apiClientV2.post('/admin/bulk-edit/execute', {
      entityType,
      filters,
      operation,
    });
    return data.data;
  }

  /**
   * Disconnect special series from competitions
   */
  async bulkDisconnectSeries(
    filters: BulkEditFilters,
    seriesId: string
  ): Promise<BulkEditResult> {
    const { data } = await apiClientV2.post('/admin/bulk-edit/disconnect-series', {
      filters,
      seriesId,
    });
    return data.data;
  }
}

// ============================================
// BULK EDIT TYPES
// ============================================

export type BulkEditEntityType =
  | 'event'
  | 'competition'
  | 'edition'
  | 'organizer'
  | 'specialSeries'
  | 'service'
  | 'post';

export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'in'
  | 'is_null'
  | 'is_not_null';

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface BulkEditFilters {
  conditions: FilterCondition[];
  logic?: 'AND' | 'OR';
}

export interface BulkEditOperation {
  field: string;
  value: any;
}

export interface BulkEditResult {
  success: boolean;
  entityType: BulkEditEntityType;
  updatedCount: number;
  updatedIds: string[];
  errors?: string[];
}

export interface BulkEditPreview {
  entityType: BulkEditEntityType;
  matchingCount: number;
  matchingRecords: {
    id: string;
    displayName: string;
    currentValue: any;
    newValue: any;
  }[];
  field: string;
}

export interface FieldMetadata {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'date' | 'relation';
  enumValues?: string[];
  relationEntity?: string;
  filterable: boolean;
  editable: boolean;
}

export interface EntityMetadata {
  name: BulkEditEntityType;
  label: string;
  fields: FieldMetadata[];
}

// ============================================
// NATIVE IMPORT TYPES
// ============================================

export type NativeImportEntityType =
  | 'events'
  | 'competitions'
  | 'editions'
  | 'organizers'
  | 'specialSeries'
  | 'services'
  | 'posts';

export type ConflictResolution = 'skip' | 'update' | 'create_new';

export interface NativeImportFile {
  exportedAt?: string;
  entity?: string;
  version?: string;
  count?: number;
  data: any[];
}

export interface NativeImportOptions {
  conflictResolution?: ConflictResolution;
  dryRun?: boolean;
}

export interface ConflictItem {
  index: number;
  item: any;
  conflictType: 'id_exists' | 'slug_exists' | 'both_exist';
  existingId?: string;
  existingSlug?: string;
}

export interface NativeValidationResult {
  isValid: boolean;
  entityType: NativeImportEntityType;
  totalItems: number;
  validItems: number;
  conflicts: ConflictItem[];
  errors: string[];
  warnings: string[];
  preview: {
    toCreate: number;
    toSkip: number;
    potentialUpdates: number;
  };
}

export interface NativeImportResultItem {
  index: number;
  action: 'created' | 'updated' | 'skipped' | 'error';
  id?: string;
  slug?: string;
  message?: string;
}

export interface NativeImportResult {
  success: boolean;
  entityType: NativeImportEntityType;
  dryRun: boolean;
  summary: {
    total: number;
    created: number;
    updated: number;
    skipped: number;
    errors: number;
  };
  results: NativeImportResultItem[];
  errors: string[];
}

export const adminService = new AdminService();
