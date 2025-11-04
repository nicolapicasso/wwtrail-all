// app/events/[eventSlug]/[competitionSlug]/page.tsx - Competition detail page

'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useCompetition } from '@/hooks/useCompetitions';
import { EditionSelector } from '@/components/EditionSelector';
import { EditionCard } from '@/components/EditionCard';
import { Edition } from '@/types/v2';
import { Mountain, TrendingUp, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CompetitionDetailPage() {
  const params = useParams();
  const competitionSlug = params?.competitionSlug as string;
  const eventSlug = params?.eventSlug as string;

  const { competition, loading, error } = useCompetition(competitionSlug);
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-64 rounded-lg bg-gray-200" />
          <div className="h-96 rounded-lg bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-red-900">Competition not found</h2>
          <p className="mt-2 text-red-700">{error || 'This competition does not exist'}</p>
          <Link
            href={`/events/${eventSlug}`}
            className="mt-4 inline-block rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Back to Event
          </Link>
        </div>
      </div>
    );
  }

  const handleYearChange = (year: number, edition: Edition | null) => {
    setSelectedEdition(edition);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <Link
            href={`/events/${eventSlug}`}
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {competition.event?.name}
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{competition.name}</h1>
              {competition.description && (
                <p className="mt-2 text-muted-foreground">{competition.description}</p>
              )}
            </div>
            {!competition.isActive && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                Inactive
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Edition Selector */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Select Edition</h2>
              <EditionSelector
                competitionId={competition.id}
                competitionName={competition.name}
                onYearChange={handleYearChange}
              />
            </div>

            {/* Selected Edition Details */}
            {selectedEdition && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Edition Details</h2>
                <EditionCard edition={selectedEdition} showInheritance />
              </div>
            )}

            {/* All Editions List */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">All Editions</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Browse all available editions of this competition
              </p>
              {/* Here you would list all editions - needs another hook */}
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Use the selector above to view edition details
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Base Information */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold">Base Information</h3>
              <div className="space-y-4">
                {/* Type */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Mountain className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-semibold">{competition.type}</p>
                  </div>
                </div>

                {/* Distance */}
                {competition.baseDistance && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Base Distance</p>
                      <p className="font-semibold">{competition.baseDistance}km</p>
                    </div>
                  </div>
                )}

                {/* Elevation */}
                {competition.baseElevation && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                      <Mountain className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Base Elevation</p>
                      <p className="font-semibold">{competition.baseElevation}m D+</p>
                    </div>
                  </div>
                )}

                {/* Max Participants */}
                {competition.baseMaxParticipants && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Max Participants</p>
                      <p className="font-semibold">{competition.baseMaxParticipants}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Event Info */}
            {competition.event && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold">Event</h3>
                <Link
                  href={`/events/${competition.event.slug}`}
                  className="group block"
                >
                  <p className="font-medium group-hover:text-green-600 transition-colors">
                    {competition.event.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {competition.event.city}, {competition.event.country}
                  </p>
                </Link>
              </div>
            )}

            {/* Stats */}
            {competition._count && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold">Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Editions:</span>
                    <span className="font-semibold">{competition._count.editions || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Note about inheritance */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Individual editions may override these base values.
                Check the edition details for specific information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
