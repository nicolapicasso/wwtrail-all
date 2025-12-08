'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  zancadasService,
  ZancadasBalance as BalanceType,
  EquivalentCompetitionsResponse,
  CompetitionReference
} from '@/lib/api/zancadas.service';
import { Footprints, RefreshCw, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useLocale } from 'next-intl';

// Constantes de conversión (deben coincidir con el backend)
// 1 zancada = 1.5 metros horizontales
// 1 zancada = 0.3 metros de desnivel vertical
const METERS_PER_ZANCADA = 1.5;
const ELEVATION_METERS_PER_ZANCADA = 0.3;

interface ZancadasBalanceProps {
  onSyncComplete?: () => void;
}

// =============================================
// SVG PROGRESS COMPONENTS
// =============================================

/**
 * Barra de progreso para distancia con icono de ruta
 */
function DistanceProgressBar({
  progress,
  userKm,
  targetKm
}: {
  progress: number;
  userKm: number;
  targetKm: number;
}) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{userKm.toFixed(2)} km</span>
        <span>{targetKm} km</span>
      </div>
      <div className="relative h-6 bg-blue-100 rounded-full overflow-hidden">
        {/* Track/Road pattern */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="roadPattern" patternUnits="userSpaceOnUse" width="20" height="6" patternTransform="rotate(0)">
              <line x1="0" y1="3" x2="8" y2="3" stroke="#93c5fd" strokeWidth="1" strokeDasharray="4 4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#roadPattern)" />
        </svg>

        {/* Progress fill */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${clampedProgress}%` }}
        >
          {/* Runner icon at the end of progress */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-1 shadow-sm border border-blue-200">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
              <circle cx="12" cy="5" r="3"/>
              <path d="M6 20l3-7 3 4 3-4 3 7"/>
            </svg>
          </div>
        </div>

        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-blue-900 drop-shadow-sm">
            {clampedProgress.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Barra de progreso para desnivel con perfil de montaña
 */
function ElevationProgressBar({
  progress,
  userElevation,
  targetElevation
}: {
  progress: number;
  userElevation: number;
  targetElevation: number;
}) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{userElevation.toLocaleString()} m D+</span>
        <span>{targetElevation.toLocaleString()} m D+</span>
      </div>
      <div className="relative h-10 bg-gradient-to-b from-green-50 to-green-100 rounded-lg overflow-hidden">
        {/* Mountain profile SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
          {/* Background mountains (grey, behind) */}
          <path
            d="M0 40 L15 25 L25 32 L40 15 L55 28 L70 10 L85 22 L100 18 L100 40 Z"
            fill="#d1d5db"
            opacity="0.5"
          />

          {/* Main mountain profile (green, with clip for progress) */}
          <defs>
            <clipPath id="progressClip">
              <rect x="0" y="0" width={clampedProgress} height="40" />
            </clipPath>
          </defs>

          {/* Filled mountain (progress) */}
          <path
            d="M0 40 L10 30 L20 35 L35 18 L50 30 L65 12 L80 25 L95 20 L100 25 L100 40 Z"
            fill="url(#mountainGradient)"
            clipPath="url(#progressClip)"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#16a34a" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>

          {/* Mountain outline */}
          <path
            d="M0 40 L10 30 L20 35 L35 18 L50 30 L65 12 L80 25 L95 20 L100 25 L100 40"
            fill="none"
            stroke="#166534"
            strokeWidth="0.5"
            opacity="0.6"
          />

          {/* Snow caps on peaks */}
          <circle cx="35" cy="18" r="2" fill="white" opacity="0.8" />
          <circle cx="65" cy="12" r="2.5" fill="white" opacity="0.8" />
          <circle cx="95" cy="20" r="1.5" fill="white" opacity="0.8" />

          {/* Progress indicator line */}
          <line
            x1={clampedProgress}
            y1="0"
            x2={clampedProgress}
            y2="40"
            stroke="#166534"
            strokeWidth="1"
            strokeDasharray="2 2"
            opacity="0.7"
          />
        </svg>

        {/* Climber icon at progress point */}
        <div
          className="absolute top-1 transition-all duration-500 ease-out"
          style={{ left: `calc(${clampedProgress}% - 8px)` }}
        >
          <div className="bg-white rounded-full p-0.5 shadow-sm border border-green-300">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600">
              <path d="M12 2L2 22h20L12 2z"/>
            </svg>
          </div>
        </div>

        {/* Percentage text */}
        <div className="absolute bottom-1 right-2">
          <span className="text-xs font-semibold text-green-900 bg-white/70 px-1 rounded">
            {clampedProgress.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Card de competición de referencia
 */
function CompetitionReferenceCard({
  competition,
  type,
  userValue,
  locale
}: {
  competition: CompetitionReference;
  type: 'distance' | 'elevation';
  userValue: number;
  locale: string;
}) {
  const isDistance = type === 'distance';
  const targetValue = isDistance ? competition.baseDistance : (competition.baseElevation || 0);
  const isComplete = competition.progress >= 100;

  return (
    <div className={`rounded-lg border ${isComplete ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200' : 'bg-white border-gray-200'} p-3`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-sm font-medium ${isComplete ? 'text-amber-700' : 'text-muted-foreground'}`}>
          {isComplete
            ? (isDistance ? '¡Distancia completada!' : '¡Desnivel completado!')
            : (isDistance ? 'Objetivo de distancia' : 'Objetivo de desnivel')
          }
        </span>
        {isComplete && <span className="text-lg">🏆</span>}
      </div>

      {/* Progress bar */}
      {isDistance ? (
        <DistanceProgressBar
          progress={competition.progress}
          userKm={userValue}
          targetKm={competition.baseDistance}
        />
      ) : (
        <ElevationProgressBar
          progress={competition.progress}
          userElevation={userValue}
          targetElevation={competition.baseElevation || 0}
        />
      )}

      {/* Competition link */}
      <Link
        href={`/${locale}/events/${competition.event.slug}/${competition.slug}`}
        className="flex items-center justify-between mt-3 p-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors group"
      >
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 truncate group-hover:text-blue-600">
            {competition.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {competition.event.name} • {competition.baseDistance} km • {(competition.baseElevation || 0).toLocaleString()} m D+
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0 ml-2" />
      </Link>
    </div>
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

  // Calcular equivalencias localmente (para mostrar antes de cargar del servidor)
  const localEquivalentKm = balance ? (balance.balance * METERS_PER_ZANCADA) / 1000 : 0;
  const localEquivalentElevation = balance ? balance.balance * ELEVATION_METERS_PER_ZANCADA : 0;

  const loadBalance = useCallback(async () => {
    try {
      setLoading(true);
      const data = await zancadasService.getBalance();
      setBalance(data);

      // Cargar competiciones equivalentes si hay balance
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

      // Recargar competiciones con el nuevo balance
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

  // If no balance data (Zancadas not configured or user not linked)
  if (!balance) {
    return null;
  }

  // Usar datos del servidor si están disponibles, sino calcular localmente
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

        {/* Competiciones de referencia */}
        {equivalentData && (
          <div className="space-y-3 pt-2 border-t">
            {/* Por distancia */}
            {equivalentData.byDistance && (
              <CompetitionReferenceCard
                competition={equivalentData.byDistance}
                type="distance"
                userValue={displayKm}
                locale={locale}
              />
            )}

            {/* Por desnivel */}
            {equivalentData.byElevation && (
              <CompetitionReferenceCard
                competition={equivalentData.byElevation}
                type="elevation"
                userValue={displayElevation}
                locale={locale}
              />
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
