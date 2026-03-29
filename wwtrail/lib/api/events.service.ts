/**
 * 🔧 EVENTS SERVICE V1 - Para páginas públicas
 * ============================================
 * ✅ FIX: Agregado soporte para parámetro featured
 */
import { apiClientV1, apiClientV2 } from './client';
import { Event } from '@/types/api';

// ============================================================================
// 📦 TIPOS - V1 específicos
// ============================================================================

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface EventsResponseV1 {
  data: {
    events: Event[];
  };
  pagination: PaginationData;
}

export interface EventResponseV1 {
  data: {
    event: Event;
  };
}

export interface EventFilters {
  country?: string;
  city?: string;  // Filtro por ciudad
  type?: 'TRAIL' | 'ULTRA' | 'SKYRUNNING' | 'VERTICAL' | 'OTHERS';
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean | string;  // ✅ AGREGADO
  typicalMonth?: string;  // ✅ NUEVO: Filtro por mes típico del evento
  language?: string;  // ✅ NUEVO: Idioma para traducciones
}

interface ApiResponse<T> {
  status: string;
  data: T;
}

// ============================================================================
// 📡 SERVICE
// ============================================================================

export const eventsService = {
  /**
   * Obtener lista de eventos con paginación (V1)
   * GET /api/v1/events
   */
  async getAll(filters: EventFilters = {}): Promise<EventsResponseV1> {
    const params = new URLSearchParams();

    if (filters.country) params.append('country', filters.country);
    if (filters.city) params.append('city', filters.city);  // Filtro por ciudad
    if (filters.type) params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    // ✅ FIX CRÍTICO: Agregar featured
    if (filters.featured !== undefined && filters.featured !== null) {
      params.append('featured', filters.featured.toString());
    }

    // ✅ NUEVO: Agregar typicalMonth
    if (filters.typicalMonth) {
      params.append('typicalMonth', filters.typicalMonth);
    }

    // ✅ NUEVO: Agregar language para traducciones
    if (filters.language) {
      params.append('language', filters.language);
    }

    const { data } = await apiClientV2.get('/events', { params });

    // Backend returns { success: true, data: { data: [...events], pagination: {...} } }
    // Unwrap to V1 format: { data: { events: [...] }, pagination: {...} }
    const innerData = data.data; // { data: [...events], pagination: {...} }
    const events = Array.isArray(innerData) ? innerData
      : Array.isArray(innerData?.data) ? innerData.data
      : (innerData?.events || []);
    const pagination = innerData?.pagination || data.pagination;

    return {
      data: { events },
      pagination: pagination || {
        page: 1,
        limit: 12,
        total: events.length,
        pages: 1
      }
    };
  },

  async getById(id: string): Promise<Event> {
    const { data } = await apiClientV2.get<EventResponseV1>(`/events/${id}`);
    return data.data;
  },

  async getBySlug(slug: string): Promise<Event> {
    const { data } = await apiClientV2.get<EventResponseV1>(`/events/slug/${slug}`);
    return data.data;
  },

  async getNearby(lat: number, lon: number, radius: number = 50): Promise<Event[]> {
    const { data } = await apiClientV2.get<{ data: Event[] }>(
      '/events/nearby',
      {
        params: { lat, lon, radius }
      }
    );
    return Array.isArray(data.data) ? data.data : [];
  },

  async search(query: string): Promise<Event[]> {
    const { data } = await apiClientV2.get<{ data: { events: Event[] } }>(
      '/events/search',
      {
        params: { q: query }
      }
    );
    return data.data.events;
  },

  async getFeatured(): Promise<Event[]> {
    const { data } = await apiClientV2.get<{ data: { events: Event[] } }>('/events/featured');
    return data.data.events;
  },

  async getUpcoming(): Promise<Event[]> {
    const { data } = await apiClientV2.get<{ data: { events: Event[] } }>('/events/upcoming');
    return data.data.events;
  },

  /**
   * Actualizar estado de un evento
   */
  async updateStatus(eventId: string, status: string): Promise<ApiResponse<Event>> {
    const response = await apiClientV2.patch(`/events/${eventId}/status`, { status });
    return response.data;
  }
};

export type { EventsResponseV1, EventResponseV1, EventFilters };