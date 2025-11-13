// components/UserStatsCards.tsx

'use client';

import { useUserStats } from '@/hooks/useUserCompetitions';
import { TrendingUp, Mountain, Award, Heart } from 'lucide-react';

export function UserStatsCards() {
  const { stats, loading } = useUserStats();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { completedStats } = stats;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Estadísticas</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Carreras Completadas */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-2">
            <Award className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">
            {completedStats.totalCompleted}
          </div>
          <div className="text-sm text-gray-600 mt-1">Carreras</div>
        </div>

        {/* Kilómetros Totales */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">
            {completedStats.totalKm.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 mt-1">KM</div>
        </div>

        {/* Desnivel Acumulado */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-2">
            <Mountain className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">
            {completedStats.totalElevation.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">Desnivel+</div>
        </div>

        {/* Favoritos (total de competiciones marcadas) */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-2">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">
            {stats.totalCompetitions}
          </div>
          <div className="text-sm text-gray-600 mt-1">Favoritos</div>
        </div>
      </div>

      {/* Información adicional */}
      {completedStats.averageTime && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tiempo promedio</p>
              <p className="text-xl font-semibold text-green-600">
                {completedStats.averageTime}
              </p>
            </div>
            {completedStats.fastestRace && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Carrera más rápida</p>
                <p className="text-sm font-medium">{completedStats.fastestRace.name}</p>
                <p className="text-lg font-semibold text-green-600">
                  {completedStats.fastestRace.time}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500 text-center">
        Las estadísticas se actualizan cuando participas en carreras
      </p>
    </div>
  );
}
