// components/EditionStats.tsx - Statistics component for editions

'use client';

import { EditionStats as EditionStatsType } from '@/types/v2';
import { Users, Trophy, Star, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';

interface EditionStatsProps {
  stats: EditionStatsType;
  loading?: boolean;
  className?: string;
}

export function EditionStats({ stats, loading, className = '' }: EditionStatsProps) {
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-24 rounded-lg bg-gray-200" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="h-20 rounded-lg bg-gray-200" />
            <div className="h-20 rounded-lg bg-gray-200" />
            <div className="h-20 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      icon: Users,
      label: 'Total Participants',
      value: stats.totalParticipants,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: CheckCircle2,
      label: 'Finishers',
      value: stats.totalFinishers || 0,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: Star,
      label: 'Reviews',
      value: stats.totalReviews,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      icon: Trophy,
      label: 'Categories',
      value: stats.totalCategories || 0,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: TrendingUp,
      label: 'Results',
      value: stats.totalResults || 0,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      icon: Calendar,
      label: 'View Count',
      value: stats.viewCount,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600',
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main stat - Average Rating */}
      {stats.averageRating !== null && (
        <div className="rounded-lg border bg-gradient-to-r from-yellow-50 to-orange-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-yellow-600">
                  {stats.averageRating.toFixed(1)}
                </span>
                <span className="text-lg text-muted-foreground">/ 5.0</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <Star
                  key={rating}
                  className={`h-5 w-5 ${
                    rating <= Math.round(stats.averageRating!)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Registration Status */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Registration Status</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {stats.currentParticipants} / {stats.maxParticipants || '∞'}
              </span>
            </div>
            {stats.maxParticipants && (
              <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-green-600 transition-all"
                  style={{
                    width: `${Math.min(
                      (stats.currentParticipants / stats.maxParticipants) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              {stats.maxParticipants
                ? `${stats.maxParticipants - stats.currentParticipants} spots remaining`
                : 'Unlimited spots'}
            </p>
          </div>
          <div>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                stats.registrationStatus === 'OPEN'
                  ? 'bg-green-100 text-green-800'
                  : stats.registrationStatus === 'FULL'
                  ? 'bg-orange-100 text-orange-800'
                  : stats.registrationStatus === 'COMING_SOON'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {stats.registrationStatus.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Other Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="font-medium">Competition</p>
            <p className="text-muted-foreground">{stats.competitionName}</p>
          </div>
          <div>
            <p className="font-medium">Edition Year</p>
            <p className="text-muted-foreground">{stats.year}</p>
          </div>
          <div>
            <p className="font-medium">Status</p>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                stats.status === 'UPCOMING'
                  ? 'bg-blue-100 text-blue-800'
                  : stats.status === 'ONGOING'
                  ? 'bg-green-100 text-green-800'
                  : stats.status === 'FINISHED'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {stats.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact version for cards
interface EditionStatsCompactProps {
  stats: Partial<EditionStatsType>;
  className?: string;
}

export function EditionStatsCompact({ stats, className = '' }: EditionStatsCompactProps) {
  return (
    <div className={`flex items-center gap-4 text-xs text-muted-foreground ${className}`}>
      {stats.totalParticipants !== undefined && (
        <div className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          <span>{stats.totalParticipants}</span>
        </div>
      )}
      {stats.totalReviews !== undefined && (
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5" />
          <span>{stats.totalReviews}</span>
        </div>
      )}
      {stats.averageRating !== null && stats.averageRating !== undefined && (
        <div className="flex items-center gap-1">
          <span className="font-semibold text-yellow-600">{stats.averageRating.toFixed(1)}</span>
          <span>/5</span>
        </div>
      )}
    </div>
  );
}
