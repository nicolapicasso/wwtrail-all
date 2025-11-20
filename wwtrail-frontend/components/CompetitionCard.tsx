// components/CompetitionCard.tsx - Individual competition card component

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Competition } from '@/types/v2';
import { Mountain, TrendingUp, Users, Calendar } from 'lucide-react';

interface CompetitionCardProps {
  competition: Competition;
  eventSlug?: string;
  onClick?: () => void;
  className?: string;
}

export function CompetitionCard({
  competition,
  eventSlug,
  onClick,
  className = ''
}: CompetitionCardProps) {
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const mainImage = competition.coverImage;
  const logoImage = competition.logoUrl || (competition as any).event?.logoUrl;

  const renderImage = () => {
    if (mainImage && !imageError) {
      return (
        <Image
          src={mainImage}
          alt={competition.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImageError(true)}
        />
      );
    } else {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
          <Mountain className="h-20 w-20 text-gray-300" />
        </div>
      );
    }
  };

  const content = (
    <div className={`group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md flex flex-col h-full ${className}`}>
      {/* Image Section */}
      <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
        {renderImage()}

        {/* Overlay Gradient */}
        {mainImage && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        )}

        {/* Logo Overlay */}
        {logoImage && !logoError && (
          <div className="absolute bottom-3 left-3 bg-white rounded-lg p-2 shadow-lg z-10">
            <div className="relative w-12 h-12">
              <Image
                src={logoImage}
                alt={`${competition.name} logo`}
                fill
                className="object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
          </div>
        )}

        {/* Inactive Badge */}
        {!competition.isActive && (
          <div className="absolute top-2 right-2 z-10">
            <span className="inline-flex items-center rounded-full bg-gray-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-lg">
              Inactive
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg font-semibold group-hover:text-green-600 transition-colors mb-2 line-clamp-2">
          {competition.name}
        </h3>

        {/* Description */}
        {competition.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2 flex-1">
            {competition.description}
          </p>
        )}

        {/* Stats Grid */}
        <div className="mt-3 grid grid-cols-2 gap-3 border-t pt-3">
          {/* Type */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
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
            <span>
              {competition._count.editions} edition{competition._count.editions !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  // Use hierarchical route if eventSlug is available (from prop or competition.event)
  const finalEventSlug = eventSlug || competition.event?.slug;

  if (finalEventSlug) {
    return (
      <Link href={`/events/${finalEventSlug}/${competition.slug}`}>
        {content}
      </Link>
    );
  }

  // Fallback: link to standalone competition detail page (deprecated route)
  return (
    <Link href={`/competitions/${competition.slug}`}>
      {content}
    </Link>
  );
}

// Compact version for inline display
interface CompetitionCardCompactProps {
  competition: Competition;
  className?: string;
}

export function CompetitionCardCompact({ competition, className = '' }: CompetitionCardCompactProps) {
  return (
    <div className={`flex items-center justify-between rounded-md border p-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <Mountain className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <p className="font-semibold">{competition.name}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {competition.baseDistance && <span>{competition.baseDistance}km</span>}
            {competition.baseElevation && <span>• {competition.baseElevation}m D+</span>}
          </div>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground">{competition.type}</span>
    </div>
  );
}
