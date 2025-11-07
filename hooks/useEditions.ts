// hooks/useEditions.ts - Hook for managing editions

import { useState, useEffect, useCallback } from 'react';
import { editionsService } from '@/lib/api/v2';
import {
  Edition,
  EditionFull,
  EditionDetail,
  EditionListResponse,
  EditionFilters,
} from '@/types/v2';

/**
 * Hook para obtener ediciones de una competición
 */
export function useEditions(competitionId: string | null, filters?: EditionFilters) {
  const [data, setData] = useState<EditionListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEditions = useCallback(async () => {
    if (!competitionId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
const response = await editionsService.getByCompetition(competitionId, filters);
setData({
  data: response,
  pagination: {
    page: filters?.page || 1,
    limit: filters?.limit || 20,
    total: response.length,
    pages: 1
  }
});
    } catch (err: any) {
      setError(err.message || 'Error loading editions');
      console.error('Error fetching editions:', err);
    } finally {
      setLoading(false);
    }
  }, [competitionId, filters]);

  useEffect(() => {
    fetchEditions();
  }, [fetchEditions]);

  return {
    editions: data?.data || [],
    pagination: data?.pagination,
    loading,
    error,
    refetch: fetchEditions,
  };
}

/**
 * Hook para obtener una edición por ID
 */
export function useEdition(id: string | null) {
  const [edition, setEdition] = useState<Edition | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEdition = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await editionsService.getById(id);
      setEdition(data);
    } catch (err: any) {
      setError(err.message || 'Error loading edition');
      console.error('Error fetching edition:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEdition();
  }, [fetchEdition]);

  return {
    edition,
    loading,
    error,
    refetch: fetchEdition,
  };
}

/**
 * Hook para obtener edición CON HERENCIA ⭐
 * Este es el hook principal para mostrar detalles de una edición
 */
export function useEditionWithInheritance(id: string | null) {
  const [edition, setEdition] = useState<Edition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEdition = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await editionsService.getWithInheritance(id);
      setEdition(data);
    } catch (err: any) {
      setError(err.message || 'Error loading edition');
      console.error('Error fetching edition with inheritance:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEdition();
  }, [fetchEdition]);

  return {
    edition,
    loading,
    error,
    refetch: fetchEdition,
  };
}

/**
 * Hook para obtener edición por slug
 */
export function useEditionBySlug(slug: string | null) {
  const [edition, setEdition] = useState<Edition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEdition = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await editionsService.getBySlug(slug);
      setEdition(data);
    } catch (err: any) {
      setError(err.message || 'Error loading edition');
      console.error('Error fetching edition by slug:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchEdition();
  }, [fetchEdition]);

  return {
    edition,
    loading,
    error,
    refetch: fetchEdition,
  };
}

/**
 * Hook para obtener edición de un año específico
 */
export function useEditionByYear(competitionId: string | null, year: number | null) {
  const [edition, setEdition] = useState<Edition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEdition = useCallback(async () => {
    if (!competitionId || !year) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await editionsService.getByYear(competitionId, year);
      setEdition(data);
    } catch (err: any) {
      setError(err.message || 'Error loading edition');
      console.error('Error fetching edition by year:', err);
    } finally {
      setLoading(false);
    }
  }, [competitionId, year]);

  useEffect(() => {
    fetchEdition();
  }, [fetchEdition]);

  return {
    edition,
    loading,
    error,
    refetch: fetchEdition,
  };
}

/**
 * Hook para obtener años disponibles de una competición ⭐
 * Útil para crear selectores de año
 */
export function useAvailableYears(competitionId: string | null) {
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchYears = useCallback(async () => {
    if (!competitionId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await editionsService.getAvailableYears(competitionId);
      setYears(data);
    } catch (err: any) {
      setError(err.message || 'Error loading available years');
      console.error('Error fetching available years:', err);
    } finally {
      setLoading(false);
    }
  }, [competitionId]);

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  return {
    years,
    loading,
    error,
    refetch: fetchYears,
  };
}

/**
 * Hook para obtener edición actual (año en curso)
 */
export function useCurrentEdition(competitionId: string | null) {
  const currentYear = new Date().getFullYear();
  return useEditionByYear(competitionId, currentYear);
}

/**
 * Hook para obtener última edición disponible
 */
export function useLatestEdition(competitionId: string | null) {
  const [edition, setEdition] = useState<Edition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatest = useCallback(async () => {
    if (!competitionId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await editionsService.getLatestEdition(competitionId);
      setEdition(data);
    } catch (err: any) {
      setError(err.message || 'Error loading latest edition');
      console.error('Error fetching latest edition:', err);
    } finally {
      setLoading(false);
    }
  }, [competitionId]);

  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

  return {
    edition,
    loading,
    error,
    refetch: fetchLatest,
  };
}
