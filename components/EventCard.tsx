// components/EventCard.tsx - Card component for displaying events

import Link from 'next/link';
import { Event } from '@/types/v2';
import { Calendar, MapPin, Users, Eye } from 'lucide-react';

interface EventCardProps {
  event: Event;
  showStats?: boolean;
  onClick?: () => void;
}

export function EventCard({ event, showStats = true, onClick }: EventCardProps) {
  const content = (
    <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      {/* Image/Header */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-500 to-green-700">
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <MapPin className="h-16 w-16 text-white/30" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-2">
          {event.isHighlighted && (
            <span className="inline-flex items-center rounded-full bg-yellow-500 px-2.5 py-0.5 text-xs font-semibold text-white">
              ⭐ Featured
            </span>
          )}
          {event.status === 'PUBLISHED' && (
            <span className="inline-flex items-center rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-semibold text-white">
              Active
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold line-clamp-2 group-hover:text-green-600 transition-colors">
          {event.name}
        </h3>

        {/* Location */}
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{event.city}, {event.country}</span>
        </div>

        {/* Description */}
        {event.description && (
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Stats */}
        {showStats && (
          <div className="flex items-center gap-4 border-t pt-3 text-xs text-muted-foreground">
            {event._count?.competitions !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{event._count.competitions} races</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span>{event.viewCount} views</span>
            </div>
            {event.firstEditionYear && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Since {event.firstEditionYear}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-green-500/0 transition-colors group-hover:bg-green-500/5" />
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return (
    <Link href={`/events/${event.slug}`} className="block">
      {content}
    </Link>
  );
}

// Grid container component
interface EventsGridProps {
  events: Event[];
  loading?: boolean;
  emptyMessage?: string;
}

export function EventsGrid({ events, loading, emptyMessage = 'No events found' }: EventsGridProps) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 rounded-t-lg bg-gray-200" />
            <div className="space-y-3 p-4">
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-4 w-2/3 rounded bg-gray-200" />
              <div className="h-3 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">{emptyMessage}</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search query.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
