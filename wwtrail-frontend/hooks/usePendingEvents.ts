// hooks/usePendingEvents.ts
import { useState, useEffect } from 'react';
import { eventsService } from '@/lib/api/v2';
import { Event, EventFilters } from '@/types/v2';
import { EventStatus } from '@/types/event';


export function usePendingEvents(filters?: EventFilters) {
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
    const response = await eventsService.getAll({
      status: EventStatus.DRAFT,   // Filtra eventos en borrador = pendientes
      ...filters,
      page: filters?.page || 1,
      limit: filters?.limit || 10,
    });

        setEvents(response.data);
        // ✅ CORRECCIÓN: Mapear pages a totalPages
        setPagination({
          ...response.pagination,
          totalPages: response.pagination.pages
        });
      } catch (err: any) {
        console.error('Error fetching pending events:', err);
        setError(err.response?.data?.message || 'Error al cargar eventos pendientes');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingEvents();
  }, [filters]);

  return {
    events,
    pagination,
    loading,
    error,
  };
}