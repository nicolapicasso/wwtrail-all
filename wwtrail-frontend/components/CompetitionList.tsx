// components/CompetitionList.tsx - List competitions for an event

'use client';

import Link from 'next/link';
import { Competition } from '@/types/v2';
import { useCompetitions } from '@/hooks/useCompetitions';
import { Mountain, TrendingUp, Users, Calendar } from 'lucide-react';

interface CompetitionListProps {
  eventId: string;
  eventSlug?: string;
  onSelect?: (competition: Competition) => void;
}

export function CompetitionList({ eventId, eventSlug, onSelect }: CompetitionListProps) {
  const { competitions, loading, error } = useCompetitions(eventId);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border p-4">
            <div className="h-6 w-48 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-full rounded bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">Error loading competitions: {error}</p>
      </div>
    );
  }

  if (competitions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <Mountain className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No competitions yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          This event doesn't have any competitions configured.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {competitions.map((competition) => (
        <CompetitionCard
          key={competition.id}
          competition={competition}
          eventSlug={eventSlug}
          onClick={onSelect ? () => onSelect(competition) : undefined}
        />
      ))}
    </div>
  );
}

interface CompetitionCardProps {
  competition: Competition;
  eventSlug?: string;
  onClick?: () => void;
}

function CompetitionCard({ competition, eventSlug, onClick }: CompetitionCardProps) {
  const content = (
    <div className="group relative overflow-hidden rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        {/* Main Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold group-hover:text-green-600 transition-colors">
              {competition.name}
            </h3>
            {!competition.isActive && (
              <span className="inline-flex items-center rounded-none bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                Inactive
              </span>
            )}
          </div>

          {competition.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {competition.description}
            </p>
          )}

          {/* Stats Grid */}
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Type */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-none bg-blue-100">
                <Mountain className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm font-semibold">{competition.type}</p>
              </div>
            </div>

            {/* Distance */}
            {competition.baseDistance && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-none bg-green-100">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Distance</p>
                  <p className="text-sm font-semibold">{competition.baseDistance}km</p>
                </div>
              </div>
            )}

            {/* Elevation */}
            {competition.baseElevation && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-none bg-orange-100">
                  <Mountain className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Elevation</p>
                  <p className="text-sm font-semibold">{competition.baseElevation}m</p>
                </div>
              </div>
            )}

            {/* Max Participants */}
            {competition.baseMaxParticipants && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-none bg-purple-100">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Max</p>
                  <p className="text-sm font-semibold">{competition.baseMaxParticipants}</p>
                </div>
              </div>
            )}
          </div>

          {/* Editions count */}
          {competition._count?.editions !== undefined && (
            <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{competition._count.editions} edition{competition._count.editions !== 1 ? 's' : ''} available</span>
            </div>
          )}
        </div>

        {/* Arrow indicator */}
        <div className="flex-shrink-0 pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-none bg-gray-100 transition-colors group-hover:bg-green-100">
            <svg
              className="h-4 w-4 text-gray-600 transition-colors group-hover:text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
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

  if (eventSlug) {
    return (
      <Link href={`/events/${eventSlug}/${competition.slug}`}>
        {content}
      </Link>
    );
  }

  return content;
}

// Compact version for tables/lists
interface CompetitionListCompactProps {
  eventId: string;
  className?: string;
}

export function CompetitionListCompact({ eventId, className = '' }: CompetitionListCompactProps) {
  const { competitions, loading } = useCompetitions(eventId);

  if (loading) {
    return <div className={`animate-pulse h-6 rounded bg-gray-200 ${className}`} />;
  }

  if (competitions.length === 0) {
    return <span className={`text-sm text-muted-foreground ${className}`}>No competitions</span>;
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {competitions.map((comp) => (
        <div key={comp.id} className="flex items-center gap-2 text-sm">
          <span className="font-medium">{comp.name}</span>
          {comp.baseDistance && (
            <span className="text-muted-foreground">• {comp.baseDistance}km</span>
          )}
        </div>
      ))}
    </div>
  );
}
