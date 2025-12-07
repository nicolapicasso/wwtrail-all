'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { zancadasService, ZancadasBalance as BalanceType } from '@/lib/api/zancadas.service';
import { Footprints, RefreshCw, TrendingUp, Award } from 'lucide-react';
import { toast } from 'sonner';

interface ZancadasBalanceProps {
  onSyncComplete?: () => void;
}

export function ZancadasBalance({ onSyncComplete }: ZancadasBalanceProps) {
  const [balance, setBalance] = useState<BalanceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadBalance = useCallback(async () => {
    try {
      setLoading(true);
      const data = await zancadasService.getBalance();
      setBalance(data);
    } catch (error) {
      console.error('Error loading balance:', error);
      // Don't show error toast on initial load if Zancadas is not configured
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
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-primary-600">
            {balance.balance.toLocaleString()}
          </span>
          <span className="text-lg text-muted-foreground mb-1">puntos</span>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Acumula puntos con tus actividades</span>
          </div>
        </div>

        {balance.cardNumber && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="h-4 w-4" />
            <span>Tarjeta: {balance.cardNumber}</span>
          </div>
        )}

        {balance.syncedAt && (
          <p className="text-xs text-muted-foreground">
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
