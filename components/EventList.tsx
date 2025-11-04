// components/EventList.tsx - List events with filters and pagination

'use client';

import { useState, useEffect, useMemo } from 'react'; // ← AGREGADO: useMemo
import { useEvents } from '@/hooks/useEvents';
import { EventsGrid } from './EventCard';
import { EventFiltersComponent, EventFilters as EventFiltersType } from './EventFilters';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EventListProps {
  initialPage?: number;
  initialLimit?: number;
  showFilters?: boolean;
}

export function EventList({ 
  initialPage = 1, 
  initialLimit = 12,
  showFilters = true 
}: EventListProps) {
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [filters, setFilters] = useState<EventFiltersType>({
    search: '',
    country: '',
    type: '',
    status: '',
    isHighlighted: null,
  });

  // Build query params from filters - MEMOIZADO para evitar re-renders
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };

    if (filters.search) params.search = filters.search;
    if (filters.country) params.country = filters.country;
    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    if (filters.isHighlighted !== null) {
      params.isHighlighted = filters.isHighlighted.toString();
    }

    return params;
  }, [page, limit, filters]); // ← Solo recalcula cuando cambian page, limit o filters

  const { events, pagination, loading, error } = useEvents(queryParams);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const handleFiltersChange = (newFilters: EventFiltersType) => {
    setFilters(newFilters);
  };

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
      // Show all pages
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show with ellipsis
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
      {/* Filters */}
      {showFilters && (
        <EventFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          loading={loading}
        />
      )}

      {/* Results count */}
      {pagination && !loading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{events.length}</span> of{' '}
            <span className="font-medium">{pagination.total}</span> events
          </p>
          {pagination.pages > 1 && (
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.pages}
            </p>
          )}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">Error loading events: {error}</p>
        </div>
      )}

      {/* Events grid */}
      <EventsGrid
        events={events}
        loading={loading}
        emptyMessage={
          filters.search || filters.country || filters.type
            ? 'No events match your filters'
            : 'No events found'
        }
      />

      {/* Pagination */}
      {pagination && pagination.pages > 1 && !loading && (
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

// Simple version without pagination for featured/limited lists
interface EventListSimpleProps {
  limit?: number;
  type?: string;
  country?: string;
  featured?: boolean;
}

export function EventListSimple({ 
  limit = 6, 
  type, 
  country, 
  featured 
}: EventListSimpleProps) {
  const params: Record<string, string> = {
    limit: limit.toString(),
  };

  if (type) params.type = type;
  if (country) params.country = country;
  if (featured) params.isHighlighted = 'true';

  const { events, loading, error } = useEvents(params);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">Error loading events: {error}</p>
      </div>
    );
  }

  return <EventsGrid events={events} loading={loading} />;
}
