// hooks/useCompetitions.ts - Hook para competiciones v2

import { useState, useEffect } from 'react';
import { Competition } from '@/types/v2';
import { competitionsService } from '@/lib/api/v2';

interface UseCompetitionsResult {
  competitions: Competition[];
  loading: boolean;
  error: string | null;
}

interface UseCompetitionResult {
  competition: Competition | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook para obtener todas las competiciones de un evento
 */
export function useCompetitions(eventId: string): UseCompetitionsResult {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchCompetitions() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await competitionsService.getByEvent(eventId);
        
        if (isMounted) {
          setCompetitions(data);
        }
      } catch (err: any) {
        console.error('Error fetching competitions:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load competitions');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCompetitions();

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  return { competitions, loading, error };
}

/**
 * Hook para obtener una competición específica por slug
 */
export function useCompetition(slug: string): UseCompetitionResult {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchCompetition() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching competition with slug:', slug);
        
        // ✅ Usar getBySlug del service
        const data = await competitionsService.getBySlug(slug);
        
        console.log('✅ Competition fetched:', data);
        
        if (isMounted) {
          setCompetition(data);
        }
      } catch (err: any) {
        console.error('❌ Error fetching competition:', err);
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Failed to load competition');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCompetition();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { competition, loading, error };
}
