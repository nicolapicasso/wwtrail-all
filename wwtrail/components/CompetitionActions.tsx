// components/CompetitionActions.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  competitionName,
  onStatusChange,
}: CompetitionActionsProps) {
  const router = useRouter();
  const t = useTranslations('cmpLayout');
  const { user } = useAuth();
  const resolvedCompetitionName = competitionName ?? t('thisCompetition');
  const { userCompetition, isMarked, refresh } = useCompetitionStatus(competitionId);
  const { markCompetition, unmarkCompetition } = useUserCompetitions();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <Button onClick={() => router.push('/auth/login')} variant="default">
        {t('loginToSave')}
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
        [UserCompetitionStatus.INTERESTED]: t('statusInterestedToast'),
        [UserCompetitionStatus.REGISTERED]: t('statusRegistered'),
        [UserCompetitionStatus.CONFIRMED]: t('statusConfirmed'),
        [UserCompetitionStatus.COMPLETED]: t('statusCompleted'),
        [UserCompetitionStatus.DNF]: t('statusDnfToast'),
        [UserCompetitionStatus.DNS]: t('statusDnsToast'),
      };

      toast.success(`${statusLabels[status]}: ${resolvedCompetitionName}`);
    } catch (error: any) {
      toast.error(error.message || t('errorMarking'));
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
      toast.success(t('competitionRemoved'));
    } catch (error: any) {
      toast.error(error.message || t('errorUnmarking'));
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
            {t('addToMyList')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => handleMark(UserCompetitionStatus.INTERESTED)}>
            <Star className="mr-2 h-4 w-4" />
            {t('statusInterested')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMark(UserCompetitionStatus.REGISTERED)}>
            <Check className="mr-2 h-4 w-4" />
            {t('meHeInscrito')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMark(UserCompetitionStatus.CONFIRMED)}>
            <Check className="mr-2 h-4 w-4 text-green-600" />
            {t('inscripcionConfirmada')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const statusLabels: Record<UserCompetitionStatus, string> = {
    [UserCompetitionStatus.INTERESTED]: t('statusInterested'),
    [UserCompetitionStatus.REGISTERED]: t('statusRegistered'),
    [UserCompetitionStatus.CONFIRMED]: t('statusConfirmed'),
    [UserCompetitionStatus.COMPLETED]: t('statusCompleted'),
    [UserCompetitionStatus.DNF]: t('statusDnf'),
    [UserCompetitionStatus.DNS]: t('statusDns'),
  };

  const currentStatusLabel = userCompetition?.status
    ? statusLabels[userCompetition.status]
    : t('enMiLista');

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
            {t('statusInterested')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMark(UserCompetitionStatus.REGISTERED)}>
            <Check className="mr-2 h-4 w-4" />
            {t('meHeInscrito')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMark(UserCompetitionStatus.CONFIRMED)}>
            <Check className="mr-2 h-4 w-4 text-green-600" />
            {t('inscripcionConfirmada')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleUnmark} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            {t('eliminarDeMiLista')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {userCompetition?.status !== UserCompetitionStatus.COMPLETED && (
        <Button
          variant="default"
          onClick={() => router.push(`/competitions/${competitionId}/add-result`)}
        >
          {t('anadirResultado')}
        </Button>
      )}
    </div>
  );
}
