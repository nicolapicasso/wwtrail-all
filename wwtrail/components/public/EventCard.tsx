// components/public/EventCard.tsx
// Public event card for the redesigned portal (Home, listings, related).
// Spec: reusable Event Card — media with overlay + badges, title, a row of
// three stat chips (Carreras / Dist. máx / Desnivel+), and a footer.
//
// This is intentionally separate from the management components/EventCard.tsx
// (bulk-select, admin actions). Here we only render public, read-only data.

'use client';

import Link from 'next/link';
import { ArrowRight, MapPin, Globe } from 'lucide-react';
import type { Event } from '@/types/event';
import { StatChip } from '@/components/ui/StatChip';
import { cn } from '@/lib/utils';

const MONTHS_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export interface PublicEventCardProps {
  event: Event & {
    // Optional aggregates the listing API may add later; rendered when present.
    maxDistance?: number | null;
    maxElevation?: number | null;
    tag?: string | null;
  };
  viewMode?: 'grid' | 'list';
  className?: string;
}

function EventMedia({
  event,
  className,
}: {
  event: PublicEventCardProps['event'];
  className?: string;
}) {
  const img = event.coverImage || event.coverImageUrl || event.logo || event.logoUrl || null;
  const month =
    event.typicalMonth && event.typicalMonth >= 1 && event.typicalMonth <= 12
      ? MONTHS_ES[event.typicalMonth - 1]
      : null;

  return (
    <div className={cn('relative overflow-hidden bg-surface-alt', className)}>
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt={event.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        // Striped placeholder consistent with the design handoff
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #e6e4dd 0 10px, #eeece5 10px 20px)',
          }}
          aria-hidden
        />
      )}

      {/* Bottom gradient for legible white text */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, transparent 45%, rgba(15,19,21,.55))',
        }}
        aria-hidden
      />

      {/* Tag chip (top-left) */}
      {event.tag && (
        <span className="absolute left-3 top-3 rounded-sm bg-surface/95 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-2 shadow-card">
          {event.tag}
        </span>
      )}

      {/* Featured badge (top-left, below/over tag) */}
      {event.featured && (
        <span
          className={cn(
            'absolute top-3 rounded-pill px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-card',
            event.tag ? 'left-3 top-11' : 'left-3'
          )}
          style={{ backgroundColor: '#f0a05a' }}
        >
          ★ Featured
        </span>
      )}

      {/* Month badge (top-right) */}
      {month && (
        <span className="absolute right-3 top-3 rounded-pill bg-ink/70 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
          {month}
        </span>
      )}

      {/* Location (bottom-left) */}
      <span
        className="absolute bottom-3 left-3 flex items-center gap-1 text-[13px] font-semibold text-white"
        style={{ textShadow: '0 1px 3px rgba(0,0,0,.5)' }}
      >
        <MapPin className="h-3.5 w-3.5" />
        {[event.city, event.country].filter(Boolean).join(', ')}
      </span>
    </div>
  );
}

function EventBody({ event }: { event: PublicEventCardProps['event'] }) {
  const races = event._count?.competitions;

  return (
    <div className="flex flex-1 flex-col p-[18px]">
      <h3 className="mb-3 text-[19px] font-extrabold leading-tight tracking-[-0.01em] text-ink-2">
        <Link href={`/events/${event.slug}`} className="hover:text-green-brand">
          {event.name}
        </Link>
      </h3>

      {/* Stat row */}
      <div className="mb-4 flex gap-2">
        <StatChip label="Carreras" value={races ?? '—'} />
        <StatChip
          label="Dist. máx"
          value={event.maxDistance ?? '—'}
          suffix={event.maxDistance != null ? 'km' : undefined}
        />
        <StatChip
          label="Desnivel+"
          value={event.maxElevation ?? '—'}
          suffix={event.maxElevation != null ? 'm' : undefined}
          variant="elevation"
        />
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-hairline pt-3 text-[12.5px] font-semibold text-text-muted">
        <span className="flex items-center gap-1.5">
          {event.firstEditionYear ? <>Desde {event.firstEditionYear}</> : <>&nbsp;</>}
          {event.website && (
            <>
              <span className="text-text-faint">·</span>
              <Globe className="h-3.5 w-3.5" /> Web
            </>
          )}
        </span>
        <Link
          href={`/events/${event.slug}`}
          className="flex items-center gap-1 font-extrabold text-green-brand hover:underline"
        >
          Ver detalle <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export function PublicEventCard({ event, viewMode = 'grid', className }: PublicEventCardProps) {
  if (viewMode === 'list') {
    return (
      <article
        className={cn(
          'flex items-stretch overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-colors',
          className
        )}
      >
        <EventMedia event={event} className="min-h-[200px] flex-[0_0_300px]" />
        <EventBody event={event} />
      </article>
    );
  }

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-shadow hover:shadow-floating',
        className
      )}
    >
      <EventMedia event={event} className="h-[180px]" />
      <EventBody event={event} />
    </article>
  );
}

export default PublicEventCard;
