// app/organizers/page.tsx
// Listado público de organizadores

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Building2, Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { organizersService } from '@/lib/api/v2';
import { OrganizerListItem } from '@/types/v2';
import CountrySelect from '@/components/CountrySelect';
import { Link } from '@/i18n/navigation';

export default function OrganizersPublicPage() {
  // State
  const [organizers, setOrganizers] = useState<OrganizerListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [page, setPage] = useState(1);

  // Pagination
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  /**
   * Fetch organizers
   */
  const fetchOrganizers = useCallback(async () => {
    try {
      setIsLoading(true);

      const filters = {
        page,
        limit: 12,
        search: searchQuery || undefined,
        status: 'PUBLISHED' as const, // Solo mostrar publicados
        country: countryFilter || undefined,
      };

      const response = await organizersService.getAll(filters);

      setOrganizers(response.data || []);
      setTotalPages(response.pagination?.totalPages || response.pagination?.pages || 1);
      setTotal(response.pagination?.total || 0);
    } catch (error: any) {
      console.error('Error fetching organizers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, countryFilter]);

  /**
   * Initial load
   */
  useEffect(() => {
    fetchOrganizers();
  }, [fetchOrganizers]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (page >= totalPages - 3) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = page - 1; i <= page + 1; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handlePageClick = (pageNum: number) => {
    setPage(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-content px-6 py-12 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-6 flex items-center gap-2">
          <Building2 className="h-7 w-7 text-green-brand" />
          <h1 className="text-[36px] font-black tracking-[-0.02em] text-ink-2">Organizadores</h1>
        </div>
        <p className="text-[15px] text-text-muted">
          Descubre las entidades y clubes que organizan eventos de trail running
          {total > 0 && (
            <> · <span className="font-semibold text-ink-2">{total}</span></>
          )}
        </p>

        {/* Filters */}
        <div className="mt-6 rounded-lg border border-border bg-surface p-4 shadow-card">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-faint" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="Nombre del organizador..."
                className="w-full rounded-md border border-border py-2 pl-10 pr-4 text-[15px] outline-none placeholder:text-placeholder focus:border-green-brand focus:ring-2 focus:ring-green-brand/30"
              />
            </div>
            <CountrySelect
              value={countryFilter}
              onChange={(code) => { setCountryFilter(code); setPage(1); }}
              placeholder="Todos los países"
            />
          </div>
          {(searchQuery || countryFilter) && (
            <div className="mt-4 border-t border-hairline pt-4">
              <button
                onClick={() => { setSearchQuery(''); setCountryFilter(''); setPage(1); }}
                className="text-[14px] font-semibold text-green-brand hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-green-brand" />
          </div>
        )}

        {/* Grid */}
        {!isLoading && (
          <>
            {organizers.length === 0 ? (
              <div className="mt-8 rounded-lg border border-border bg-surface p-12 text-center">
                <Building2 className="mx-auto mb-4 h-14 w-14 text-text-faint/50" />
                <h3 className="mb-2 text-[18px] font-extrabold text-ink-2">
                  No se encontraron organizadores
                </h3>
                <p className="text-[15px] text-text-muted">
                  {searchQuery || countryFilter
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'No hay organizadores disponibles en este momento'}
                </p>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {organizers.map((org) => (
                  <Link
                    key={org.id}
                    href={`/organizers/${org.slug}`}
                    className="group flex items-center gap-4 rounded-lg border border-border bg-surface p-5 shadow-card transition-shadow hover:shadow-floating"
                  >
                    {/* Square avatar (logo or initials over derived color) */}
                    {org.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={org.logoUrl}
                        alt={org.name}
                        className="h-16 w-16 shrink-0 rounded-md border border-border object-cover"
                      />
                    ) : (
                      <span
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md font-stat text-[24px] font-bold text-white"
                        style={{ backgroundColor: orgColor(org.slug || org.name) }}
                      >
                        {orgInitials(org.name)}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[17px] font-extrabold text-ink-2 group-hover:text-green-brand">
                        {org.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5 text-[13px] text-text-muted">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{org.country}</span>
                        {org._count && (
                          <>
                            <span className="text-text-faint">·</span>
                            <span>{org._count.events} eventos</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-surface text-ink-2 transition-colors hover:border-green-brand disabled:pointer-events-none disabled:opacity-40"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {getPageNumbers().map((pageNum, index) => {
                  if (pageNum === '...') {
                    return <span key={`ellipsis-${index}`} className="px-1 text-text-faint">…</span>;
                  }
                  const isActive = pageNum === page;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageClick(pageNum as number)}
                      className={`flex h-10 w-10 items-center justify-center rounded-sm border font-stat text-[14px] font-bold transition-colors ${
                        isActive
                          ? 'border-green-brand bg-green-brand text-white'
                          : 'border-border bg-surface text-ink-2 hover:border-green-brand'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-surface text-ink-2 transition-colors hover:border-green-brand disabled:pointer-events-none disabled:opacity-40"
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Deterministic avatar color + initials for organizers without a logo.
const ORG_COLORS = ['#1f7a4d', '#173f6e', '#8a4b1f', '#5b3b8c', '#0f6e6e', '#a13a3a'];
function orgColor(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return ORG_COLORS[h % ORG_COLORS.length];
}
function orgInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
