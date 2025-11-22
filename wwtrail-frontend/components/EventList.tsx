// components/EventList.tsx - VERSIÓN MEJORADA CON FILTRO DE MES
// ✅ FIX: Búsqueda no pierde foco (debounce)
// ✅ FIX: Filtro de mes (typicalMonth) en lugar de status
// ✅ FIX: Country y Featured funcionando correctamente

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ============================================================================
// ✅ IMPORTS CORREGIDOS - Usando default exports
// ============================================================================
import EventCard from './EventCard';
import EventFilters from './EventFilters';

// ============================================================================
// 📦 TIPOS
// ============================================================================

export interface EventFilters {
  search: string;
  country: string;
  city: string;  // Filtro de ciudad
  month: string;  // ✅ CAMBIO: "month" en lugar de "status"
  featured: boolean | null;
}

interface EventListProps {
  initialPage?: number;
  initialLimit?: number;
  showFilters?: boolean;
  viewMode?: 'grid' | 'list';
  featuredOnly?: boolean;
  limit?: number;
  simplified?: boolean;  // Para modo simplificado (solo imagen + logo)
}

// ============================================================================
// 🎨 COMPONENTE PRINCIPAL
// ============================================================================

export function EventList({
  initialPage = 1,
  initialLimit = 12,
  showFilters = true,
  viewMode = 'grid',
  featuredOnly = false,
  limit: customLimit,
  simplified = false
}: EventListProps) {
  const [page, setPage] = useState(initialPage);
  const [limitState] = useState(customLimit || initialLimit);
  
  // ✅ SOLUCIÓN: Separar searchQuery (input) de filters (API query)
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    country: '',
    city: '',  // Filtro de ciudad
    month: '',  // ✅ CAMBIO: month en lugar de status
    featured: featuredOnly ? true : null,
  });

  // ✅ DEBOUNCE: Esperar 1000ms antes de actualizar filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchQuery }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ============================================================================
  // ✅ FIX: Build query params
  // ============================================================================
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};

    // ✅ CRÍTICO: Si featuredOnly, SOLO paginación y highlighted
    if (featuredOnly) {
      params.page = '1';
      params.limit = limitState.toString();
      params.featured = 'true';
      return params;
    }

    // Para lista normal, agregar todos los filtros
    params.page = page.toString();
    params.limit = limitState.toString();

    if (filters.search) params.search = filters.search;
    if (filters.country) params.country = filters.country;
    if (filters.city) params.city = filters.city;  // Filtro de ciudad
    if (filters.month) params.typicalMonth = filters.month;  // ✅ CAMBIO: usar typicalMonth
    if (filters.featured !== null) {
      params.featured = filters.featured.toString();
    }

    // Debug: Log params to console
    console.log('🔍 EventList queryParams:', params);
    console.log('🔍 filters.city:', filters.city);

    return params;
  }, [page, limitState, filters, featuredOnly]);

  const { events, pagination, loading, error } = useEvents(queryParams);

  // Reset to page 1 when filters change (pero NO para featuredOnly)
  useEffect(() => {
    if (!featuredOnly) {
      setPage(1);
    }
  }, [filters, featuredOnly]);

  // ============================================================================
  // 🎛️ HANDLERS
  // ============================================================================

  // ✅ SOLUCIÓN: No actualizar filters inmediatamente, solo searchQuery
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // ✅ CAMBIO: Handler para mes en lugar de status
  const handleFilterMonth = useCallback((month: string) => {
    setFilters(prev => ({ ...prev, month: month === 'ALL' ? '' : month }));
  }, []);

  const handleFilterCountry = useCallback((country: string) => {
    setFilters(prev => ({ ...prev, country, city: '' }));  // Limpiar ciudad al cambiar país
  }, []);

  const handleFilterCity = useCallback((city: string) => {
    console.log('🏙️ handleFilterCity called with:', city);
    setFilters(prev => ({ ...prev, city }));
  }, []);

  const handleFilterHighlighted = useCallback((highlighted: boolean | null) => {
    setFilters(prev => ({ ...prev, featured: highlighted }));
  }, []);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (pagination && page < pagination.pages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (pageNum: number) => {
    setPage(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!pagination) return [];
    
    const { pages } = pagination;
    const pageNumbers: (number | string)[] = [];
    const maxVisible = 7;

    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(pages);
      } else if (page >= pages - 3) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = pages - 4; i <= pages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = page - 1; i <= page + 1; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(pages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* 🔍 FILTROS */}
      {/* ============================================================ */}
      {showFilters && (
        <EventFilters
          searchValue={searchQuery}  // ✅ Pasar searchQuery en lugar de filters.search
          onSearch={handleSearch}
          onFilterMonth={handleFilterMonth}  // ✅ CAMBIO: onFilterMonth en lugar de onFilterStatus
          onFilterCountry={handleFilterCountry}
          onFilterCity={handleFilterCity}  // Nuevo handler de ciudad
          selectedCountry={filters.country}  // Pasar país seleccionado para filtrar ciudades
          selectedCity={filters.city}  // Pasar ciudad seleccionada
          onFilterHighlighted={handleFilterHighlighted}
          showCountryFilter={true}
          showCityFilter={true}  // Nuevo filtro de ciudad
          showOrganizerFilter={false}
          showHighlightedFilter={!featuredOnly}
          isLoading={loading}
        />
      )}

      {/* ============================================================ */}
      {/* 📊 CONTADOR DE RESULTADOS */}
      {/* ============================================================ */}
      {pagination && !loading && !featuredOnly && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{events?.length || 0}</span> of{' '}
            <span className="font-medium">{pagination.total}</span> events
          </p>
          {pagination.pages > 1 && (
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.pages}
            </p>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* ⚠ ERROR STATE */}
      {/* ============================================================ */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">Error loading events: {error}</p>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🎴 GRID/LIST DE EVENTOS */}
      {/* ============================================================ */}
      <div
        className={
          viewMode === 'grid'
            ? featuredOnly
              ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
        }
      >
        {loading && events.length === 0 ? (
          // Loading skeleton
          Array.from({ length: limitState }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-lg"></div>
              <div className="bg-white p-4 rounded-b-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : events && events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              showStats={!simplified}
              managementMode={false}
              simplified={simplified}
            />
          ))
        ) : (
          // Empty state
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              {filters.search || filters.country || filters.month
                ? 'No events match your filters'
                : 'No events found'}
            </p>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 📄 PAGINACIÓN - NO mostrar si featuredOnly */}
      {/* ============================================================ */}
      {pagination && pagination.pages > 1 && !loading && !featuredOnly && (
        <div className="flex items-center justify-center gap-2">
          {/* Previous button */}
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              );
            }

            const isActive = pageNum === page;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageClick(pageNum as number)}
                className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                }`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next button */}
          <button
            onClick={handleNextPage}
            disabled={page === pagination.pages}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 🎨 COMPONENTE SIMPLE (sin paginación)
// ============================================================================

interface EventListSimpleProps {
  limit?: number;
  type?: string;
  country?: string;
  featured?: boolean;
  month?: number;  // ✅ NUEVO: Filtro por mes
}

export function EventListSimple({ 
  limit = 6, 
  type, 
  country, 
  featured,
  month  // ✅ NUEVO
}: EventListSimpleProps) {
  const params: Record<string, string> = {
    limit: limit.toString(),
  };

  if (type) params.type = type;
  if (country) params.country = country;
  if (featured) params.featured = 'true';
  if (month) params.typicalMonth = month.toString();  // ✅ NUEVO

  const { events, loading, error } = useEvents(params);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">Error loading events: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-lg"></div>
            <div className="bg-white p-4 rounded-b-lg">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))
      ) : events && events.length > 0 ? (
        events.map((event) => (
          <EventCard 
            key={event.id} 
            event={event}
            showStats={true}
            managementMode={false}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No events found</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 📝 NOTAS DE CAMBIOS CRÍTICOS
// ============================================================================
/*
✅ FIXES APLICADOS:

1. BÚSQUEDA NO PIERDE FOCO:
   - Separado searchQuery (estado del input) de filters.search (query API)
   - Debounce de 500ms antes de actualizar filters
   - useCallback en handlers para evitar re-renders innecesarios
   - searchValue pasado a EventFilters como prop controlada

2. FILTRO DE MES (typicalMonth):
   - Cambio de "status" a "month" en interface EventFilters
   - Handler handleFilterMonth en lugar de handleFilterStatus
   - Mapeo a "typicalMonth" en queryParams
   - Prop onFilterMonth en EventFilters

3. COUNTRY Y FEATURED:
   - Ya funcionaban correctamente
   - Mantenidos sin cambios

RESULTADO:
- ✅ Búsqueda mantiene el foco mientras escribes
- ✅ Filtro por mes del evento (Enero-Diciembre)
- ✅ Country filter funciona perfectamente
- ✅ Featured filter funciona perfectamente
- ✅ Performance mejorado con useCallback
*/
