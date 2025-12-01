'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import specialSeriesService from '@/lib/api/v2/specialSeries.service';
import { competitionsService } from '@/lib/api';
import { SpecialSeries } from '@/types/v2';
import { ArrowLeft, Globe, Instagram, Facebook, Twitter, Youtube, Trophy, Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CompetitionGrid } from '@/components/CompetitionGrid';
import { CompetitionGridSkeleton } from '@/components/CompetitionSkeleton';

interface FilterState {
  search: string;
  type: string;
  country: string;
  sortBy: string;
  minDistance: string;
  maxDistance: string;
  minElevation: string;
  maxElevation: string;
}

const COMPETITION_TYPES = [
  { value: '', label: 'Todos los tipos' },
  { value: 'TRAIL', label: 'Trail' },
  { value: 'ULTRA', label: 'Ultra' },
  { value: 'VERTICAL', label: 'Vertical' },
  { value: 'SKYRUNNING', label: 'Skyrunning' },
  { value: 'CANICROSS', label: 'Canicross' },
  { value: 'OTHER', label: 'Otros' },
];

const COUNTRIES = [
  { value: '', label: 'Todos los países' },
  { value: 'ES', label: 'España' },
  { value: 'FR', label: 'Francia' },
  { value: 'IT', label: 'Italia' },
  { value: 'PT', label: 'Portugal' },
  { value: 'CH', label: 'Suiza' },
];

const SORT_OPTIONS = [
  { value: 'startDate', label: 'Fecha (próximas primero)' },
  { value: 'name', label: 'Nombre (A-Z)' },
  { value: 'distance', label: 'Distancia' },
];

export default function SpecialSeriesDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const slug = params.slug as string;

  // Special series data
  const [specialSeries, setSpecialSeries] = useState<SpecialSeries | null>(null);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const [seriesError, setSeriesError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  // Competitions data
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loadingCompetitions, setLoadingCompetitions] = useState(true);
  const [competitionsError, setCompetitionsError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: '',
    country: '',
    sortBy: 'startDate',
    minDistance: '',
    maxDistance: '',
    minElevation: '',
    maxElevation: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Load special series info
  useEffect(() => {
    if (slug) {
      loadSpecialSeries();
    }
  }, [slug, locale]);

  // Load competitions when series is loaded or filters change
  useEffect(() => {
    if (specialSeries?.id) {
      loadCompetitions();
    }
  }, [specialSeries?.id, filters, locale]);

  const loadSpecialSeries = async () => {
    try {
      setLoadingSeries(true);
      setSeriesError(null);
      const series = await specialSeriesService.getBySlug(slug);

      // Apply translations if available
      const translation = (series as any).translations?.find((t: any) => t.language === locale?.toUpperCase());
      if (translation) {
        series.name = translation.name || series.name;
        series.description = translation.description || series.description;
      }

      setSpecialSeries(series);
    } catch (err: any) {
      console.error('Error loading special series:', err);
      setSeriesError(err.message || 'Error al cargar la special series');
    } finally {
      setLoadingSeries(false);
    }
  };

  const loadCompetitions = async () => {
    if (!specialSeries?.id) return;

    try {
      setLoadingCompetitions(true);
      setCompetitionsError(null);

      const params: any = {
        limit: 100,
        sortBy: filters.sortBy,
        language: locale,
        specialSeriesId: specialSeries.id, // Always filter by this series
      };

      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;
      if (filters.country) params.country = filters.country;
      if (filters.minDistance) params.minDistance = filters.minDistance;
      if (filters.maxDistance) params.maxDistance = filters.maxDistance;
      if (filters.minElevation) params.minElevation = filters.minElevation;
      if (filters.maxElevation) params.maxElevation = filters.maxElevation;

      const response = await competitionsService.getAll(params);
      setCompetitions(response.data || []);
    } catch (err: any) {
      console.error('Error loading competitions:', err);
      setCompetitionsError(err.message || 'Error al cargar las competiciones');
    } finally {
      setLoadingCompetitions(false);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
    });
  };

  const hasActiveFilters = filters.search || filters.type || filters.country ||
    filters.sortBy !== 'startDate' || filters.minDistance || filters.maxDistance ||
    filters.minElevation || filters.maxElevation;

  // Loading State
  if (loadingSeries) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-black text-white py-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48 bg-gray-700 rounded-lg"></div>
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-gray-700 rounded w-32"></div>
                <div className="h-12 bg-gray-700 rounded w-3/4"></div>
                <div className="h-6 bg-gray-700 rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (seriesError || !specialSeries) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{seriesError || 'Special Series no encontrada'}</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Logo */}
            <div className="w-40 h-40 flex items-center justify-center bg-white rounded-lg p-4 flex-shrink-0">
              {specialSeries.logoUrl && !logoError ? (
                <div className="relative w-full h-full">
                  <Image
                    src={specialSeries.logoUrl}
                    alt={specialSeries.name}
                    fill
                    className="object-contain"
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <Trophy className="h-20 w-20 text-gray-300" />
              )}
            </div>

            {/* Title and Info */}
            <div className="flex-1 text-center md:text-left">
              <Link
                href="/special-series"
                className="inline-flex items-center text-white/80 hover:text-white mb-3 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Special Series
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{specialSeries.name}</h1>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                {specialSeries.country && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>{specialSeries.country}</span>
                  </div>
                )}
                {specialSeries._count?.competitions !== undefined && (
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    <span>
                      {specialSeries._count.competitions} competicion{specialSeries._count.competitions !== 1 ? 'es' : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Social Links - inline */}
              {(specialSeries.website || specialSeries.instagramUrl || specialSeries.facebookUrl) && (
                <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                  {specialSeries.website && (
                    <a
                      href={specialSeries.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-sm"
                    >
                      <Globe className="h-4 w-4" />
                      Web
                    </a>
                  )}
                  {specialSeries.instagramUrl && (
                    <a
                      href={specialSeries.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-sm"
                    >
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </a>
                  )}
                  {specialSeries.facebookUrl && (
                    <a
                      href={specialSeries.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-sm"
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </a>
                  )}
                  {specialSeries.twitterUrl && (
                    <a
                      href={specialSeries.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-sm"
                    >
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </a>
                  )}
                  {specialSeries.youtubeUrl && (
                    <a
                      href={specialSeries.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-sm"
                    >
                      <Youtube className="h-4 w-4" />
                      YouTube
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Description */}
        {specialSeries.description && (
          <div className="bg-white rounded-lg border p-6 mb-8">
            <h2 className="text-xl font-bold mb-3">Sobre la Serie</h2>
            <p className="text-muted-foreground whitespace-pre-line">{specialSeries.description}</p>
          </div>
        )}

        {/* Competitions Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Competiciones</h2>

          {/* Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar competiciones..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
                {hasActiveFilters && (
                  <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="bg-white border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Filtros Avanzados</h3>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetFilters}
                      className="text-muted-foreground"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Limpiar
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Type Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Competición</Label>
                    <select
                      id="type"
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {COMPETITION_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Country Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <select
                      id="country"
                      value={filters.country}
                      onChange={(e) => handleFilterChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="sortBy">Ordenar por</Label>
                    <select
                      id="sortBy"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Second row: Distance and Elevation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Distance Range */}
                  <div className="space-y-2">
                    <Label>Distancia (km)</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        placeholder="Desde"
                        value={filters.minDistance}
                        onChange={(e) => handleFilterChange('minDistance', e.target.value)}
                        min="0"
                        className="w-full"
                      />
                      <span className="text-muted-foreground">-</span>
                      <Input
                        type="number"
                        placeholder="Hasta"
                        value={filters.maxDistance}
                        onChange={(e) => handleFilterChange('maxDistance', e.target.value)}
                        min="0"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Elevation Range */}
                  <div className="space-y-2">
                    <Label>Desnivel (m)</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        placeholder="Desde"
                        value={filters.minElevation}
                        onChange={(e) => handleFilterChange('minElevation', e.target.value)}
                        min="0"
                        className="w-full"
                      />
                      <span className="text-muted-foreground">-</span>
                      <Input
                        type="number"
                        placeholder="Hasta"
                        value={filters.maxElevation}
                        onChange={(e) => handleFilterChange('maxElevation', e.target.value)}
                        min="0"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Competitions Error */}
          {competitionsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{competitionsError}</p>
              <button
                onClick={loadCompetitions}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Competitions Loading */}
          {loadingCompetitions && <CompetitionGridSkeleton count={8} />}

          {/* Competitions Grid */}
          {!loadingCompetitions && !competitionsError && (
            <>
              <p className="text-muted-foreground">
                {competitions.length} {competitions.length === 1 ? 'competición encontrada' : 'competiciones encontradas'}
              </p>
              <CompetitionGrid
                competitions={competitions}
                emptyMessage="No se encontraron competiciones con estos filtros."
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
