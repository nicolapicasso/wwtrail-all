// components/home/EventsBlock.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PublicEventCard } from '@/components/public/EventCard';
import eventsService from '@/lib/api/v2/events.service';
import type { Event } from '@/types/event';
import { EventStatus } from '@/types/event';
import type { ContentBlockConfig } from '@/types/home';
import { HomeBlockViewType } from '@/types/home';

interface EventsBlockProps {
  config: ContentBlockConfig;
}

const DEFAULT_TITLE = 'Últimos Eventos';
const DEFAULT_SUBTITLE = 'Descubre los mejores eventos de trail running';

export function EventsBlock({ config }: EventsBlockProps) {
  const { limit, viewType, featuredOnly, title, subtitle } = config;
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('[EventsBlock] Fetching events with config:', { limit, featuredOnly });
        const response = await eventsService.getAll({
          limit,
          featured: featuredOnly,
          status: EventStatus.PUBLISHED
        });
        console.log('[EventsBlock] API Response:', response);
        console.log('[EventsBlock] Events count:', response?.data?.length || 0);
        setEvents(response?.data || []);
      } catch (error) {
        console.error('[EventsBlock] Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [limit, featuredOnly]);

  if (loading) {
    return (
      <section className="w-full px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-content">
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-brand border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  const isList = viewType !== HomeBlockViewType.CARDS;

  return (
    <section className="w-full px-6 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-content">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-black tracking-[-0.02em] text-ink-2">
              {title || DEFAULT_TITLE}
            </h2>
            {(subtitle || (!title && DEFAULT_SUBTITLE)) && (
              <p className="mt-1.5 text-[15px] text-text-muted">{subtitle || DEFAULT_SUBTITLE}</p>
            )}
          </div>
          <Link
            href="/events"
            className="flex shrink-0 items-center gap-1.5 text-[14px] font-extrabold text-green-brand hover:underline"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Content */}
        <div
          className={
            isList
              ? 'flex flex-col gap-5'
              : 'grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'
          }
        >
          {events.map((event) => (
            <PublicEventCard
              key={event.id}
              event={event}
              viewMode={isList ? 'list' : 'grid'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
