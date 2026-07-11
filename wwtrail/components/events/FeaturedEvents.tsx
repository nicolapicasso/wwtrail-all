// components/events/FeaturedEvents.tsx
// Asymmetric featured block for the events listing hero:
// one large card (1.55fr) + two stacked cards (1fr).

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import eventsService from '@/lib/api/v2/events.service';
import type { Event } from '@/types/event';
import { EventStatus } from '@/types/event';
import { StatChip } from '@/components/ui/StatChip';

function mediaUrl(e: Event) {
  return e.coverImage || e.coverImageUrl || e.logo || e.logoUrl || null;
}

function LargeCard({ event }: { event: Event }) {
  const img = mediaUrl(event);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-xl border border-white/10"
    >
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt={event.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 bg-surface-alt" />
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(15,19,21,.85))' }} />
      <div className="relative p-7">
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-white/80">
          <MapPin className="h-4 w-4" />
          {[event.city, event.country].filter(Boolean).join(', ')}
        </span>
        <h3 className="mt-2 max-w-lg text-[32px] font-black leading-tight tracking-[-0.02em] text-white">
          {event.name}
        </h3>
        <div className="mt-5 flex max-w-md gap-2">
          <StatChip label="Carreras" value={event._count?.competitions ?? '—'} />
          <StatChip label="Dist. máx" value="—" />
          <StatChip label="Desnivel+" value="—" variant="elevation" />
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ event }: { event: Event }) {
  const img = mediaUrl(event);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group relative flex min-h-[142px] flex-1 flex-col justify-end overflow-hidden rounded-xl border border-white/10"
    >
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt={event.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 bg-surface-alt" />
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 35%, rgba(15,19,21,.82))' }} />
      <div className="relative p-5">
        <span className="flex items-center gap-1 text-[12px] font-semibold text-white/75">
          <MapPin className="h-3.5 w-3.5" />
          {[event.city, event.country].filter(Boolean).join(', ')}
        </span>
        <h3 className="mt-1 text-[18px] font-extrabold leading-tight text-white">{event.name}</h3>
      </div>
    </Link>
  );
}

export function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await eventsService.getAll({
          featured: true,
          limit: 3,
          status: EventStatus.PUBLISHED,
        });
        if (active) setEvents(res?.data || []);
      } catch {
        if (active) setEvents([]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (events.length === 0) return null;

  const [first, ...rest] = events;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.55fr_1fr]">
      <LargeCard event={first} />
      <div className="flex flex-col gap-5">
        {rest.slice(0, 2).map((e) => (
          <SmallCard key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}

export default FeaturedEvents;
