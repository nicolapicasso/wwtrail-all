'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import specialSeriesService from '@/lib/api/v2/specialSeries.service';
import { SpecialSeriesGrid } from '@/components/SpecialSeriesGrid';
import { SpecialSeriesListItem } from '@/types/v2';

export default function SpecialSeriesPage() {
  const t = useTranslations('pgCatalog');
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
      setError(err.message || t('errorLoadingSpecialSeries'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-content px-6 py-12 sm:px-8 lg:px-10">
        {/* Header */}
        <h1 className="text-[36px] font-black tracking-[-0.02em] text-ink-2">Special Series</h1>
        <p className="mt-2 text-[15px] text-text-muted">
          {t('specialSeriesSubtitle')}
          {!loading && !error && (
            <> · <span className="font-semibold text-ink-2">{specialSeries.length}</span></>
          )}
        </p>

        {/* Search Bar */}
        <div className="mt-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-faint" />
            <input
              type="text"
              placeholder={t('searchByNamePlaceholder')}
              value={search}
              onChange={handleSearchChange}
              className="w-full rounded-md border border-border bg-surface py-2 pl-10 pr-4 text-[15px] outline-none placeholder:text-placeholder focus:border-green-brand focus:ring-2 focus:ring-green-brand/30"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-destructive">{error}</p>
            <button onClick={loadSpecialSeries} className="mt-2 text-[14px] font-semibold text-destructive underline">
              {t('retry')}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-border bg-surface">
                <div className="h-32 animate-pulse bg-surface-alt" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-surface-alt" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-surface-alt" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Success State */}
        {!loading && !error && (
          <div className="mt-8">
            <SpecialSeriesGrid
              specialSeries={specialSeries}
              emptyMessage={t('noSpecialSeriesFound')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
