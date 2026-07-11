// app/[locale]/events/page.tsx — Events listing (redesign)

'use client';

import { useLocale } from 'next-intl';
import { EventList } from '@/components/EventList';
import { FeaturedEvents } from '@/components/events/FeaturedEvents';

export default function EventsPage() {
  const locale = useLocale();

  return (
    <div className="min-h-screen">
      {/* Featured hero (dark) */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="ww-hatch absolute inset-0" aria-hidden />
        <div className="ww-topo absolute inset-0 opacity-70" aria-hidden />
        <div className="relative z-10 mx-auto max-w-content px-6 py-14 sm:px-8 lg:px-10">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-orange-accent">
            Eventos destacados
          </p>
          <h1 className="max-w-3xl text-[36px] font-black leading-[1.02] tracking-[-0.03em] sm:text-[46px]">
            Encuentra tu próxima montaña
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/70">
            Explora y filtra todos los eventos de trail running del mundo.
          </p>

          <div className="mt-9">
            <FeaturedEvents />
          </div>
        </div>
      </section>

      {/* Listing */}
      <div className="mx-auto max-w-content px-6 py-12 sm:px-8 lg:px-10">
        <EventList viewMode="grid" showFilters={true} locale={locale} />
      </div>
    </div>
  );
}
