// components/EventList.tsx - VERSIÓN MEJORADA CON FILTRO DE MES
// ✅ FIX: Búsqueda no pierde foco (debounce)
// ✅ FIX: Filtro de mes (typicalMonth) en lugar de status
// ✅ FIX: Country y Featured funcionando correctamente

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { ChevronLeft, ChevronRight, LayoutGrid, Rows3 } from 'lucide-react';
import { cn } from '@/lib/utils';

import { PublicEventCard } from './public/EventCard';
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
  language?: string;  // ✅ NUEVO: Idioma para traducciones
}

interface EventListProps {
  initialPage?: number;
  initialLimit?: number;
  showFilters?: boolean;
  viewMode?: 'grid' | 'list';
  featuredOnly?: boolean;
  limit?: number;
  simplified?: boolean;  // Para modo simplificado (solo imagen + logo)
  locale?: string;  // ✅ NUEVO: Idioma actual
  initialSearch?: string;  // ✅ Búsqueda inicial (p.ej. desde ?search= de la URL)
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
  simplified = false,
  locale = 'es',  // ✅ NUEVO: Default locale
  initialSearch = ''
}: EventListProps) {
  const [page, setPage] = useState(initialPage);
  const [limitState] = useState(customLimit || initialLimit);
  const [view, setView] = useState<'grid' | 'list'>(viewMode);

  // ✅ SOLUCIÓN: Separar searchQuery (input) de filters (API query)
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filters, setFilters] = useState<EventFilters>({
    search: initialSearch,
    country: '',
    city: '',  // Filtro de ciudad
    month: '',  // ✅ CAMBIO: month en lugar de status
    featured: featuredOnly ? true : null,
    language: locale,  // ✅ NUEVO: Pass locale to filters
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

    // ✅ ALWAYS include language
    if (filters.language) params.language = filters.language;

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
      {/* TOOLBAR: título + contador + segmented Grid/Lista */}
      {/* ============================================================ */}
      {!featuredOnly && (
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-black tracking-[-0.01em] text-ink-2">
              Todos los eventos
            </h2>
            {pagination && !loading && (
              <p className="mt-1 text-[13px] text-text-muted">
                Mostrando <span className="font-semibold text-ink-2">{events?.length || 0}</span> de{' '}
                <span className="font-semibold text-ink-2">{pagination.total}</span>
                {pagination.pages > 1 && (
                  <> · página {pagination.page} de {pagination.pages}</>
                )}
              </p>
            )}
          </div>

          {/* Segmented control */}
          <div className="flex rounded-md bg-[#e7e5dd] p-1">
            {([
              { key: 'grid', Icon: LayoutGrid, label: 'Grid' },
              { key: 'list', Icon: Rows3, label: 'Lista' },
            ] as const).map(({ key, Icon, label }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                aria-pressed={view === key}
                className={cn(
                  'flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-[13px] font-bold transition-colors',
                  view === key
                    ? 'bg-surface text-ink-2 shadow-card'
                    : 'text-text-muted hover:text-ink-2'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">Error al cargar eventos: {error}</p>
        </div>
      )}

      {/* GRID / LISTA */}
      <div
        className={
          view === 'grid'
            ? featuredOnly
              ? 'grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5'
              : 'grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'
            : 'flex flex-col gap-5'
        }
      >
        {loading && events.length === 0 ? (
          Array.from({ length: limitState }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-border bg-surface">
              <div className="h-[180px] animate-pulse bg-surface-alt" />
              <div className="space-y-2 p-[18px]">
                <div className="h-4 w-3/4 animate-pulse rounded bg-surface-alt" />
                <div className="h-12 animate-pulse rounded bg-surface-alt" />
              </div>
            </div>
          ))
        ) : events && events.length > 0 ? (
          events.map((event) => (
            <PublicEventCard key={event.id} event={event} viewMode={view} />
          ))
        ) : (
          <div className="col-span-full rounded-lg border border-border bg-surface py-16 text-center">
            <p className="text-[15px] text-text-muted">
              {filters.search || filters.country || filters.month
                ? 'Ningún evento coincide con los filtros'
                : 'No se encontraron eventos'}
            </p>
          </div>
        )}
      </div>

      {/* PAGINACIÓN */}
      {pagination && pagination.pages > 1 && !loading && !featuredOnly && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-surface text-ink-2 transition-colors hover:border-green-brand disabled:pointer-events-none disabled:opacity-40"
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {getPageNumbers().map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-1 text-text-faint">
                  …
                </span>
              );
            }
            const isActive = pageNum === page;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageClick(pageNum as number)}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-sm border text-[14px] font-stat font-bold transition-colors',
                  isActive
                    ? 'border-green-brand bg-green-brand text-white'
                    : 'border-border bg-surface text-ink-2 hover:border-green-brand'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={handleNextPage}
            disabled={page === pagination.pages}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-surface text-ink-2 transition-colors hover:border-green-brand disabled:pointer-events-none disabled:opacity-40"
            aria-label="Página siguiente"
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
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {loading ? (
        Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="h-[180px] animate-pulse bg-surface-alt" />
            <div className="space-y-2 p-[18px]">
              <div className="h-4 w-3/4 animate-pulse rounded bg-surface-alt" />
              <div className="h-12 animate-pulse rounded bg-surface-alt" />
            </div>
          </div>
        ))
      ) : events && events.length > 0 ? (
        events.map((event) => (
          <PublicEventCard key={event.id} event={event} />
        ))
      ) : (
        <div className="col-span-full rounded-lg border border-border bg-surface py-16 text-center">
          <p className="text-[15px] text-text-muted">No se encontraron eventos</p>
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
