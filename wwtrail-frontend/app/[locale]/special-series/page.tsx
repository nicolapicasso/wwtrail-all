'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import specialSeriesService from '@/lib/api/v2/specialSeries.service';
import { SpecialSeriesGrid } from '@/components/SpecialSeriesGrid';
import { SpecialSeriesListItem } from '@/types/v2';

export default function SpecialSeriesPage() {
  const [specialSeries, setSpecialSeries] = useState<SpecialSeriesListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadSpecialSeries();
  }, [search]);

  const loadSpecialSeries = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        limit: 50,
        sortBy: 'name',
        sortOrder: 'asc',
      };

      if (search) params.search = search;

      const response = await specialSeriesService.getAll(params);
      setSpecialSeries(response.data || []);
    } catch (err: any) {
      console.error('Error loading special series:', err);
      setError(err.message || 'Error al cargar las special series');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <div className="container mx-auto px-4 mb-8">
        <h1 className="text-4xl font-bold mb-2">Special Series</h1>
        <p className="text-muted-foreground">
          Descubre los circuitos y series especiales de trail running
        </p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">❌ {error}</p>
            <button
              onClick={loadSpecialSeries}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Success State */}
        {!loading && !error && (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              {specialSeries.length} special series encontradas
            </div>
            <SpecialSeriesGrid
              specialSeries={specialSeries}
              emptyMessage="No se encontraron special series"
            />
          </>
        )}
      </div>
    </div>
  );
}
