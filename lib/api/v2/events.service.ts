// lib/api/v2/events.service.ts

import { apiClientV2 } from '../client';
import {
  Event,
  EventDetail,
  EventFilters,
  EventListResponse,
  EventSearchResult,
  EventNearby,
  EventStats,
} from '@/types/v2';

/**
 * Events Service - USA V2
 * Usa apiClientV2 que tiene baseURL=/api/v2
 */
export const eventsService = {
  /**
   * Get all events with filters
   */
  async getAll(params?: EventFilters): Promise<EventListResponse> {
    const response = await apiClientV2.get<EventListResponse>('/events', { params });
    return response.data;
  },

  /**
   * Get event by ID (UUID)
   */
  async getById(id: string): Promise<EventDetail> {
    const response = await apiClientV2.get<{ status: string; data: EventDetail }>(`/events/${id}`);
    return response.data.data;
  },

  /**
   * Get event by slug (string)
   */
  async getBySlug(slug: string): Promise<EventDetail> {
    const response = await apiClientV2.get<{ status: string; data: EventDetail }>(`/events/slug/${slug}`);
    return response.data.data;
  },

  /**
   * Search events (full-text)
   */
  async search(params: { q: string; limit?: number }): Promise<EventSearchResult[]> {
    const response = await apiClientV2.get<{ status: string; data: EventSearchResult[]; count: number }>(
      '/events/search',
      { params }
    );
    return response.data.data;
  },

  /**
   * Find nearby events (geospatial)
   */
  async findNearby(params: { lat: number; lon: number; radius?: number }): Promise<EventNearby[]> {
    const response = await apiClientV2.get<{ status: string; data: EventNearby[]; count: number }>(
      '/events/nearby',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get featured events
   */
  async getFeatured(limit?: number): Promise<Event[]> {
    const response = await apiClientV2.get<{ status: string; data: Event[]; count: number }>(
      '/events/featured',
      { params: { limit } }
    );
    return response.data.data;
  },

  /**
   * Get upcoming events
   */
  async getUpcoming(limit?: number): Promise<Event[]> {
    const response = await apiClientV2.get<{ status: string; data: Event[]; count: number }>(
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
    const response = await apiClientV2.get<EventListResponse>(`/events/country/${country}`, {
      params: options,
    });
    return response.data;
  },

  /**
   * Get event statistics
   */
  async getStats(id: string): Promise<EventStats> {
    const response = await apiClientV2.get<{ status: string; data: EventStats }>(`/events/${id}/stats`);
    return response.data.data;
  },

  /**
   * Create event (requires auth)
   */
  async create(data: Partial<Event>): Promise<Event> {
    const response = await apiClientV2.post<{ status: string; data: Event }>('/events', data);
    return response.data.data;
  },

  /**
   * Update event (requires auth)
   */
  async update(id: string, data: Partial<Event>): Promise<Event> {
    const response = await apiClientV2.put<{ status: string; data: Event }>(`/events/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete event (requires auth)
   */
  async delete(id: string): Promise<void> {
    await apiClientV2.delete(`/events/${id}`);
  },

  /**
   * Get my events (requires auth: ORGANIZER or ADMIN)
   */
  async getMyEvents(filters?: Partial<EventFilters>): Promise<EventListResponse> {
    const response = await apiClientV2.get<EventListResponse>('/events/my-events', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get my stats (requires auth: ORGANIZER or ADMIN)
   */
  async getMyStats(): Promise<{
    totalEvents: number;
    publishedEvents: number;
    draftEvents: number;
    rejectedEvents: number;
    totalCompetitions: number;
    totalEditions: number;
    totalViews: number;
  }> {
    const response = await apiClientV2.get<{
      status: string;
      data: {
        totalEvents: number;
        publishedEvents: number;
        draftEvents: number;
        rejectedEvents: number;
        totalCompetitions: number;
        totalEditions: number;
        totalViews: number;
      };
    }>('/events/my-stats');
    return response.data.data;
  },

  /**
   * Get pending events (requires auth: ADMIN only)
   */
  async getPendingEvents(filters?: { page?: number; limit?: number }): Promise<EventListResponse> {
    const response = await apiClientV2.get<EventListResponse>('/events/pending', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Approve event (requires auth: ADMIN only)
   */
  async approveEvent(eventId: string): Promise<Event> {
    const response = await apiClientV2.post<{ status: string; message: string; data: Event }>(
      `/events/${eventId}/approve`
    );
    return response.data.data;
  },

  /**
   * Reject event (requires auth: ADMIN only)
   */
  async rejectEvent(eventId: string, reason?: string): Promise<Event> {
    const response = await apiClientV2.post<{ status: string; message: string; data: Event }>(
      `/events/${eventId}/reject`,
      { reason }
    );
    return response.data.data;
  },
};