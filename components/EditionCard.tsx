// components/EditionCard.tsx - Card for displaying edition details

import Link from 'next/link';
import { Edition, EditionFull } from '@/types/v2';
import { Calendar, MapPin, Users, TrendingUp, Mountain, Info } from 'lucide-react';
import { RegistrationStatus } from '@/types/competition';


interface EditionCardProps {
  edition: Edition | EditionFull;
  showInheritance?: boolean;
  linkTo?: string;
  onClick?: () => void;
}

export function EditionCard({ edition, showInheritance = false, linkTo, onClick }: EditionCardProps) {
  // Check if edition has resolved fields (EditionFull)
  const editionFull = edition as EditionFull;
  const hasInheritance = 'resolvedDistance' in editionFull;

  const distance = hasInheritance ? editionFull.resolvedDistance : edition.distance;
  const elevation = hasInheritance ? editionFull.resolvedElevation : edition.elevation;
  const maxParticipants = hasInheritance
    ? editionFull.resolvedMaxParticipants
    : edition.maxParticipants;
  const city = hasInheritance ? editionFull.resolvedCity : edition.city;

  const content = (
    <div className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-green-50 to-blue-50 p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">{edition.year}</span>
              {edition.year === new Date().getFullYear() && (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                  Current
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(edition.startDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Status Badges */}
          <div className="flex flex-col gap-1">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                edition.status === 'UPCOMING'
                  ? 'bg-blue-100 text-blue-800'
                  : edition.status === 'ONGOING'
                  ? 'bg-green-100 text-green-800'
                  : edition.status === 'FINISHED'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {edition.status}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                edition.registrationStatus === 'OPEN'
                  ? 'bg-green-100 text-green-800'
                  : edition.registrationStatus === 'FULL'
                  ? 'bg-orange-100 text-orange-800'
                  : edition.registrationStatus === RegistrationStatus.COMING_SOON
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {edition.registrationStatus.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Distance */}
          {distance && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Distance</p>
                <p className="font-semibold">
                  {distance}km
                  {showInheritance && hasInheritance && !edition.distance && (
                    <span className="ml-1 text-xs text-green-600">*</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Elevation */}
          {elevation && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                <Mountain className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Elevation</p>
                <p className="font-semibold">
                  {elevation}m D+
                  {showInheritance && hasInheritance && !edition.elevation && (
                    <span className="ml-1 text-xs text-green-600">*</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Location */}
          {city && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold">
                  {city}
                  {showInheritance && hasInheritance && !edition.city && (
                    <span className="ml-1 text-xs text-green-600">*</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Participants */}
          {maxParticipants && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Participants</p>
                <p className="font-semibold">
                  {edition.currentParticipants || 0} / {maxParticipants}
                  {showInheritance && hasInheritance && !edition.maxParticipants && (
                    <span className="ml-1 text-xs text-green-600">*</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Inheritance note */}
        {showInheritance && hasInheritance && (
          <div className="mt-4 flex items-start gap-2 rounded-md bg-green-50 p-3 text-xs text-green-800">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              <span className="text-green-600">*</span> Inherited from base competition settings
            </p>
          </div>
        )}

        {/* Registration URL */}
        {edition.registrationUrl && edition.registrationStatus === 'OPEN' && (
          <div className="mt-4">
            <a
              href={edition.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              Register Now
            </a>
          </div>
        )}
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-green-500/0 transition-colors group-hover:bg-green-500/5 pointer-events-none" />
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  if (linkTo) {
    return (
      <Link href={linkTo} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

// Grid container
interface EditionsGridProps {
  editions: (Edition | EditionFull)[];
  loading?: boolean;
  showInheritance?: boolean;
  linkPattern?: (edition: Edition | EditionFull) => string;
}

export function EditionsGrid({ 
  editions, 
  loading, 
  showInheritance = false,
  linkPattern 
}: EditionsGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border p-4">
            <div className="h-6 w-20 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-32 rounded bg-gray-200" />
            <div className="mt-4 space-y-3">
              <div className="h-12 rounded bg-gray-200" />
              <div className="h-12 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (editions.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No editions found</h3>
          <p className="mt-1 text-sm text-gray-500">No editions available for this competition.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {editions.map((edition) => (
        <EditionCard
          key={edition.id}
          edition={edition}
          showInheritance={showInheritance}
          linkTo={linkPattern ? linkPattern(edition) : undefined}
        />
      ))}
    </div>
  );
}
