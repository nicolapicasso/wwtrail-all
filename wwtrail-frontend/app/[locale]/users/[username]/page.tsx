// app/[locale]/users/[username]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import {
  User as UserIcon,
  MapPin,
  Calendar,
  Trophy,
  Clock,
  Medal,
  ExternalLink,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ArrowLeft,
  Flag,
} from 'lucide-react';
import { userService, PublicUserProfile, UserParticipation } from '@/lib/api/user.service';
import { getCountryName, getCountryFlag } from '@/lib/utils/countries';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const username = params.username as string;

  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userService.getPublicProfile(username);
        setProfile(data);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        if (err.response?.status === 404) {
          setError('Usuario no encontrado');
        } else if (err.response?.status === 403) {
          setError('Este perfil es privado');
        } else {
          setError('Error al cargar el perfil');
        }
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  const genderLabel =
    profile?.gender === 'MALE'
      ? 'Hombre'
      : profile?.gender === 'FEMALE'
      ? 'Mujer'
      : profile?.gender === 'NON_BINARY'
      ? 'No binario'
      : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>

          {/* Profile header */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-white shadow-lg">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <UserIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-1">{profile.fullName}</h1>
              <p className="text-white/80 text-lg mb-3">@{profile.username}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/90">
                {profile.country && (
                  <span className="flex items-center gap-1">
                    <span className="text-xl">{getCountryFlag(profile.country)}</span>
                    {getCountryName(profile.country, locale)}
                  </span>
                )}
                {profile.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.city}
                  </span>
                )}
                {profile.age && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {profile.age} años
                  </span>
                )}
                {genderLabel && <span>{genderLabel}</span>}
              </div>

              {/* Social links */}
              {(profile.instagramUrl ||
                profile.facebookUrl ||
                profile.twitterUrl ||
                profile.youtubeUrl) && (
                <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                  {profile.instagramUrl && (
                    <a
                      href={profile.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {profile.facebookUrl && (
                    <a
                      href={profile.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {profile.twitterUrl && (
                    <a
                      href={profile.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {profile.youtubeUrl && (
                    <a
                      href={profile.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 md:ml-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">{profile.stats.totalFinishes}</div>
                <div className="text-white/80 text-sm">Finishes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{profile.stats.totalParticipations}</div>
                <div className="text-white/80 text-sm">Carreras</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{profile.stats.totalDNF}</div>
                <div className="text-white/80 text-sm">DNF</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Bio */}
          <div className="lg:col-span-1">
            {profile.bio && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Sobre mí</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Información</h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Miembro desde</dt>
                  <dd className="text-gray-900">
                    {new Date(profile.createdAt).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </dd>
                </div>
                {profile.country && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">País</dt>
                    <dd className="text-gray-900 flex items-center gap-1">
                      <span>{getCountryFlag(profile.country)}</span>
                      {getCountryName(profile.country, locale)}
                    </dd>
                  </div>
                )}
                {profile.city && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Ciudad</dt>
                    <dd className="text-gray-900">{profile.city}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Right column - Participations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Historial de carreras
                </h2>
                <span className="text-sm text-gray-500">
                  {profile.participations.length} carreras
                </span>
              </div>

              {profile.participations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No hay participaciones registradas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.participations.map((participation) => (
                    <ParticipationCard
                      key={participation.id}
                      participation={participation}
                      locale={locale}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Participation card component
function ParticipationCard({
  participation,
  locale,
}: {
  participation: UserParticipation;
  locale: string;
}) {
  const isFinisher = participation.status === 'COMPLETED';
  const isDNF = participation.status === 'DNF';

  return (
    <Link
      href={`/${locale}/events/${participation.edition.competition.event.slug}/${participation.edition.competition.slug}/${participation.edition.year}`}
    >
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">
                {participation.edition.competition.event.name}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  isFinisher
                    ? 'bg-green-100 text-green-700'
                    : isDNF
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {isFinisher ? 'Finisher' : isDNF ? 'DNF' : participation.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {participation.edition.competition.name} - {participation.edition.year}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Flag className="w-3 h-3" />
              {getCountryName(participation.edition.competition.event.country, locale)}
            </div>
          </div>

          {/* Results */}
          {isFinisher && (participation.finishTime || participation.position) && (
            <div className="text-right">
              {participation.position && (
                <div className="flex items-center gap-1 text-sm">
                  <Medal className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">#{participation.position}</span>
                </div>
              )}
              {participation.finishTime && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {participation.finishTime}
                </div>
              )}
              {participation.categoryPosition && participation.categoryType && (
                <div className="text-xs text-gray-500 mt-1">
                  Cat. #{participation.categoryPosition} (
                  {participation.categoryType === 'CATEGORY'
                    ? participation.categoryName
                    : participation.categoryType === 'MALE'
                    ? 'Masculina'
                    : participation.categoryType === 'FEMALE'
                    ? 'Femenina'
                    : 'General'}
                  )
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
