// components/EditionSelector.tsx
// Unified "Ediciones" block: year switcher + a single detail panel for the
// active edition (dates, status, key stats, weather summary and rankings
// summary) + a clear CTA to the full edition page. Replaces the old
// dropdown+mini-card / "edition details" / "all editions" trio.

'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useAvailableYears, useEditionByYear } from '@/hooks/useEditions';
import { podiumsService } from '@/lib/api/podiums.service';
import { PodiumType, type EditionPodium } from '@/types/podium';
import { WEATHER_ICONS, type WeatherCondition } from '@/types/weather';
import { Edition } from '@/types/v2';
import { Calendar, MapPin, ArrowRight, Trophy, Route, Mountain, Users } from 'lucide-react';

const LOCALE_MAP: Record<string, string> = {
  es: 'es-ES', en: 'en-US', it: 'it-IT', ca: 'ca-ES', fr: 'fr-FR', de: 'de-DE',
};

interface EditionSelectorProps {
  competitionId: string;
  competitionName: string;
  initialYear?: number;
  onYearChange?: (year: number, edition: Edition | null) => void;
  className?: string;
}

// A small colored dot + label describing the edition status.
function statusMeta(status: string | undefined, t: (k: string) => string) {
  switch (status) {
    case 'ONGOING':  return { color: '#0E612F', label: t('statusOngoing') };
    case 'FINISHED': return { color: '#141719', label: t('statusFinished') };
    default:         return { color: '#163D89', label: t('statusUpcoming') };
  }
}

function registrationMeta(status: string | undefined, t: (k: string) => string) {
  switch (status) {
    case 'OPEN':        return { color: '#0E612F', label: t('regOpen') };
    case 'FULL':        return { color: '#991B1B', label: t('regFull') };
    case 'COMING_SOON': return { color: '#163D89', label: t('regComingSoon') };
    case 'CLOSED':      return { color: '#141719', label: t('regClosed') };
    default:            return null;
  }
}

export function EditionSelector({
  competitionId,
  competitionName,
  initialYear,
  onYearChange,
  className = '',
}: EditionSelectorProps) {
  const t = useTranslations('cmp');
  const locale = useLocale();
  const dateLocale = LOCALE_MAP[locale] || 'es-ES';

  const [selectedYear, setSelectedYear] = useState<number | null>(initialYear ?? null);
  const [podium, setPodium] = useState<EditionPodium | null>(null);

  const { years, loading: loadingYears } = useAvailableYears(competitionId);
  const { edition, loading: loadingEdition } = useEditionByYear(competitionId, selectedYear);

  // Default to the most recent available year.
  useEffect(() => {
    if (selectedYear == null && years.length > 0) setSelectedYear(years[0]);
  }, [years, selectedYear]);

  // Notify parent.
  useEffect(() => {
    if (onYearChange && selectedYear != null && !loadingEdition) {
      onYearChange(selectedYear, edition);
    }
  }, [selectedYear, edition, loadingEdition, onYearChange]);

  // Rankings summary: fetch the general podium for the active edition.
  useEffect(() => {
    let active = true;
    setPodium(null);
    if (!edition?.id) return;
    (async () => {
      try {
        const podiums = await podiumsService.getByEdition(edition.id, PodiumType.GENERAL);
        if (active) setPodium(podiums?.[0] ?? null);
      } catch {
        if (active) setPodium(null);
      }
    })();
    return () => { active = false; };
  }, [edition?.id]);

  if (loadingYears) {
    return <div className={`h-40 animate-pulse rounded-lg bg-gray-100 ${className}`} />;
  }

  if (years.length === 0) {
    return (
      <div className={`rounded-lg border border-dashed border-gray-300 p-6 text-center ${className}`}>
        <Calendar className="mx-auto mb-2 h-8 w-8 text-gray-300" />
        <p className="text-sm text-gray-500">{t('noEditionsYet')}</p>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();

  return (
    <div className={className}>
      {/* Year switcher — only when there is more than one edition */}
      {years.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label={t('editionsTitle')}>
          {years.map((year) => {
            const selected = year === selectedYear;
            const dotColor =
              year > currentYear ? '#163D89' : year < currentYear ? '#141719' : '#0E612F';
            return (
              <button
                key={year}
                role="tab"
                aria-selected={selected}
                onClick={() => setSelectedYear(year)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                  selected
                    ? 'border-[#B66916] bg-orange-50 text-[#B66916]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-[#eecfa8]'
                }`}
              >
                <span className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: dotColor }} />
                {year}
              </button>
            );
          })}
        </div>
      )}

      {loadingEdition ? (
        <div className="h-48 animate-pulse rounded-lg bg-gray-100" />
      ) : edition ? (
        <EditionDetail
          edition={edition}
          podium={podium}
          dateLocale={dateLocale}
          t={t}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
          <p className="text-sm text-gray-500">
            {t('noEditionData', { year: selectedYear ?? '' })}
          </p>
        </div>
      )}
    </div>
  );
}

function EditionDetail({
  edition,
  podium,
  dateLocale,
  t,
}: {
  edition: Edition;
  podium: EditionPodium | null;
  dateLocale: string;
  t: (k: string, values?: Record<string, any>) => string;
}) {
  const status = statusMeta(edition.status, t);
  const registration = registrationMeta(edition.registrationStatus, t);
  const dateValue = edition.specificDate || edition.startDate;
  const formattedDate = dateValue
    ? new Date(dateValue).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })
    : t('dateToBeConfirmed');

  const participants = edition.currentParticipants ?? 0;
  const weather = edition.weather;
  const showWeather = !!weather && edition.weatherFetched !== false;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      {/* Header: year + date/city + status badges */}
      <div className="flex items-start justify-between gap-4 bg-gray-50 p-5">
        <div>
          <div className="text-4xl font-black leading-none tracking-tight text-gray-900">
            {edition.year}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#B66916]" />
              <span className="font-medium text-gray-800">{formattedDate}</span>
            </span>
            {edition.city && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#B66916]" />
                <span className="font-medium text-gray-800">{edition.city}</span>
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="px-2.5 py-1 text-xs font-bold text-white" style={{ backgroundColor: status.color }}>
            {status.label}
          </span>
          {registration && (
            <span className="px-2.5 py-1 text-xs font-bold text-white" style={{ backgroundColor: registration.color }}>
              {registration.label}
            </span>
          )}
        </div>
      </div>

      {/* Key stats — participants only when > 0 */}
      <div className="grid grid-cols-2 gap-px border-t border-gray-200 bg-gray-100 sm:grid-cols-3">
        {edition.distance != null && (
          <Stat icon={<Route className="h-4 w-4" />} label={t('labelDistance')} value={`${edition.distance} km`} />
        )}
        {edition.elevation != null && (
          <Stat icon={<Mountain className="h-4 w-4" />} label={t('elevationGain')} value={`${edition.elevation} m`} />
        )}
        {participants > 0 && (
          <Stat icon={<Users className="h-4 w-4" />} label={t('labelParticipants')} value={String(participants)} />
        )}
      </div>

      {/* Weather summary (if registered) */}
      {showWeather && weather && (
        <div className="flex items-center gap-3 border-t border-gray-200 bg-white px-5 py-3">
          <span className="text-2xl" aria-hidden="true">
            {WEATHER_ICONS[weather.condition as WeatherCondition] || '🌡️'}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{t('tabWeather')}</p>
            <p className="truncate text-sm text-gray-700">
              <span className="font-semibold text-gray-900">{Math.round(weather.temperature.avg)}°C</span>
              {' · '}{weather.conditionText}
              {typeof weather.precipitation === 'number' && weather.precipitation > 0 && (
                <span className="text-gray-500"> · {weather.precipitation} mm</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Rankings summary (if registered) */}
      {podium && (
        <div className="border-t border-gray-200 bg-white px-5 py-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-400">{t('tabRankings')}</p>
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 truncate text-sm text-gray-700">
              <span aria-hidden="true">🥇</span>{' '}
              <span className="font-semibold text-gray-900">{podium.firstPlace}</span>
              {podium.firstTime && <span className="text-gray-500"> · {podium.firstTime}</span>}
            </p>
          </div>
        </div>
      )}

      {/* CTA to the full edition page */}
      {edition.slug && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-5 py-4">
          <span className="text-sm text-gray-400">{t('ctaNote')}</span>
          <Link
            href={`/editions/${edition.slug}`}
            className="inline-flex items-center gap-2 rounded-lg bg-[#B66916] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#9c5811]"
          >
            {t('viewEdition', { year: edition.year })}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white p-4">
      <div className="flex items-center gap-1.5 text-gray-400">
        {icon}
        <span className="text-[11px] font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 text-lg font-black tabular-nums text-gray-900">{value}</p>
    </div>
  );
}
