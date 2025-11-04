// hooks/useCompetitions.ts - Hook for managing competitions

import { useState, useEffect, useCallback } from 'react';
import { competitionsService } from '@/lib/api/v2';
import {
  Competition,
  CompetitionDetail,
} from '@/types/v2';

/**
 * Hook para obtener competiciones de un evento
 */
export function useCompetitions(eventId: string | null) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetitions = useCallback(async () => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await competitionsService.getByEvent(eventId);
      setCompetitions(data);
    } catch (err: any) {
      setError(err.message || 'Error loading competitions');
      console.error('Error fetching competitions:', err);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  return {
    competitions,
    loading,
    error,
    refetch: fetchCompetitions,
  };
}

/**
 * Hook para obtener una competición por ID
 */
export function useCompetition(id: string | null) {
  const [competition, setCompetition] = useState<CompetitionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetition = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await competitionsService.getById(id);
      setCompetition(data);
    } catch (err: any) {
      setError(err.message || 'Error loading competition');
      console.error('Error fetching competition:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCompetition();
  }, [fetchCompetition]);

  return {
    competition,
    loading,
    error,
    refetch: fetchCompetition,
  };
}

/**
 * Hook para obtener competición por slug
 */
export function useCompetitionBySlug(slug: string | null) {
  const [competition, setCompetition] = useState<CompetitionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetition = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await competitionsService.getBySlug(slug);
      setCompetition(data);
    } catch (err: any) {
      setError(err.message || 'Error loading competition');
      console.error('Error fetching competition by slug:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchCompetition();
  }, [fetchCompetition]);

  return {
    competition,
    loading,
    error,
    refetch: fetchCompetition,
  };
}
