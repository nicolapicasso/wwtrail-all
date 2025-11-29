// components/EditionCard.tsx - Card for displaying edition details

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
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
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Check if edition has resolved fields (EditionFull)
  const editionFull = edition as EditionFull;
  const hasInheritance = 'resolvedDistance' in editionFull;

  const distance = hasInheritance ? editionFull.resolvedDistance : edition.distance;
  const elevation = hasInheritance ? editionFull.resolvedElevation : edition.elevation;
  const maxParticipants = hasInheritance
    ? editionFull.resolvedMaxParticipants
    : edition.maxParticipants;
  const city = hasInheritance ? editionFull.resolvedCity : edition.city;

  // Get images
  const mainImage = edition.coverImage || (edition as any).competition?.coverImage;
  const logoImage = (edition as any).competition?.logoUrl || (edition as any).competition?.event?.logoUrl;
  const competitionName = (edition as any).competition?.name || '';

  const renderImage = () => {
    if (mainImage && !imageError) {
      return (
        <Image
          src={mainImage}
          alt={`${competitionName} ${edition.year}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImageError(true)}
        />
      );
    } else {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
          <Calendar className="h-20 w-20 text-gray-300" />
        </div>
      );
    }
  };

  const content = (
    <div className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md flex flex-col h-full">
      {/* Image Section */}
      <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50">
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
                alt={`${competitionName} logo`}
                fill
                className="object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
          <span
            className={`inline-flex items-center rounded-none px-2.5 py-0.5 text-xs font-semibold shadow-lg ${
              edition.status === 'UPCOMING'
                ? 'bg-[#163D89] text-white'
                : edition.status === 'ONGOING'
                ? 'bg-[#0E612F] text-white'
                : edition.status === 'FINISHED'
                ? 'bg-black text-white'
                : 'bg-[#991B1B] text-white'
            }`}
          >
            {edition.status}
          </span>
          <span
            className={`inline-flex items-center rounded-none px-2.5 py-0.5 text-xs font-semibold shadow-lg ${
              edition.registrationStatus === 'OPEN'
                ? 'bg-[#0E612F] text-white'
                : edition.registrationStatus === 'FULL'
                ? 'bg-[#991B1B] text-white'
                : edition.registrationStatus === RegistrationStatus.COMING_SOON
                ? 'bg-[#163D89] text-white'
                : 'bg-black text-white'
            }`}
          >
            {edition.registrationStatus.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg font-semibold group-hover:text-gray-600 transition-colors mb-2">
          {competitionName} {edition.year}
        </h3>

        {/* Date */}
        <p className="text-sm text-muted-foreground mb-3">
          {new Date(edition.startDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 border-t pt-3">
          {/* Distance */}
          {distance && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Distance</p>
                <p className="text-sm font-semibold">
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
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                <Mountain className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Elevation</p>
                <p className="text-sm font-semibold">
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
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-semibold">
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
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <Users className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Participants</p>
                <p className="text-sm font-semibold">
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
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(edition.registrationUrl, '_blank', 'noopener,noreferrer');
              }}
              className="inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Register Now
            </button>
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

  if (linkTo) {
    return (
      <Link href={linkTo}>
        {content}
      </Link>
    );
  }

  // Default: link to edition detail page
  if (edition.slug) {
    return (
      <Link href={`/editions/${edition.slug}`}>
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
