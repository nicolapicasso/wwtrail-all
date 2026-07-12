// app/[locale]/events/page.tsx — Events listing (redesign)

'use client';

import { Suspense } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { EventList } from '@/components/EventList';
import { FeaturedEvents } from '@/components/events/FeaturedEvents';
import { SearchResultsHero } from '@/components/events/SearchResultsHero';

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink" />}>
      <EventsPageContent />
    </Suspense>
  );
}

function EventsPageContent() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const search = (searchParams.get('search') || '').trim();
  const hasSearch = search.length > 0;

  return (
    <div className="min-h-screen">
      {/* Hero (dark) — featured by default, real search results when searching */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="ww-hatch absolute inset-0" aria-hidden />
        <div className="ww-topo absolute inset-0 opacity-70" aria-hidden />
        <div className="relative z-10 mx-auto max-w-content px-6 py-14 sm:px-8 lg:px-10">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-orange-accent">
            {hasSearch ? 'Resultados de búsqueda' : 'Eventos destacados'}
          </p>
          <h1 className="max-w-3xl text-[36px] font-black leading-[1.02] tracking-[-0.03em] sm:text-[46px]">
            {hasSearch ? <>Resultados para «{search}»</> : 'Encuentra tu próxima montaña'}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/70">
            {hasSearch
              ? 'Eventos, competiciones y servicios que coinciden con tu búsqueda.'
              : 'Explora y filtra todos los eventos de trail running del mundo.'}
          </p>

          <div className="mt-9">
            {hasSearch ? <SearchResultsHero search={search} /> : <FeaturedEvents />}
          </div>
        </div>
      </section>

      {/* Listing (filtered by the same search) */}
      <div className="mx-auto max-w-content px-6 py-12 sm:px-8 lg:px-10">
        <EventList viewMode="grid" showFilters={true} locale={locale} initialSearch={search} />
      </div>
    </div>
  );
}
