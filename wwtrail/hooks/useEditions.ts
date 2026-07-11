/**
 * 🔧 useEditions.ts - Hooks para gestión de ediciones
 * ====================================================
 */

'use client';

import { useState, useEffect } from 'react';
import { apiClientV2 } from '@/lib/api/client';
import type { Edition } from '@/types/edition';

// ============================================================================
// 🪝 HOOK: Años disponibles de una competición
// ============================================================================

export function useAvailableYears(competitionId: string) {
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!competitionId) {
      setYears([]);
      setLoading(false);
      return;
    }

    const fetchYears = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await apiClientV2.get(`/competitions/${competitionId}/editions`);
        
        // Extraer años únicos y ordenar
        const uniqueYears = [...new Set<number>(data.data.map((edition: Edition) => edition.year))];
        setYears(uniqueYears.sort((a, b) => b - a)); // Descendente (más reciente primero)
      } catch (err) {
        console.error('Error fetching available years:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch years');
        setYears([]);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, [competitionId]);

  return { years, loading: loading as boolean, error };
}

// ============================================================================
// 🪝 HOOK: Obtener edición por año
// ============================================================================

export function useEditionByYear(competitionId: string, year: number | null) {
  const [edition, setEdition] = useState<Edition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!competitionId || !year) {
      setEdition(null);
      setLoading(false);
      return;
    }

    const fetchEdition = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await apiClientV2.get(`/competitions/${competitionId}/editions`);
        
        // Buscar la edición del año específico
        const foundEdition = data.data.find((ed: Edition) => ed.year === year);
        
        setEdition(foundEdition || null);
      } catch (err) {
        console.error('Error fetching edition by year:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch edition');
        setEdition(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEdition();
  }, [competitionId, year]);

  return { edition, loading: loading as boolean, error };
}

// ============================================================================
// 🪝 HOOK: Todas las ediciones de una competición
// ============================================================================

export function useEditions(competitionId: string) {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!competitionId) {
      setEditions([]);
      setLoading(false);
      return;
    }

    const fetchEditions = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await apiClientV2.get(`/competitions/${competitionId}/editions`);
        setEditions(data.data || []);
      } catch (err) {
        console.error('Error fetching editions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch editions');
        setEditions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEditions();
  }, [competitionId]);

  return { editions, loading, error };
}

// ============================================================================
// 📝 NOTAS DE USO
// ============================================================================
/*
EJEMPLOS DE USO:

1. Obtener años disponibles:
   const { years, loading } = useAvailableYears(competitionId);

2. Obtener edición de un año específico:
   const { edition, loading } = useEditionByYear(competitionId, 2024);

3. Obtener todas las ediciones:
   const { editions, loading } = useEditions(competitionId);
*/