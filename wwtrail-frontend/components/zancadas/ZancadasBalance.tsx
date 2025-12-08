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
import { Footprints, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useLocale } from 'next-intl';

// Constantes de conversión (deben coincidir con el backend)
const METERS_PER_ZANCADA = 1.5;
const ELEVATION_METERS_PER_ZANCADA = 0.3;

interface ZancadasBalanceProps {
  onSyncComplete?: () => void;
}

// =============================================
// SVG SCALE COMPONENTS
// =============================================

/**
 * Escala de progreso de distancia con marcadores de competiciones
 */
function DistanceScaleBar({
  scale,
  locale
}: {
  scale: ScaleData;
  locale: string;
}) {
  const [hoveredComp, setHoveredComp] = useState<CompetitionMarker | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0 km</span>
        <span className="font-medium text-blue-600">{scale.userValue} km</span>
        <span>{scale.maxScale} km</span>
      </div>

      {/* Progress bar con marcadores */}
      <div className="relative h-8 bg-blue-50 rounded-full overflow-visible border border-blue-200">
        {/* Barra de progreso del usuario */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, scale.userProgress)}%` }}
        />

        {/* Marcadores de competiciones */}
        {scale.competitions.map((comp, idx) => (
          <div
            key={comp.id}
            className="absolute top-0 h-full flex items-center"
            style={{ left: `${comp.position}%`, transform: 'translateX(-50%)' }}
          >
            {/* Línea vertical */}
            <div className={`w-0.5 h-full ${comp.isCompleted ? 'bg-green-500' : 'bg-blue-300'}`} />

            {/* Marcador */}
            <div
              className={`absolute -top-3 cursor-pointer transition-transform hover:scale-125 ${
                comp.isCompleted ? 'text-green-500' : 'text-blue-400'
              }`}
              onMouseEnter={() => setHoveredComp(comp)}
              onMouseLeave={() => setHoveredComp(null)}
            >
              {comp.isCompleted ? (
                <span className="text-sm">✓</span>
              ) : (
                <span className="text-xs font-bold">{idx + 1}</span>
              )}
            </div>
          </div>
        ))}

        {/* Marcador del usuario */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-500"
          style={{ left: `${Math.min(100, scale.userProgress)}%`, transform: `translateX(-50%) translateY(-50%)` }}
        >
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <span className="text-[8px] text-white">🏃</span>
          </div>
        </div>
      </div>

      {/* Tooltip de competición hover */}
      {hoveredComp && (
        <div className="text-xs bg-white border rounded-lg p-2 shadow-lg">
          <p className="font-medium">{hoveredComp.name}</p>
          <p className="text-muted-foreground">{hoveredComp.baseDistance} km • {hoveredComp.event.name}</p>
        </div>
      )}

      {/* Lista de competiciones */}
      <div className="space-y-1 mt-3">
        {scale.competitions.map((comp, idx) => (
          <Link
            key={comp.id}
            href={`/${locale}/events/${comp.event.slug}/${comp.slug}`}
            className={`flex items-center gap-2 text-xs p-1.5 rounded hover:bg-gray-50 transition-colors ${
              comp.isCompleted ? 'text-green-700 bg-green-50' : 'text-gray-700'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              comp.isCompleted ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600'
            }`}>
              {comp.isCompleted ? '✓' : idx + 1}
            </span>
            <span className="flex-1 truncate">{comp.name}</span>
            <span className="text-muted-foreground">{comp.baseDistance} km</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Escala de progreso de desnivel con perfil de montaña
 */
function ElevationScaleBar({
  scale,
  locale
}: {
  scale: ScaleData;
  locale: string;
}) {
  const [hoveredComp, setHoveredComp] = useState<CompetitionMarker | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0 m</span>
        <span className="font-medium text-green-600">{scale.userValue.toLocaleString()} m D+</span>
        <span>{scale.maxScale.toLocaleString()} m</span>
      </div>

      {/* Perfil de montaña SVG */}
      <div className="relative h-16 bg-gradient-to-b from-green-50 to-green-100 rounded-lg overflow-visible border border-green-200">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 64" preserveAspectRatio="none">
          {/* Perfil de montaña base (gris) */}
          <path
            d="M0 64 L5 55 L15 60 L25 45 L35 55 L45 35 L55 50 L65 25 L75 40 L85 20 L95 35 L100 30 L100 64 Z"
            fill="#d1d5db"
            opacity="0.4"
          />

          {/* Clip path para el progreso */}
          <defs>
            <clipPath id="elevationProgressClip">
              <rect x="0" y="0" width={scale.userProgress} height="64" />
            </clipPath>
          </defs>

          {/* Perfil relleno (progreso) */}
          <path
            d="M0 64 L5 55 L15 60 L25 45 L35 55 L45 35 L55 50 L65 25 L75 40 L85 20 L95 35 L100 30 L100 64 Z"
            fill="url(#elevationGradient)"
            clipPath="url(#elevationProgressClip)"
          />

          <defs>
            <linearGradient id="elevationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>

          {/* Marcadores de competiciones */}
          {scale.competitions.map((comp, idx) => (
            <g key={comp.id}>
              {/* Línea vertical */}
              <line
                x1={comp.position}
                y1="0"
                x2={comp.position}
                y2="64"
                stroke={comp.isCompleted ? '#22c55e' : '#86efac'}
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
              {/* Bandera */}
              <g transform={`translate(${comp.position}, 5)`}>
                <polygon
                  points="0,0 6,3 0,6"
                  fill={comp.isCompleted ? '#22c55e' : '#60a5fa'}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredComp(comp)}
                  onMouseLeave={() => setHoveredComp(null)}
                />
                <line x1="0" y1="0" x2="0" y2="10" stroke={comp.isCompleted ? '#22c55e' : '#60a5fa'} strokeWidth="1" />
              </g>
            </g>
          ))}

          {/* Marcador del usuario (escalador) */}
          <g transform={`translate(${Math.min(98, scale.userProgress)}, 50)`}>
            <circle r="4" fill="#16a34a" stroke="white" strokeWidth="1" />
            <text x="0" y="1" textAnchor="middle" fontSize="4" fill="white">⛰</text>
          </g>
        </svg>
      </div>

      {/* Tooltip de competición hover */}
      {hoveredComp && (
        <div className="text-xs bg-white border rounded-lg p-2 shadow-lg">
          <p className="font-medium">{hoveredComp.name}</p>
          <p className="text-muted-foreground">{hoveredComp.baseElevation?.toLocaleString()} m D+ • {hoveredComp.event.name}</p>
        </div>
      )}

      {/* Lista de competiciones */}
      <div className="space-y-1 mt-3">
        {scale.competitions.map((comp, idx) => (
          <Link
            key={comp.id}
            href={`/${locale}/events/${comp.event.slug}/${comp.slug}`}
            className={`flex items-center gap-2 text-xs p-1.5 rounded hover:bg-gray-50 transition-colors ${
              comp.isCompleted ? 'text-green-700 bg-green-50' : 'text-gray-700'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              comp.isCompleted ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'
            }`}>
              {comp.isCompleted ? '✓' : idx + 1}
            </span>
            <span className="flex-1 truncate">{comp.name}</span>
            <span className="text-muted-foreground">{comp.baseElevation?.toLocaleString()} m</span>
          </Link>
        ))}
      </div>
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

  // Calcular equivalencias localmente
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
            {/* Escala de distancia */}
            {equivalentData.distanceScale.competitions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-1">
                  📍 Progreso en distancia
                </h4>
                <DistanceScaleBar scale={equivalentData.distanceScale} locale={locale} />
              </div>
            )}

            {/* Escala de desnivel */}
            {equivalentData.elevationScale.competitions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                  ⛰️ Progreso en desnivel
                </h4>
                <ElevationScaleBar scale={equivalentData.elevationScale} locale={locale} />
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
