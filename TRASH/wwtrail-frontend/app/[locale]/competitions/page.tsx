'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Star } from 'lucide-react';
import { competitionsService } from '@/lib/api';
import { CompetitionCard } from '@/components/CompetitionCard';
import { CompetitionGrid } from '@/components/CompetitionGrid';
import { CompetitionGridSkeleton } from '@/components/CompetitionSkeleton';
import { CompetitionFilters, FilterState } from '@/components/CompetitionFilters';

export default function CompetitionsPage() {
  const locale = useLocale();
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [featuredCompetitions, setFeaturedCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: '',
    country: '',
    sortBy: 'startDate',
    minDistance: '',
    maxDistance: '',
    minElevation: '',
    maxElevation: '',
    specialSeriesId: '',
  });

  // Load featured competitions on mount
  useEffect(() => {
    loadFeaturedCompetitions();
  }, [locale]);

  // Load all competitions when filters change
  useEffect(() => {
    loadCompetitions();
  }, [filters, locale]);

  const loadFeaturedCompetitions = async () => {
    try {
      setLoadingFeatured(true);
      const response = await competitionsService.getAll({
        limit: 10,
        isFeatured: true,
        language: locale,
      });
      setFeaturedCompetitions(response.data || []);
    } catch (err: any) {
      console.error('Error loading featured competitions:', err);
    } finally {
      setLoadingFeatured(false);
    }
  };

  const loadCompetitions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params: any = {
        limit: 50,
        sortBy: filters.sortBy,
        language: locale,
      };

      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;
      if (filters.country) params.country = filters.country;
      if (filters.minDistance) params.minDistance = filters.minDistance;
      if (filters.maxDistance) params.maxDistance = filters.maxDistance;
      if (filters.minElevation) params.minElevation = filters.minElevation;
      if (filters.maxElevation) params.maxElevation = filters.maxElevation;
      if (filters.specialSeriesId) params.specialSeriesId = filters.specialSeriesId;

      const response = await competitionsService.getAll(params);
      setCompetitions(response.data || []);
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
      minDistance: '',
      maxDistance: '',
      minElevation: '',
      maxElevation: '',
      specialSeriesId: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Competiciones de Trail Running</h1>
          <p className="text-muted-foreground">
            Descubre las mejores carreras de montaña
          </p>
        </div>

        {/* Featured Competitions Section */}
        {!loadingFeatured && featuredCompetitions.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Competiciones Destacadas</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {featuredCompetitions.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                  simplified={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Loading skeleton for featured */}
        {loadingFeatured && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Competiciones Destacadas</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Competitions Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Todas las Competiciones</h2>
          <p className="text-gray-600">Explora todas las carreras de trail running disponibles</p>
        </div>

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
            <p className="text-red-800">{error}</p>
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
