// components/UserCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { MapPin } from 'lucide-react';
import { PublicUser } from '@/lib/api/user.service';
import { getCountryName } from '@/lib/utils/countries';

interface UserCardProps {
  user: PublicUser;
  viewMode?: 'grid' | 'list';
}

// Deterministic avatar color + initials for users without an avatar.
const AVATAR_COLORS = ['#1f7a4d', '#173f6e', '#5a2018', '#3a2a5e', '#0e4a52', '#7a5a12', '#0e3f36', '#8a4b1f'];
function colorFor(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function initialsOf(name: string, fallback: string): string {
  const words = (name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return (fallback || '?').slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

const TopoHeader = () => (
  <div className="relative h-[120px] overflow-hidden bg-[#1a2225]">
    <div
      className="absolute inset-0"
      style={{ background: 'repeating-linear-gradient(115deg,#232d30 0 22px,#1c2528 22px 44px)' }}
      aria-hidden
    />
    <svg
      className="absolute inset-0 h-full w-full opacity-[.14]"
      preserveAspectRatio="none"
      viewBox="0 0 400 120"
      aria-hidden
    >
      <g fill="none" stroke="#2ea36a" strokeWidth="1.1">
        <path d="M0 95 Q100 65 200 82 T400 72" />
        <path d="M0 72 Q100 42 200 60 T400 48" />
        <path d="M0 50 Q100 22 200 40 T400 28" />
      </g>
    </svg>
  </div>
);

function Avatar({ user, size }: { user: PublicUser; size: number }) {
  const color = colorFor(user.username || user.fullName || 'x');
  const initials = initialsOf(user.fullName, user.username);
  return (
    <div
      className="mx-auto overflow-hidden rounded-full border-4 border-white bg-surface"
      style={{ width: size, height: size }}
    >
      {user.avatar ? (
        <div className="relative h-full w-full">
          <Image src={user.avatar} alt={user.fullName} fill className="object-cover" />
        </div>
      ) : (
        <span
          className="flex h-full w-full items-center justify-center font-black text-white"
          style={{ backgroundColor: color, fontSize: size * 0.31 }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}

function StatCell({ value, label, accent }: { value: number | string; label: string; accent?: boolean }) {
  return (
    <div>
      <div className={`font-stat text-[24px] font-bold leading-none ${accent ? 'text-orange-strong' : 'text-ink-2'}`}>
        {value}
      </div>
      <div className="mt-[3px] text-[10.5px] font-bold uppercase tracking-[0.08em] text-text-faint">{label}</div>
    </div>
  );
}

export default function UserCard({ user, viewMode = 'grid' }: UserCardProps) {
  const locale = useLocale();

  if (viewMode === 'list') {
    return (
      <Link
        href={`/${locale}/users/${user.username}`}
        className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 shadow-card transition-colors hover:border-green-brand"
      >
        <div className="relative shrink-0">
          <Avatar user={user} size={64} />
          {user.isInsider && (
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-orange-accent text-[11px]">
              ⭐
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[16px] font-extrabold text-ink-2">{user.fullName}</h3>
          <p className="text-[13.5px] font-semibold text-text-faint">@{user.username}</p>
          {(user.country || user.city) && (
            <div className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-text-muted">
              <MapPin className="h-3.5 w-3.5" />
              <span>
                {user.city ? `${user.city}, ` : ''}
                {user.country && getCountryName(user.country, locale)}
              </span>
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-6 text-center">
          <StatCell value={user.finishesCount} label="Finishes" />
          <StatCell value={user.participationsCount} label="Carreras" />
          {user.age != null && <StatCell value={user.age} label="Edad" accent />}
        </div>
      </Link>
    );
  }

  // Grid mode
  return (
    <Link
      href={`/${locale}/users/${user.username}`}
      className="block overflow-hidden rounded-[18px] border border-border bg-surface shadow-card transition-shadow hover:shadow-floating"
    >
      <div className="relative">
        <TopoHeader />
        {user.isInsider && (
          <span className="absolute right-3 top-3 rounded-pill bg-orange-accent px-2.5 py-1 text-[11px] font-extrabold text-[#241202]">
            ★ INSIDER
          </span>
        )}
      </div>
      <div className="-mt-[42px] px-5 pb-[22px] text-center">
        <Avatar user={user} size={84} />
        <div className="mt-3 text-[18px] font-extrabold text-ink-2">{user.fullName}</div>
        <div className="text-[13.5px] font-semibold text-text-faint">@{user.username}</div>
        {(user.country || user.city) && (
          <div className="mt-2 text-[13px] font-semibold text-text-muted">
            📍 {user.city ? `${user.city}, ` : ''}
            {user.country && getCountryName(user.country, locale)}
          </div>
        )}
        <div className="mt-[18px] flex justify-center gap-[26px] border-t border-hairline pt-[18px]">
          <StatCell value={user.finishesCount} label="Finishes" />
          <StatCell value={user.participationsCount} label="Carreras" />
          {user.age != null && <StatCell value={user.age} label="Edad" accent />}
        </div>
      </div>
    </Link>
  );
}
