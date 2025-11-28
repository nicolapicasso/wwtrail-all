// components/UserCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { MapPin, Trophy, Flag, User as UserIcon } from 'lucide-react';
import { PublicUser } from '@/lib/api/user.service';
import { getCountryName } from '@/lib/utils/countries';

interface UserCardProps {
  user: PublicUser;
  viewMode?: 'grid' | 'list';
}

export default function UserCard({ user, viewMode = 'grid' }: UserCardProps) {
  const locale = useLocale();

  const genderLabel = user.gender === 'MALE' ? 'Hombre' :
                      user.gender === 'FEMALE' ? 'Mujer' :
                      user.gender === 'NON_BINARY' ? 'No binario' : null;

  if (viewMode === 'list') {
    return (
      <Link href={`/${locale}/users/${user.username}`}>
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
          {/* Avatar */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.fullName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{user.fullName}</h3>
            <p className="text-sm text-gray-500">@{user.username}</p>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              {user.country && (
                <span className="flex items-center gap-1">
                  <Flag className="w-3 h-3" />
                  {getCountryName(user.country, locale)}
                </span>
              )}
              {user.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {user.city}
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-lg font-bold text-gray-900">{user.finishesCount}</p>
              <p className="text-xs text-gray-500">Finishes</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{user.participationsCount}</p>
              <p className="text-xs text-gray-500">Carreras</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid mode
  return (
    <Link href={`/${locale}/users/${user.username}`}>
      <div className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
        {/* Avatar Section */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white shadow-lg">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <UserIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-center mb-3">
            <h3 className="font-semibold text-gray-900 text-lg">{user.fullName}</h3>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>

          {/* Location */}
          {(user.country || user.city) && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4" />
              <span>
                {user.city ? `${user.city}, ` : ''}
                {user.country && getCountryName(user.country, locale)}
              </span>
            </div>
          )}

          {/* Bio preview */}
          {user.bio && (
            <p className="text-sm text-gray-600 text-center mb-3 line-clamp-2">
              {user.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex justify-center gap-6 pt-3 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold text-gray-900">
                <Trophy className="w-4 h-4 text-yellow-500" />
                {user.finishesCount}
              </div>
              <p className="text-xs text-gray-500">Finishes</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{user.participationsCount}</p>
              <p className="text-xs text-gray-500">Carreras</p>
            </div>
            {user.age && (
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{user.age}</p>
                <p className="text-xs text-gray-500">Edad</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
