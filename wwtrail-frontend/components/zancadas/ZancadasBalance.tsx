'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { zancadasService, ZancadasBalance as BalanceType } from '@/lib/api/zancadas.service';
import { Footprints, RefreshCw, Mountain, Route, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useLocale } from 'next-intl';

// Constantes de conversión
const ZANCADAS_PER_KM = 650;
const ZANCADAS_PER_1000M_ELEVATION = 1200;

interface EquivalentCompetition {
  id: string;
  name: string;
  slug: string;
  baseDistance: number;
  baseElevation: number;
  event: {
    slug: string;
    name: string;
  };
}

interface ZancadasBalanceProps {
  onSyncComplete?: () => void;
}

export function ZancadasBalance({ onSyncComplete }: ZancadasBalanceProps) {
  const [balance, setBalance] = useState<BalanceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [equivalentCompetition, setEquivalentCompetition] = useState<EquivalentCompetition | null>(null);
  const locale = useLocale();

  // Calcular equivalencias
  const equivalentKm = balance ? (balance.balance / ZANCADAS_PER_KM).toFixed(1) : '0';
  const equivalentElevation = balance ? Math.round((balance.balance / ZANCADAS_PER_1000M_ELEVATION) * 1000) : 0;

  const loadBalance = useCallback(async () => {
    try {
      setLoading(true);
      const data = await zancadasService.getBalance();
      setBalance(data);

      // Cargar competición equivalente si hay balance
      if (data && data.balance > 0) {
        try {
          const competition = await zancadasService.getEquivalentCompetition(data.balance);
          setEquivalentCompetition(competition);
        } catch (err) {
          // No mostrar error si no hay competición equivalente
          console.log('No equivalent competition found');
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
      });
      toast.success('Balance sincronizado correctamente');
      onSyncComplete?.();
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

        {/* Equivalencias */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
            <Route className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-semibold text-blue-700">{equivalentKm} km</p>
              <p className="text-xs text-blue-600">Distancia equivalente</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
            <Mountain className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-semibold text-green-700">{equivalentElevation.toLocaleString()} m</p>
              <p className="text-xs text-green-600">Desnivel+ equivalente</p>
            </div>
          </div>
        </div>

        {/* Competición equivalente */}
        {equivalentCompetition && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {balance.balance < ZANCADAS_PER_KM * 5
                  ? 'Tu próximo objetivo:'
                  : '¡Equivale a completar!'}
              </span>
            </div>
            <Link
              href={`/${locale}/events/${equivalentCompetition.event.slug}/${equivalentCompetition.slug}`}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg hover:from-yellow-100 hover:to-orange-100 transition-colors"
            >
              <div>
                <p className="font-semibold text-sm">{equivalentCompetition.name}</p>
                <p className="text-xs text-muted-foreground">
                  {equivalentCompetition.baseDistance} km • {equivalentCompetition.baseElevation?.toLocaleString() || 0} m D+
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{equivalentCompetition.event.name}</p>
              </div>
            </Link>
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
