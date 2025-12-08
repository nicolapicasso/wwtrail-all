'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  zancadasService,
  ZancadasBalance as BalanceType,
  EquivalentCompetitionsResponse,
  ScaleData,
  CompetitionMarker
} from '@/lib/api/zancadas.service';
import { Footprints, RefreshCw, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useLocale } from 'next-intl';

// Constantes de conversión
const METERS_PER_ZANCADA = 1.5;
const ELEVATION_METERS_PER_ZANCADA = 0.3;

interface ZancadasBalanceProps {
  onSyncComplete?: () => void;
}

// =============================================
// SIMPLE PROGRESS BAR COMPONENTS
// =============================================

/**
 * Barra de progreso simple con marcadores de competiciones
 */
function ProgressScale({
  scale,
  type,
  locale
}: {
  scale: ScaleData;
  type: 'distance' | 'elevation';
  locale: string;
}) {
  const isDistance = type === 'distance';
  const colorClass = isDistance ? 'blue' : 'green';
  const unit = isDistance ? 'km' : 'm D+';

  const formatValue = (val: number) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}k`;
    }
    return val.toLocaleString();
  };

  return (
    <div className="space-y-3">
      {/* Escala header */}
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">{formatValue(scale.scalePrev)} {unit}</span>
        <span className={`font-bold text-${colorClass}-600`}>
          {scale.userValue.toLocaleString()} {unit}
        </span>
        <span className="text-muted-foreground">{formatValue(scale.scaleMax)} {unit}</span>
      </div>

      {/* Progress bar */}
      <div className={`relative h-3 bg-${colorClass}-100 rounded-full overflow-hidden`}>
        {/* User progress fill */}
        <div
          className={`absolute top-0 left-0 h-full bg-gradient-to-r from-${colorClass}-400 to-${colorClass}-500 rounded-full transition-all duration-700`}
          style={{ width: `${Math.min(100, scale.progress)}%` }}
        />

        {/* Competition markers */}
        {scale.competitions.map((comp) => (
          <div
            key={comp.id + comp.displayName}
            className="absolute top-0 h-full flex items-center"
            style={{ left: `${comp.position}%` }}
            title={comp.displayName}
          >
            <div
              className={`w-1 h-full ${
                comp.isCompleted
                  ? 'bg-green-500'
                  : `bg-${colorClass}-300`
              }`}
            />
          </div>
        ))}

        {/* User position marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-700"
          style={{ left: `${Math.min(98, scale.progress)}%` }}
        >
          <div className={`w-3 h-3 bg-${colorClass}-600 rounded-full border-2 border-white shadow`} />
        </div>
      </div>

      {/* Progress percentage */}
      <div className="text-center">
        <span className={`text-sm font-semibold text-${colorClass}-600`}>
          {scale.progress.toFixed(1)}%
        </span>
        <span className="text-xs text-muted-foreground ml-1">
          hacia {formatValue(scale.scaleMax)} {unit}
        </span>
      </div>

      {/* Competition list */}
      <div className="space-y-1">
        {scale.competitions.map((comp) => (
          <CompetitionRow
            key={comp.id + comp.displayName}
            competition={comp}
            type={type}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Fila de competición individual
 */
function CompetitionRow({
  competition,
  type,
  locale
}: {
  competition: CompetitionMarker;
  type: 'distance' | 'elevation';
  locale: string;
}) {
  const isDistance = type === 'distance';
  const value = isDistance
    ? `${(competition.baseDistance * competition.multiplier).toLocaleString()} km`
    : `${((competition.baseElevation || 0) * competition.multiplier).toLocaleString()} m`;

  return (
    <Link
      href={`/${locale}/events/${competition.event.slug}/${competition.slug}`}
      className={`flex items-center gap-2 text-xs p-2 rounded-lg transition-colors ${
        competition.isCompleted
          ? 'bg-green-50 text-green-700 hover:bg-green-100'
          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
      }`}
    >
      {/* Status icon */}
      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
        competition.isCompleted
          ? 'bg-green-500 text-white'
          : isDistance ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
      }`}>
        {competition.isCompleted ? '✓' : '○'}
      </span>

      {/* Competition name */}
      <span className="flex-1 truncate font-medium">
        {competition.displayName}
      </span>

      {/* Value */}
      <span className="text-muted-foreground flex-shrink-0">
        {value}
      </span>

      <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
    </Link>
  );
}

// =============================================
// MAIN COMPONENT
// =============================================

export function ZancadasBalance({ onSyncComplete }: ZancadasBalanceProps) {
  const [balance, setBalance] = useState<BalanceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [equivalentData, setEquivalentData] = useState<EquivalentCompetitionsResponse | null>(null);
  const locale = useLocale();

  const localEquivalentKm = balance ? (balance.balance * METERS_PER_ZANCADA) / 1000 : 0;
  const localEquivalentElevation = balance ? balance.balance * ELEVATION_METERS_PER_ZANCADA : 0;

  const loadBalance = useCallback(async () => {
    try {
      setLoading(true);
      const data = await zancadasService.getBalance();
      setBalance(data);

      if (data && data.balance > 0) {
        try {
          const competitions = await zancadasService.getEquivalentCompetitions(data.balance);
          setEquivalentData(competitions);
        } catch (err) {
          console.log('Error loading equivalent competitions:', err);
        }
      }
    } catch (error) {
      console.error('Error loading balance:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await zancadasService.syncBalance();
      setBalance({
        balance: result.balance,
        syncedAt: result.syncedAt,
        omniwalletCustomerId: balance?.omniwalletCustomerId || null,
        cardNumber: balance?.cardNumber || null,
        omniwalletBalance: null,
        synced: true,
      });
      toast.success('Balance sincronizado correctamente');
      onSyncComplete?.();

      if (result.balance > 0) {
        const competitions = await zancadasService.getEquivalentCompetitions(result.balance);
        setEquivalentData(competitions);
      }
    } catch (error) {
      console.error('Error syncing balance:', error);
      toast.error('Error al sincronizar el balance');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-24 mb-2" />
          <Skeleton className="h-4 w-40" />
        </CardContent>
      </Card>
    );
  }

  if (!balance) {
    return null;
  }

  const displayKm = equivalentData?.equivalentKm ?? localEquivalentKm;
  const displayElevation = equivalentData?.equivalentElevation ?? localEquivalentElevation;

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-1" />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Footprints className="h-5 w-5 text-primary-500" />
            <CardTitle className="text-lg">Mis Zancadas</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSync}
            disabled={syncing}
            className="h-8 px-2"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance principal */}
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-primary-600">
            {balance.balance.toLocaleString()}
          </span>
          <span className="text-lg text-muted-foreground mb-1">Zancadas</span>
        </div>

        {/* Equivalencias resumidas */}
        <div className="flex gap-4 text-sm text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-1">
            <span className="text-blue-500">📍</span>
            <span>{displayKm.toFixed(2)} km</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-500">⛰️</span>
            <span>{displayElevation.toLocaleString()} m D+</span>
          </div>
        </div>

        {/* Escalas de progreso */}
        {equivalentData && (
          <div className="space-y-6 pt-2 border-t">
            {/* Distancia */}
            {!equivalentData.distanceScale.isMaxLevel && equivalentData.distanceScale.competitions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-blue-700 mb-3 flex items-center gap-1">
                  📍 Progreso en distancia
                </h4>
                <ProgressScale
                  scale={equivalentData.distanceScale}
                  type="distance"
                  locale={locale}
                />
              </div>
            )}

            {/* Si alcanzó nivel máximo de distancia */}
            {equivalentData.distanceScale.isMaxLevel && (
              <div className="text-center py-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg">
                <span className="text-2xl">🏆</span>
                <p className="text-sm font-medium text-amber-700 mt-1">
                  ¡Nivel máximo de distancia alcanzado!
                </p>
                <p className="text-xs text-amber-600">
                  {displayKm.toLocaleString()} km recorridos
                </p>
              </div>
            )}

            {/* Desnivel */}
            {!equivalentData.elevationScale.isMaxLevel && equivalentData.elevationScale.competitions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-3 flex items-center gap-1">
                  ⛰️ Progreso en desnivel
                </h4>
                <ProgressScale
                  scale={equivalentData.elevationScale}
                  type="elevation"
                  locale={locale}
                />
              </div>
            )}

            {/* Si alcanzó nivel máximo de desnivel */}
            {equivalentData.elevationScale.isMaxLevel && (
              <div className="text-center py-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg">
                <span className="text-2xl">🏔️</span>
                <p className="text-sm font-medium text-amber-700 mt-1">
                  ¡Nivel máximo de desnivel alcanzado!
                </p>
                <p className="text-xs text-amber-600">
                  {displayElevation.toLocaleString()} m D+ acumulados
                </p>
              </div>
            )}
          </div>
        )}

        {balance.syncedAt && (
          <p className="text-xs text-muted-foreground pt-2 border-t">
            Última sincronización:{' '}
            {new Date(balance.syncedAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
