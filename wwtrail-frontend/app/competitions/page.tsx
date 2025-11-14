'use client';

import { useState, useEffect } from 'react';
import { competitionsService } from '@/lib/api';
import { CompetitionGrid } from '@/components/CompetitionGrid';
import { CompetitionGridSkeleton } from '@/components/CompetitionSkeleton';
import { CompetitionFilters, FilterState } from '@/components/CompetitionFilters';

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: '',
    country: '',
    sortBy: 'startDate',
  });

  useEffect(() => {
    loadCompetitions();
  }, [filters]);

  const loadCompetitions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query params
      const params: any = { 
        limit: 50,
        sortBy: filters.sortBy,
      };
      
      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;
      if (filters.country) params.country = filters.country;
      
      const response = await competitionsService.getAll(params);
      setCompetitions(response.competitions || []);
    } catch (err: any) {
      console.error('Error loading competitions:', err);
      setError(err.message || 'Error al cargar las competiciones');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: '',
      country: '',
      sortBy: 'startDate',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Competiciones de Trail Running</h1>
          <p className="text-lg opacity-90">
            Descubre las mejores carreras de montaña
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <CompetitionFilters 
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">❌ {error}</p>
            <button
              onClick={loadCompetitions}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && <CompetitionGridSkeleton count={12} />}

        {/* Success State */}
        {!loading && !error && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                {competitions.length} {competitions.length === 1 ? 'competición encontrada' : 'competiciones encontradas'}
              </p>
            </div>
            <CompetitionGrid 
              competitions={competitions}
              emptyMessage="No se encontraron competiciones con estos filtros. Prueba con otros criterios."
            />
          </>
        )}
      </div>
    </div>
  );
}
