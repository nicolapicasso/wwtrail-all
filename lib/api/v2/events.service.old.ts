// lib/api/v2/events.service.ts

import axios from 'axios';
import {
  Event,
  EventDetail,
  EventFilters,
  EventListResponse,
  EventSearchResult,
  EventNearby,
  EventStats,
} from '@/types/v2';

// Cliente específico para API v2
const apiV2 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '/v2') || 'http://localhost:3001/api/v2',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para agregar token
apiV2.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const eventsService = {
  /**
   * Get all events with filters
   */
  async getAll(params?: EventFilters): Promise<EventListResponse> {
    const response = await apiV2.get<EventListResponse>('/events', { params });
    return response.data;
  },

  /**
   * Get event by ID (UUID)
   */
  async getById(id: string): Promise<EventDetail> {
    const response = await apiV2.get<{ status: string; data: EventDetail }>(`/events/${id}`);
    return response.data.data;
  },

  /**
   * Get event by slug (string)
   */
  async getBySlug(slug: string): Promise<EventDetail> {
    const response = await apiV2.get<{ status: string; data: EventDetail }>(`/events/slug/${slug}`);
    return response.data.data;
  },

  /**
   * Search events (full-text)
   */
  async search(params: { q: string; limit?: number }): Promise<EventSearchResult[]> {
    const response = await apiV2.get<{ status: string; data: EventSearchResult[]; count: number }>(
      '/events/search',
      { params }
    );
    return response.data.data;
  },

  /**
   * Find nearby events (geospatial)
   */
  async findNearby(params: { lat: number; lon: number; radius?: number }): Promise<EventNearby[]> {
    const response = await apiV2.get<{ status: string; data: EventNearby[]; count: number }>(
      '/events/nearby',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get featured events
   */
  async getFeatured(limit?: number): Promise<Event[]> {
    const response = await apiV2.get<{ status: string; data: Event[]; count: number }>(
      '/events/featured',
      { params: { limit } }
    );
    return response.data.data;
  },

  /**
   * Get upcoming events
   */
  async getUpcoming(limit?: number): Promise<Event[]> {
    const response = await apiV2.get<{ status: string; data: Event[]; count: number }>(
      '/events/upcoming',
      { params: { limit } }
    );
    return response.data.data;
  },

  /**
   * Get events by country
   */
  async getByCountry(
    country: string,
    options?: { page?: number; limit?: number }
  ): Promise<EventListResponse> {
    const response = await apiV2.get<EventListResponse>(`/events/country/${country}`, {
      params: options,
    });
    return response.data;
  },

  /**
   * Get event statistics
   */
  async getStats(id: string): Promise<EventStats> {
    const response = await apiV2.get<{ status: string; data: EventStats }>(`/events/${id}/stats`);
    return response.data.data;
  },

  /**
   * Create event (requires auth)
   */
  async create(data: Partial<Event>): Promise<Event> {
    const response = await apiV2.post<{ status: string; data: Event }>('/events', data);
    return response.data.data;
  },

  /**
   * Update event (requires auth)
   */
  async update(id: string, data: Partial<Event>): Promise<Event> {
    const response = await apiV2.put<{ status: string; data: Event }>(`/events/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete event (requires auth)
   */
  async delete(id: string): Promise<void> {
    await apiV2.delete(`/events/${id}`);
  },
};
