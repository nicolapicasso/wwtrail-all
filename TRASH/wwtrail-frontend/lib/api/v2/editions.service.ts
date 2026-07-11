// lib/api/v2/editions.service.ts - VERSIÓN CORREGIDA

import { apiClientV2 } from '../client';
import { Edition, EditionFull, EditionStats } from '@/types/edition';

/**
 * Editions Service - USA V2
 * CORREGIDO: Maneja tanto formato anidado como plano del backend
 */

// Backend response structure - puede venir en formato anidado o plano
interface EditionBackendResponse extends Edition {
  // Resolved fields
  distance?: number;
  elevation?: number;
  maxParticipants?: number;
  city?: string;

  // Formato ANIDADO (de /editions con findAllWithInheritance)
  competition?: {
    id: string;
    name: string;
    slug: string;
    type?: string;
    baseDistance?: number;
    baseElevation?: number;
    baseMaxParticipants?: number;
    logoUrl?: string;
    event?: {
      id: string;
      name: string;
      slug: string;
      country?: string;
      city?: string;
      logoUrl?: string;
      latitude?: number;
      longitude?: number;
    };
  };

  // Formato PLANO (de /editions/:id/with-inheritance)
  eventId?: string;
  eventName?: string;
  eventSlug?: string;
  eventCountry?: string;
  eventLogoUrl?: string;
  eventLatitude?: number;
  eventLongitude?: number;
  competitionName?: string;
  competitionSlug?: string;
  competitionType?: string;
  competitionLogoUrl?: string;
  baseDistance?: number;
  baseElevation?: number;
  baseMaxParticipants?: number;
}

// Transform backend response to EditionFull format (handles both nested and flat)
function transformToEditionFull(response: EditionBackendResponse): EditionFull {
  // Check if data comes in nested format (from /editions endpoint)
  const hasNestedCompetition = response.competition && typeof response.competition === 'object';

  if (hasNestedCompetition) {
    // Formato ANIDADO
    const comp = response.competition!;
    const event = comp.event || {};

    return {
      ...response,
      resolvedDistance: response.distance ?? comp.baseDistance ?? 0,
      resolvedElevation: response.elevation ?? comp.baseElevation ?? 0,
      resolvedMaxParticipants: response.maxParticipants ?? comp.baseMaxParticipants ?? 0,
      resolvedCity: response.city ?? event.city ?? '',
      competition: {
        id: comp.id || response.competitionId,
        slug: comp.slug,
        name: comp.name,
        type: comp.type || 'TRAIL',
        baseDistance: comp.baseDistance,
        baseElevation: comp.baseElevation,
        baseMaxParticipants: comp.baseMaxParticipants,
        logoUrl: comp.logoUrl,
      },
      event: {
        id: event.id || '',
        slug: event.slug || '',
        name: event.name || '',
        country: event.country || '',
        city: event.city || response.city || '',
        logoUrl: event.logoUrl,
        latitude: event.latitude,
        longitude: event.longitude,
      },
    };
  } else {
    // Formato PLANO
    return {
      ...response,
      resolvedDistance: response.distance ?? 0,
      resolvedElevation: response.elevation ?? 0,
      resolvedMaxParticipants: response.maxParticipants ?? 0,
      resolvedCity: response.city ?? '',
      competition: {
        id: response.competitionId,
        slug: response.competitionSlug || '',
        name: response.competitionName || '',
        type: response.competitionType || 'TRAIL',
        baseDistance: response.baseDistance,
        baseElevation: response.baseElevation,
        baseMaxParticipants: response.baseMaxParticipants,
        logoUrl: response.competitionLogoUrl,
      },
      event: {
        id: response.eventId || '',
        slug: response.eventSlug || '',
        name: response.eventName || '',
        country: response.eventCountry || '',
        city: response.city || '',
        logoUrl: response.eventLogoUrl,
        latitude: response.eventLatitude,
        longitude: response.eventLongitude,
      },
    };
  }
}

export const editionsService = {
  /**
   * Get all editions with optional filters
   * GET /editions
   */
  async getAll(filters?: { limit?: number; offset?: number; isFeatured?: boolean }): Promise<{ editions: EditionFull[] }> {
    const params = new URLSearchParams();
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    if (filters?.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured.toString());

    const response = await apiClientV2.get<{
      status: string;
      data: { editions: EditionBackendResponse[] };
    }>(`/editions${params.toString() ? `?${params.toString()}` : ''}`);

    // Transform all editions to EditionFull format (handles nested format)
    const editions = (response.data.data?.editions || []).map(transformToEditionFull);
    return { editions };
  },

  /**
   * Get editions by competition ID
   * GET /competitions/:competitionId/editions
   */
  async getByCompetition(
    competitionId: string,
    options?: {
      includeInactive?: boolean;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<Edition[]> {
    try {
      // Usar el endpoint dedicado para obtener ediciones
      const response = await apiClientV2.get<{
        status: string;
        data: Edition[];
      }>(`/competitions/${competitionId}/editions`);

      let editions = response.data.data || [];

      // Ordenar por año
      const sortOrder = options?.sortOrder || 'desc';
      editions = editions.sort((a, b) =>
        sortOrder === 'desc' ? b.year - a.year : a.year - b.year
      );

      return editions;
    } catch (error) {
      console.error('Error getting editions:', error);
      return [];
    }
  },

  /**
   * Get edition by ID
   * GET /editions/:id
   */
  async getById(id: string): Promise<Edition> {
    const response = await apiClientV2.get<{
      status: string;
      data: Edition;
    }>(`/editions/${id}`);
    return response.data.data;
  },

  /**
   * Get edition by slug
   * GET /editions/slug/:slug
   */
  async getBySlug(slug: string): Promise<Edition> {
    const response = await apiClientV2.get<{
      status: string;
      data: Edition;
    }>(`/editions/slug/${slug}`);
    return response.data.data;
  },

  /**
   * Get edition by slug with inheritance (resolved fields)
   * GET /editions/slug/:slug/with-inheritance
   */
  async getBySlugWithInheritance(slug: string): Promise<EditionFull> {
    const response = await apiClientV2.get<{
      status: string;
      data: EditionBackendResponse;
    }>(`/editions/slug/${slug}/with-inheritance`);
    return transformToEditionFull(response.data.data);
  },

  /**
   * Get edition by year
   * Usa getByCompetition y filtra por año
   */
  async getByYear(competitionId: string, year: number): Promise<Edition | null> {
    const editions = await this.getByCompetition(competitionId);
    const edition = editions.find(e => e.year === year);
    return edition || null;
  },

  /**
   * Get edition with inheritance (resolved fields)
   * GET /editions/:id/with-inheritance
   */
  async getWithInheritance(id: string): Promise<EditionFull> {
    const response = await apiClientV2.get<{
      status: string;
      data: EditionBackendResponse;
    }>(`/editions/${id}/with-inheritance`);
    return transformToEditionFull(response.data.data);
  },

  /**
   * Get edition statistics
   * GET /editions/:id/stats
   */
  async getStats(id: string): Promise<EditionStats> {
    const response = await apiClientV2.get<{
      status: string;
      data: EditionStats;
    }>(`/editions/${id}/stats`);
    return response.data.data;
  },

  /**
   * Create edition (requires auth)
   * POST /competitions/:competitionId/editions
   */
  async create(competitionId: string, data: Partial<Edition>): Promise<Edition> {
    const response = await apiClientV2.post<{
      status: string;
      data: Edition;
    }>(`/competitions/${competitionId}/editions`, data);
    return response.data.data;
  },

  /**
   * Create bulk editions (requires auth)
   * POST /competitions/:competitionId/editions/bulk
   */
  async createBulk(competitionId: string, years: number[]): Promise<Edition[]> {
    const response = await apiClientV2.post<{
      status: string;
      data: Edition[];
    }>(`/competitions/${competitionId}/editions/bulk`, { years });
    return response.data.data;
  },

  /**
   * Update edition (requires auth)
   * PUT /editions/:id
   */
  async update(id: string, data: Partial<Edition>): Promise<Edition> {
    const response = await apiClientV2.put<{
      status: string;
      data: Edition;
    }>(`/editions/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete edition (requires auth)
   * DELETE /editions/:id
   */
  async delete(id: string): Promise<void> {
    await apiClientV2.delete(`/editions/${id}`);
  },

  /**
   * Toggle edition active status (requires auth)
   * POST /editions/:id/toggle-active
   */
  async toggleActive(id: string): Promise<Edition> {
    const response = await apiClientV2.post<{
      status: string;
      data: Edition;
    }>(`/editions/${id}/toggle-active`);
    return response.data.data;
  },

  /**
   * Get available years for a competition
   * CORREGIDO: Extrae años de las ediciones
   */
  async getAvailableYears(competitionId: string): Promise<number[]> {
    const editions = await this.getByCompetition(competitionId);
    return editions.map(e => e.year).sort((a, b) => b - a);
  },

  /**
   * Get latest edition for a competition
   * CORREGIDO: Obtiene la más reciente de las ediciones
   */
  async getLatestEdition(competitionId: string): Promise<Edition | null> {
    const editions = await this.getByCompetition(competitionId, { sortOrder: 'desc' });
    return editions.length > 0 ? editions[0] : null;
  },
};

export default editionsService;