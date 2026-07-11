// lib/api/user-competitions.service.ts

import apiClient from './client';
import {
  UserCompetition,
  UserStats,
  MarkCompetitionData,
  AddResultData,
  UpdateUserCompetitionData,
  RankingEntry,
  UserCompetitionStatus,
} from '@/types/user-competition';

/**
 * Marcar una competición (Me interesa / Me inscribí / etc.)
 */
export const markCompetition = async (
  competitionId: string,
  data: MarkCompetitionData
): Promise<UserCompetition> => {
  const response = await apiClient.post(
    `/me/competitions/${competitionId}/mark`,
    data
  );
  return response.data.data;
};

/**
 * Desmarcar una competición
 */
export const unmarkCompetition = async (
  competitionId: string
): Promise<void> => {
  await apiClient.delete(`/me/competitions/${competitionId}`);
};

/**
 * Añadir resultado personal a una competición
 */
export const addResult = async (
  competitionId: string,
  data: AddResultData
): Promise<UserCompetition> => {
  const response = await apiClient.post(
    `/me/competitions/${competitionId}/result`,
    data
  );
  return response.data.data;
};

/**
 * Obtener todas mis competiciones
 */
export const getMyCompetitions = async (
  status?: UserCompetitionStatus
): Promise<UserCompetition[]> => {
  const params = status ? { status } : {};
  const response = await apiClient.get('/me/competitions', { params });
  return response.data.data;
};

/**
 * Obtener una competición específica mía
 */
export const getMyCompetition = async (
  competitionId: string
): Promise<UserCompetition | null> => {
  try {
    const response = await apiClient.get(`/me/competitions/${competitionId}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Actualizar una competición mía
 */
export const updateMyCompetition = async (
  competitionId: string,
  data: UpdateUserCompetitionData
): Promise<UserCompetition> => {
  const response = await apiClient.put(
    `/me/competitions/${competitionId}`,
    data
  );
  return response.data.data;
};

/**
 * Obtener mis estadísticas personales
 */
export const getMyStats = async (): Promise<UserStats> => {
  const response = await apiClient.get('/me/stats');
  return response.data.data;
};

/**
 * Obtener rankings globales
 */
export const getGlobalRanking = async (
  type: 'competitions' | 'km' | 'elevation',
  limit = 20
): Promise<RankingEntry[]> => {
  const response = await apiClient.get(`/rankings/${type}`, {
    params: { limit },
  });
  return response.data.data;
};

/**
 * Ver competiciones de otro usuario (público)
 */
export const getUserCompetitions = async (
  userId: string,
  status?: UserCompetitionStatus
): Promise<UserCompetition[]> => {
  const params = status ? { status } : {};
  const response = await apiClient.get(`/users/${userId}/competitions`, {
    params,
  });
  return response.data.data;
};

/**
 * Ver estadísticas de otro usuario (público)
 */
export const getUserStats = async (userId: string): Promise<UserStats> => {
  const response = await apiClient.get(`/users/${userId}/stats`);
  return response.data.data;
};

// Export como objeto para facilitar imports
const userCompetitionsService = {
  markCompetition,
  unmarkCompetition,
  addResult,
  getMyCompetitions,
  getMyCompetition,
  updateMyCompetition,
  getMyStats,
  getGlobalRanking,
  getUserCompetitions,
  getUserStats,
};

export default userCompetitionsService;
