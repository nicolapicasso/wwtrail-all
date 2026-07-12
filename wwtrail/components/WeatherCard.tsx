// components/WeatherCard.tsx - Tarjeta de información meteorológica

'use client';

import { useTranslations } from 'next-intl';
import { RefreshCw, CloudOff, Loader2 } from 'lucide-react';
import { WEATHER_ICONS, WEATHER_COLORS } from '@/types/weather';
import type { EditionWeather } from '@/types/weather';

interface WeatherCardProps {
  weather: EditionWeather | null | undefined;
  weatherFetched: boolean;
  loading?: boolean;
  fetching?: boolean;
  canFetch?: boolean;
  onFetch?: (force?: boolean) => Promise<void>;
}

export default function WeatherCard({
  weather,
  weatherFetched,
  loading = false,
  fetching = false,
  canFetch = false,
  onFetch,
}: WeatherCardProps) {
  const t = useTranslations('cmp');
  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center gap-3 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{t('weatherLoading')}</span>
        </div>
      </div>
    );
  }

  // No weather fetched yet
  if (!weatherFetched) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-dashed border-blue-300 p-8">
        <div className="text-center">
          <CloudOff className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('weatherUnavailable')}
          </h3>
          <p className="text-gray-600">
            {t('weatherNoHistorical')}
          </p>

          {canFetch && onFetch && (
            <button
              onClick={() => onFetch(false)}
              disabled={fetching}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-6"
            >
              {fetching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('weatherFetching')}
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  {t('weatherFetch')}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Weather fetched but data is null or incomplete (shouldn't happen, but handle it)
  if (!weather || !weather.temperature || weather.temperature.avg === undefined) {
    return (
      <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-8">
        <div className="text-center">
          <p className="text-yellow-800 mb-4">
            {t('weatherLoadError')}
          </p>
          {canFetch && onFetch && (
            <button
              onClick={() => onFetch(true)}
              disabled={fetching}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              {t('retry')}
            </button>
          )}
        </div>
      </div>
    );
  }

  const { temperature, condition, precipitation, wind, humidity, pressure, cloudCover } =
    weather;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">{t('weatherConditions')}</h3>

        {canFetch && onFetch && (
          <button
            onClick={() => onFetch(true)}
            disabled={fetching}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t('weatherRefresh')}
            title={t('weatherRefresh')}
          >
            <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Main Weather */}
      <div className="flex items-center gap-6 mb-6 pb-6 border-b">
        {/* Icon */}
        <div className="text-6xl">{WEATHER_ICONS[condition]}</div>

        {/* Temperature */}
        <div>
          <div className="text-4xl font-bold text-gray-900">
            {temperature.avg.toFixed(1)}°C
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {temperature.min.toFixed(1)}° / {temperature.max.toFixed(1)}°
          </div>
          <div className={`text-sm font-medium mt-2 ${WEATHER_COLORS[condition]}`}>
            {weather.conditionText}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <WeatherDetail
          icon="💧"
          label={t('precipitation')}
          value={`${precipitation} mm`}
        />

        <WeatherDetail
          icon="💨"
          label={t('wind')}
          value={`${wind.speed} km/h ${wind.directionText}`}
        />

        <WeatherDetail icon="💦" label={t('humidity')} value={`${humidity}%`} />

        <WeatherDetail icon="🔽" label={t('pressure')} value={`${pressure} hPa`} />

        <WeatherDetail
          icon="☁️"
          label={t('cloudCover')}
          value={`${cloudCover}%`}
        />

        <div className="text-xs text-gray-500 col-span-2 pt-2 border-t">
          {t('weatherDataFrom', {
            date: new Date(weather.date).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Detalle individual de meteo
 */
interface WeatherDetailProps {
  icon: string;
  label: string;
  value: string;
}

function WeatherDetail({ icon, label, value }: WeatherDetailProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xs text-gray-600">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
