// hooks/useMyStats.ts
import { useState, useEffect } from 'react';
import { eventsService } from '@/lib/api/v2';

interface MyStats {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  rejectedEvents: number;
  totalCompetitions: number;
  totalEditions: number;
  totalViews: number;
}

export function useMyStats() {
  const [stats, setStats] = useState<MyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await eventsService.getMyStats();
        
        // ✅ CORRECCIÓN: Usar response directamente, no response.data
        setStats(response);
      } catch (err: any) {
        console.error('Error fetching my stats:', err);
        setError(err.response?.data?.message || 'Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
  };
}