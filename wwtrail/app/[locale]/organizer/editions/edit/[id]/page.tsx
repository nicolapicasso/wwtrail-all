// app/organizer/editions/edit/[id]/page.tsx - Editar edición existente

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Loader2, Trophy, Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import EditionForm from '@/components/forms/EditionForm';
import WeatherCard from '@/components/WeatherCard';
import PodiumCard from '@/components/PodiumCard';
import PodiumForm from '@/components/PodiumForm';
import editionsService from '@/lib/api/v2/editions.service';
import competitionsService from '@/lib/api/v2/competitions.service';
import { useWeather } from '@/hooks/useWeather';
import { usePodiums } from '@/hooks/usePodiums';
import type { Edition } from '@/types/edition';
import type { Competition } from '@/types/competition';
import type { EditionPodium } from '@/types/podium';

interface EditEditionPageProps {
  params: {
    id: string;
  };
}

export default function EditEditionPage({ params }: EditEditionPageProps) {
  const router = useRouter();
  const t = useTranslations('boEvents');
  const [edition, setEdition] = useState<Edition | null>(null);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Weather hook
  const {
    weather,
    weatherFetched,
    loading: weatherLoading,
    fetching: weatherFetching,
    fetchWeather,
  } = useWeather(params.id);

  // Podium state
  const [showPodiumForm, setShowPodiumForm] = useState(false);
  const [editingPodium, setEditingPodium] = useState<EditionPodium | null>(null);

  // Podiums hook
  const {
    podiums,
    podiumsByType,
    loading: podiumsLoading,
    createPodium,
    updatePodium,
    deletePodium,
  } = usePodiums(params.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch edition
        const editionData = await editionsService.getById(params.id);
        setEdition(editionData);

        // Fetch competition
        const competitionData = await competitionsService.getById(editionData.competitionId);
        setCompetition(competitionData);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(t('errorLoadingEditionShort'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('loadingEdition')}</p>
        </div>
      </div>
    );
  }

  if (error || !edition || !competition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-lg font-semibold text-red-900 mb-2">
              {t('errorLoading')}
            </h2>
            <p className="text-sm text-red-700 mb-4">
              {error || t('editionNotFound')}
            </p>
            <Link
              href="/organizer/events"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('backToMyEvents')}
            </Link>
          </div>
        </div>
      </div>
    );
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

        {/* Edition Context */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">{t('editingColon')}</span> {competition.name} {edition.year}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            {t('changesApplyImmediately')}
          </p>
          {(competition.baseDistance || competition.baseElevation || competition.baseMaxParticipants) && (
            <div className="text-xs text-blue-700 mt-2 flex flex-wrap gap-3">
              <span className="font-medium">{t('baseCompetitionValues')}</span>
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
          competitionId={edition.competitionId}
          competition={competition}
          edition={edition}
          onSuccess={(updatedEdition) => {
            router.push('/organizer/editions');
          }}
          onCancel={() => {
            router.push('/organizer/editions');
          }}
        />

        {/* Weather Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t('weatherData')}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {t('weatherHelp')}
          </p>

          <WeatherCard
            weather={weather}
            weatherFetched={weatherFetched}
            loading={weatherLoading}
            fetching={weatherFetching}
            canFetch={true}
            onFetch={fetchWeather as any}
          />
        </div>

        {/* Podiums Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {t('classifications')}
              </h2>
              <p className="text-sm text-gray-600">
                {t('classificationsHelp')}
              </p>
            </div>
            {!showPodiumForm && (
              <button
                onClick={() => {
                  setEditingPodium(null);
                  setShowPodiumForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t('newClassification')}
              </button>
            )}
          </div>

          {/* Podium Form */}
          {showPodiumForm && (
            <div className="mb-6">
              <PodiumForm
                editionId={params.id}
                podium={editingPodium || undefined}
                onSubmit={async (data) => {
                  if (editingPodium) {
                    await updatePodium(editingPodium.id, data);
                  } else {
                    await createPodium(data);
                  }
                  setShowPodiumForm(false);
                  setEditingPodium(null);
                }}
                onCancel={() => {
                  setShowPodiumForm(false);
                  setEditingPodium(null);
                }}
              />
            </div>
          )}

          {/* Podiums List */}
          {podiumsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : podiums.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm">
                {t('noClassifications')}
              </p>
              <p className="text-xs mt-1">
                {t('noClassificationsHint')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {podiums.map((podium) => (
                <div key={podium.id} className="relative">
                  <PodiumCard podium={podium} />

                  {/* Action buttons overlay */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingPodium(podium);
                        setShowPodiumForm(true);
                      }}
                      className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                      title={t('editClassification')}
                    >
                      <Edit2 className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm(t('confirmDeleteClassification'))) {
                          await deletePodium(podium.id);
                        }
                      }}
                      className="p-2 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                      title={t('deleteClassification')}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
