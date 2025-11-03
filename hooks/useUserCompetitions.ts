// hooks/useUserCompetitions.ts

'use client';

import { useState, useEffect } from 'react';
import {
  UserCompetition,
  UserStats,
  UserCompetitionStatus,
  MarkCompetitionData,
  AddResultData,
} from '@/types/user-competition';
import userCompetitionsService from '@/lib/api/user-competitions.service';
import { useAuth } from '@/contexts/AuthContext';

export function useUserCompetitions(status?: UserCompetitionStatus) {
  // Safely get user - might be null if not in AuthProvider
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (e) {
    // Not in AuthProvider, user will be null
  }

  const [competitions, setCompetitions] = useState<UserCompetition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetitions = async () => {
    if (!user) {
      setCompetitions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await userCompetitionsService.getMyCompetitions(status);
      setCompetitions(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar competiciones');
      console.error('Error fetching user competitions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, [user, status]);

  const markCompetition = async (
    competitionId: string,
    data: MarkCompetitionData
  ) => {
    try {
      const updated = await userCompetitionsService.markCompetition(
        competitionId,
        data
      );
      
      // Actualizar lista local
      const exists = competitions.find(c => c.competitionId === competitionId);
      if (exists) {
        setCompetitions(prev =>
          prev.map(c => (c.competitionId === competitionId ? updated : c))
        );
      } else {
        setCompetitions(prev => [...prev, updated]);
      }

      return updated;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al marcar competición');
    }
  };

  const unmarkCompetition = async (competitionId: string) => {
    try {
      await userCompetitionsService.unmarkCompetition(competitionId);
      
      // Eliminar de lista local
      setCompetitions(prev =>
        prev.filter(c => c.competitionId !== competitionId)
      );
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al desmarcar competición');
    }
  };

  const addResult = async (competitionId: string, data: AddResultData) => {
    try {
      const updated = await userCompetitionsService.addResult(
        competitionId,
        data
      );
      
      // Actualizar lista local
      const exists = competitions.find(c => c.competitionId === competitionId);
      if (exists) {
        setCompetitions(prev =>
          prev.map(c => (c.competitionId === competitionId ? updated : c))
        );
      } else {
        setCompetitions(prev => [...prev, updated]);
      }

      return updated;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al añadir resultado');
    }
  };

  const refresh = () => {
    fetchCompetitions();
  };

  return {
    competitions,
    loading,
    error,
    markCompetition,
    unmarkCompetition,
    addResult,
    refresh,
  };
}

export function useUserStats() {
  // Safely get user - might be null if not in AuthProvider
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (e) {
    // Not in AuthProvider, user will be null
  }

  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!user) {
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await userCompetitionsService.getMyStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar estadísticas');
      console.error('Error fetching user stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const refresh = () => {
    fetchStats();
  };

  return {
    stats,
    loading,
    error,
    refresh,
  };
}

export function useCompetitionStatus(competitionId: string) {
  // Safely get user - might be null if not in AuthProvider
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (e) {
    // Not in AuthProvider, user will be null
  }

  const [userCompetition, setUserCompetition] = useState<UserCompetition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    if (!user || !competitionId) {
      setUserCompetition(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await userCompetitionsService.getMyCompetition(competitionId);
      setUserCompetition(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar estado');
      console.error('Error fetching competition status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [user, competitionId]);

  const refresh = () => {
    fetchStatus();
  };

  return {
    userCompetition,
    isMarked: !!userCompetition,
    status: userCompetition?.status,
    loading,
    error,
    refresh,
  };
}
