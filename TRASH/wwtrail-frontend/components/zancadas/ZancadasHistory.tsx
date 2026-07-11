'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { zancadasService, ZancadasTransaction } from '@/lib/api/zancadas.service';
import { History, ChevronDown, UserPlus, LogIn, Star, Trophy, Footprints } from 'lucide-react';

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  REGISTER: UserPlus,
  LOGIN: LogIn,
  RATING: Star,
  PARTICIPATION: Trophy,
};

const ACTION_LABELS: Record<string, string> = {
  REGISTER: 'Registro',
  LOGIN: 'Inicio de sesión',
  RATING: 'Valoración',
  PARTICIPATION: 'Participación',
};

interface ZancadasHistoryProps {
  refreshTrigger?: number;
}

export function ZancadasHistory({ refreshTrigger }: ZancadasHistoryProps) {
  const [transactions, setTransactions] = useState<ZancadasTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageSize = 10;

  const loadTransactions = useCallback(async (pageNum: number, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const data = await zancadasService.getTransactions(pageNum, pageSize);

      if (append) {
        setTransactions((prev) => [...prev, ...data]);
      } else {
        setTransactions(data);
      }

      setHasMore(data.length === pageSize);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    loadTransactions(1, false);
  }, [loadTransactions, refreshTrigger]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadTransactions(nextPage, true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Historial de Zancadas</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Footprints className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-muted-foreground">
              Aún no tienes transacciones de Zancadas
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Participa en carreras, valora ediciones y gana puntos
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">Historial de Zancadas</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.map((transaction) => {
          const Icon = ACTION_ICONS[transaction.actionCode] || Footprints;
          const isPositive = transaction.points > 0;

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                  <Icon className={`h-4 w-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {ACTION_LABELS[transaction.actionCode] || transaction.actionCode}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={isPositive ? 'default' : 'destructive'}
                  className={isPositive ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  {isPositive ? '+' : ''}{transaction.points}
                </Badge>
                {transaction.syncStatus === 'PENDING' && (
                  <Badge variant="outline" className="text-xs">
                    Pendiente
                  </Badge>
                )}
                {transaction.syncStatus === 'FAILED' && (
                  <Badge variant="destructive" className="text-xs">
                    Error
                  </Badge>
                )}
              </div>
            </div>
          );
        })}

        {hasMore && (
          <div className="pt-2">
            <Button
              variant="ghost"
              className="w-full"
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                'Cargando...'
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Ver más
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
