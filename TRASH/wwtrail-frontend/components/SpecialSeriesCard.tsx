// components/SpecialSeriesCard.tsx - Individual special series card component

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { SpecialSeriesListItem } from '@/types/v2';
import { Trophy, Globe } from 'lucide-react';

interface SpecialSeriesCardProps {
  specialSeries: SpecialSeriesListItem;
  onClick?: () => void;
  className?: string;
}

export function SpecialSeriesCard({
  specialSeries,
  onClick,
  className = ''
}: SpecialSeriesCardProps) {
  const [logoError, setLogoError] = useState(false);

  const content = (
    <div className={`group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md flex flex-col h-full ${className}`}>
      {/* Logo Section with Black Background */}
      <div className="relative w-full h-48 overflow-hidden bg-black flex items-center justify-center">
        {specialSeries.logoUrl && !logoError ? (
          <div className="relative w-32 h-32 p-4">
            <Image
              src={specialSeries.logoUrl}
              alt={specialSeries.name}
              fill
              className="object-contain"
              onError={() => setLogoError(true)}
            />
          </div>
        ) : (
          <Trophy className="h-20 w-20 text-white/30" />
        )}

        {/* Status Badge */}
        {specialSeries.status === 'DRAFT' && (
          <div className="absolute top-2 right-2 z-10">
            <span className="inline-flex items-center rounded-none bg-black px-2.5 py-0.5 text-xs font-semibold text-white shadow-lg">
              Draft
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg font-semibold group-hover:text-green-600 transition-colors mb-2 line-clamp-2">
          {specialSeries.name}
        </h3>

        {/* Country */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>{specialSeries.country}</span>
          </div>

          {/* Competitions count */}
          {specialSeries._count?.competitions !== undefined && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>
                {specialSeries._count.competitions} competition{specialSeries._count.competitions !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
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

  return (
    <Link href={`/special-series/${specialSeries.slug}`}>
      {content}
    </Link>
  );
}
