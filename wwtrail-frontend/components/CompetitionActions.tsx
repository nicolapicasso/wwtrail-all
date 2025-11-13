// components/CompetitionActions.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Check, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useUserCompetitions, useCompetitionStatus } from '@/hooks/useUserCompetitions';
import { UserCompetitionStatus } from '@/types/user-competition';
import { toast } from 'sonner';

interface CompetitionActionsProps {
  competitionId: string;
  competitionName?: string;
  onStatusChange?: () => void;
}

export function CompetitionActions({
  competitionId,
  competitionName = 'esta competición',
  onStatusChange,
}: CompetitionActionsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { userCompetition, isMarked, refresh } = useCompetitionStatus(competitionId);
  const { markCompetition, unmarkCompetition } = useUserCompetitions();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <Button onClick={() => router.push('/auth/login')} variant="default">
        Iniciar sesión para guardar
      </Button>
    );
  }

  const handleMark = async (status: UserCompetitionStatus) => {
    try {
      setLoading(true);
      await markCompetition(competitionId, { status });
      refresh();
      onStatusChange?.();

      const statusLabels: Record<UserCompetitionStatus, string> = {
        [UserCompetitionStatus.INTERESTED]: 'Te interesa',
        [UserCompetitionStatus.REGISTERED]: 'Inscrito',
        [UserCompetitionStatus.CONFIRMED]: 'Confirmado',
        [UserCompetitionStatus.COMPLETED]: 'Completado',
        [UserCompetitionStatus.DNF]: 'No terminado',
        [UserCompetitionStatus.DNS]: 'No participado',
      };

      toast.success(`${statusLabels[status]}: ${competitionName}`);
    } catch (error: any) {
      toast.error(error.message || 'Error al marcar competición');
    } finally {
      setLoading(false);
    }
  };

  const handleUnmark = async () => {
    try {
      setLoading(true);
      await unmarkCompetition(competitionId);
      refresh();
      onStatusChange?.();
      toast.success('Competición eliminada de tu lista');
    } catch (error: any) {
      toast.error(error.message || 'Error al desmarcar competición');
    } finally {
      setLoading(false);
    }
  };

  if (!isMarked) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={loading} variant="default" className="gap-2">
            <Plus className="h-4 w-4" />
            Añadir a mi lista
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => handleMark(UserCompetitionStatus.INTERESTED)}>
            <Star className="mr-2 h-4 w-4" />
            Me interesa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMark(UserCompetitionStatus.REGISTERED)}>
            <Check className="mr-2 h-4 w-4" />
            Me he inscrito
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMark(UserCompetitionStatus.CONFIRMED)}>
            <Check className="mr-2 h-4 w-4 text-green-600" />
            Inscripción confirmada
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const statusLabels: Record<UserCompetitionStatus, string> = {
    [UserCompetitionStatus.INTERESTED]: 'Me interesa',
    [UserCompetitionStatus.REGISTERED]: 'Inscrito',
    [UserCompetitionStatus.CONFIRMED]: 'Confirmado',
    [UserCompetitionStatus.COMPLETED]: 'Completado',
    [UserCompetitionStatus.DNF]: 'No terminé',
    [UserCompetitionStatus.DNS]: 'No participé',
  };

  const currentStatusLabel = userCompetition?.status
    ? statusLabels[userCompetition.status]
    : 'En mi lista';

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={loading} variant="outline" className="gap-2">
            <Check className="h-4 w-4 text-green-600" />
            {currentStatusLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => handleMark(UserCompetitionStatus.INTERESTED)}>
            <Star className="mr-2 h-4 w-4" />
            Me interesa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMark(UserCompetitionStatus.REGISTERED)}>
            <Check className="mr-2 h-4 w-4" />
            Me he inscrito
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMark(UserCompetitionStatus.CONFIRMED)}>
            <Check className="mr-2 h-4 w-4 text-green-600" />
            Inscripción confirmada
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleUnmark} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar de mi lista
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {userCompetition?.status !== UserCompetitionStatus.COMPLETED && (
        <Button
          variant="default"
          onClick={() => router.push(`/competitions/${competitionId}/add-result`)}
        >
          Añadir resultado
        </Button>
      )}
    </div>
  );
}
