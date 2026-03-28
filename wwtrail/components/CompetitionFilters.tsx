'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { specialSeriesService } from '@/lib/api/catalogs.service';
import type { SpecialSeries } from '@/types/catalog';

interface CompetitionFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export interface FilterState {
  search: string;
  type: string;
  country: string;
  sortBy: string;
  minDistance: string;
  maxDistance: string;
  minElevation: string;
  maxElevation: string;
  specialSeriesId: string;
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
  { value: 'viewCount', label: 'Popularidad' },
];

export function CompetitionFilters({ onFilterChange, onReset }: CompetitionFiltersProps) {
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
  const [showFilters, setShowFilters] = useState(true);
  const [specialSeriesList, setSpecialSeriesList] = useState<SpecialSeries[]>([]);

  // Load special series on mount
  useEffect(() => {
    const loadSpecialSeries = async () => {
      try {
        const series = await specialSeriesService.getAll(true); // Only active
        setSpecialSeriesList(series);
      } catch (error) {
        console.error('Error loading special series:', error);
      }
    };
    loadSpecialSeries();
  }, []);

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      type: '',
      country: '',
      sortBy: 'startDate',
      minDistance: '',
      maxDistance: '',
      minElevation: '',
      maxElevation: '',
      specialSeriesId: '',
    };
    setFilters(resetFilters);
    onReset();
  };

  const hasActiveFilters = filters.search || filters.type || filters.country || filters.sortBy !== 'startDate' ||
    filters.minDistance || filters.maxDistance || filters.minElevation || filters.maxElevation || filters.specialSeriesId;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar competiciones..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
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
        <div className="bg-card border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Filtros Avanzados</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
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

          {/* Second row: Distance and Elevation filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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

            {/* Special Series Filter */}
            <div className="space-y-2">
              <Label htmlFor="specialSeries">Special Series</Label>
              <select
                id="specialSeries"
                value={filters.specialSeriesId}
                onChange={(e) => handleFilterChange('specialSeriesId', e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Todas las series</option>
                {specialSeriesList.map((series) => (
                  <option key={series.id} value={series.id}>
                    {series.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
