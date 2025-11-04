'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';

export interface EventFilters {
  search: string;
  country: string;
  type: string;
  status: string;
  isHighlighted: boolean | null;
}

interface EventFiltersProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  loading?: boolean;
}

export function EventFiltersComponent({ filters, onFiltersChange, loading }: EventFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce: espera 800ms después de que el usuario deje de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ ...filters, search: searchInput });
      }
    }, 800); // 800ms de espera

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sincronizar si filters.search cambia externamente
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  const handleCountryChange = (value: string) => {
    onFiltersChange({ ...filters, country: value });
  };

  const handleTypeChange = (value: string) => {
    onFiltersChange({ ...filters, type: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value });
  };

  const handleHighlightedChange = (value: string) => {
    const highlighted = value === '' ? null : value === 'true';
    onFiltersChange({ ...filters, isHighlighted: highlighted });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    onFiltersChange({
      search: '',
      country: '',
      type: '',
      status: '',
      isHighlighted: null,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.country ||
    filters.type ||
    filters.status ||
    filters.isHighlighted !== null;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          disabled={loading}
          className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Toggle filters button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span>{isExpanded ? 'Hide' : 'Show'} Filters</span>
          {hasActiveFilters && !isExpanded && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
              •
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Country */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <select
              value={filters.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              disabled={loading}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Countries</option>
              <option value="ES">Spain</option>
              <option value="FR">France</option>
              <option value="IT">Italy</option>
              <option value="DE">Germany</option>
            </select>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              disabled={loading}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Types</option>
              <option value="TRAIL">Trail</option>
              <option value="ULTRA">Ultra</option>
              <option value="VERTICAL">Vertical</option>
              <option value="SKYRUNNING">Skyrunning</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={loading}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          {/* Featured */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Featured</label>
            <select
              value={
                filters.isHighlighted === null
                  ? ''
                  : filters.isHighlighted
                  ? 'true'
                  : 'false'
              }
              onChange={(e) => handleHighlightedChange(e.target.value)}
              disabled={loading}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Events</option>
              <option value="true">Featured Only</option>
              <option value="false">Regular Only</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}