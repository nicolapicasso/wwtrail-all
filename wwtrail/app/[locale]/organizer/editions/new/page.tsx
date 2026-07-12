// app/organizer/editions/new/page.tsx - Crear nueva edición

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import EditionForm from '@/components/forms/EditionForm';
import competitionsService from '@/lib/api/v2/competitions.service';
import type { Competition } from '@/types/competition';

function NewEditionContent() {
  const router = useRouter();
  const t = useTranslations('boEvents');
  const searchParams = useSearchParams();
  const competitionId = searchParams.get('competitionId');

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!competitionId) {
      router.push('/organizer/events');
      return;
    }

    const fetchCompetition = async () => {
      try {
        const data = await competitionsService.getById(competitionId);
        setCompetition(data);
      } catch (error) {
        console.error('Error fetching competition:', error);
        router.push('/organizer/events');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetition();
  }, [competitionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!competition || !competitionId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link
            href={`/organizer/events/${competition.eventId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToEvent')}
          </Link>
        </div>

        {/* Competition Context */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">{t('competitionColon')}</span> {competition.name}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            {t('creatingEditionForCompetition')}
          </p>
          {(competition.baseDistance || competition.baseElevation || competition.baseMaxParticipants) && (
            <div className="text-xs text-blue-700 mt-2 flex flex-wrap gap-3">
              {competition.baseDistance && (
                <span>📏 {competition.baseDistance} km</span>
              )}
              {competition.baseElevation && (
                <span>⛰️ {competition.baseElevation} m D+</span>
              )}
              {competition.baseMaxParticipants && (
                <span>👥 {competition.baseMaxParticipants} {t('participants')}</span>
              )}
            </div>
          )}
        </div>

        {/* Form */}
        <EditionForm
          competitionId={competitionId}
          competition={competition}
          onSuccess={(edition) => {
            router.push('/organizer/editions');
          }}
          onCancel={() => {
            router.push('/organizer/editions');
          }}
        />
      </div>
    </div>
  );
}

function NewEditionFallback() {
  const t = useTranslations('boEvents');
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{t('loading')}</p>
      </div>
    </div>
  );
}

export default function NewEditionPage() {
  return (
    <Suspense fallback={<NewEditionFallback />}>
      <NewEditionContent />
    </Suspense>
  );
}
