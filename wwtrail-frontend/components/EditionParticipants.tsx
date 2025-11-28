'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Medal,
  ArrowRight,
  Trophy,
} from 'lucide-react';
import { userService } from '@/lib/api/user.service';

interface Participant {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  avatar: string | null;
  country: string | null;
  status: string;
  finishTime: string | null;
  position: number | null;
  categoryPosition: number | null;
  categoryType: string | null;
  categoryName: string | null;
}

interface EditionParticipantsProps {
  editionId: string;
  editionYear?: number;
  competitionName?: string;
  maxDisplay?: number;
}

export function EditionParticipants({
  editionId,
  editionYear,
  competitionName,
  maxDisplay = 10,
}: EditionParticipantsProps) {
  const locale = useLocale();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const data = await userService.getEditionParticipants(editionId);
        setParticipants(data);
      } catch (err: any) {
        console.error('Error fetching participants:', err);
        setError('Error al cargar los participantes');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [editionId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Participantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return null; // Don't show the component if there's an error
  }

  if (participants.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Participantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 mb-2">
              No hay participantes registrados
            </p>
            <p className="text-sm text-gray-400">
              ¿Participaste en esta edición? Regístrate y añade tu participación
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayedParticipants = participants.slice(0, maxDisplay);
  const remainingCount = participants.length - maxDisplay;

  // Stats
  const finisherCount = participants.filter((p) => p.status === 'COMPLETED').length;
  const dnfCount = participants.filter((p) => p.status === 'DNF').length;

  const getCategoryLabel = (type: string | null, name: string | null) => {
    if (!type) return null;
    switch (type) {
      case 'GENERAL':
        return 'General';
      case 'MALE':
        return 'Masculina';
      case 'FEMALE':
        return 'Femenina';
      case 'CATEGORY':
        return name || 'Categoría';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Participantes ({participants.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">{finisherCount}</span>
            <span className="text-gray-500">Finisher</span>
          </div>
          {dnfCount > 0 && (
            <div className="flex items-center gap-1 text-orange-600">
              <XCircle className="w-4 h-4" />
              <span className="font-medium">{dnfCount}</span>
              <span className="text-gray-500">DNF</span>
            </div>
          )}
        </div>

        {/* Participants List */}
        <div className="space-y-2">
          {displayedParticipants.map((participant) => (
            <Link
              key={participant.id}
              href={`/${locale}/users/${participant.username}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                  {participant.avatar ? (
                    <Image
                      src={participant.avatar}
                      alt={participant.fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {participant.fullName || participant.username}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>@{participant.username}</span>
                    {participant.country && (
                      <>
                        <span>•</span>
                        <span>{participant.country}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status & Results */}
              <div className="flex items-center gap-3">
                {participant.status === 'COMPLETED' ? (
                  <>
                    {participant.finishTime && (
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        {participant.finishTime}
                      </span>
                    )}
                    {participant.position && (
                      <span className="flex items-center gap-1 text-sm font-medium text-yellow-600">
                        <Medal className="w-3 h-3" />
                        #{participant.position}
                      </span>
                    )}
                    {participant.categoryPosition && participant.categoryType && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {getCategoryLabel(participant.categoryType, participant.categoryName)}{' '}
                        #{participant.categoryPosition}
                      </span>
                    )}
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-orange-600">
                    <XCircle className="w-5 h-5" />
                    DNF
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Show More */}
        {remainingCount > 0 && (
          <div className="text-center pt-2">
            <p className="text-sm text-gray-500">
              Y {remainingCount} participante{remainingCount > 1 ? 's' : ''} más...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default EditionParticipants;
