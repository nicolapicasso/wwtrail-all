// app/[locale]/users/[username]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
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
  Star,
} from 'lucide-react';
import { userService, PublicUserProfile, UserParticipation } from '@/lib/api/user.service';
import { getCountryName, getCountryFlag } from '@/lib/utils/countries';
import { InsiderBadge } from '@/components/InsiderBadge';
import { useInsiderBadge } from '@/contexts/InsiderContext';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('pgAccount');
  const username = params.username as string;
  const { badgeUrl } = useInsiderBadge();

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
          setError(t('errorUserNotFound'));
        } else if (err.response?.status === 403) {
          setError(t('errorProfilePrivate'));
        } else {
          setError(t('errorLoadingProfile'));
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
      ? t('genderMale')
      : profile?.gender === 'FEMALE'
      ? t('genderFemale')
      : profile?.gender === 'NON_BINARY'
      ? t('genderNonBinary')
      : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-brand border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center">
        <div className="text-center">
          <UserIcon className="mx-auto mb-4 h-16 w-16 text-text-faint/40" />
          <h1 className="mb-2 text-[24px] font-black text-ink-2">{error}</h1>
          <button
            onClick={() => router.back()}
            className="mt-4 rounded-md bg-green-brand px-4 py-2 font-semibold text-white hover:brightness-95"
          >
            {t('back')}
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const isInsider = profile.isInsider;
  const heroBg = isInsider
    ? 'linear-gradient(105deg,#e8961f 0%,#d1631f 100%)'
    : 'linear-gradient(120deg,#173f6e 0%,#1f7a4d 100%)';
  const avatarColor = isInsider ? '#b9541a' : '#0e3f36';
  const initials = profileInitials(profile.fullName, profile.username);
  const hasSocials = !!(profile.instagramUrl || profile.facebookUrl || profile.twitterUrl || profile.youtubeUrl);

  return (
    <div className="min-h-screen bg-paper">
      {/* Hero */}
      <div className="relative h-[300px] overflow-hidden" style={{ background: heroBg }}>
        <svg className="absolute inset-0 h-full w-full opacity-[.16]" preserveAspectRatio="none" viewBox="0 0 1360 300" aria-hidden>
          <g fill="none" stroke="#fff" strokeWidth="1.2">
            <path d="M0 210 Q340 150 680 185 T1360 165" />
            <path d="M0 168 Q340 105 680 145 T1360 120" />
            <path d="M0 126 Q340 62 680 102 T1360 78" />
          </g>
        </svg>
        <div className="relative mx-auto flex h-full max-w-content flex-col justify-center px-6 text-white sm:px-8 lg:px-10">
          <button
            onClick={() => router.back()}
            className="absolute left-6 top-6 flex items-center gap-2 text-[14px] font-bold opacity-90 hover:opacity-100 sm:left-8 lg:left-10"
          >
            <ArrowLeft className="h-4 w-4" /> {t('back')}
          </button>

          <div className="flex flex-col items-center gap-7 md:flex-row md:items-center">
            {/* Avatar */}
            <div
              className="flex h-[132px] w-[132px] shrink-0 items-center justify-center rounded-[20px] border-4 border-white/50 text-[40px] font-black text-white shadow-floating"
              style={{ backgroundColor: profile.avatar ? undefined : avatarColor }}
            >
              {profile.avatar ? (
                <div className="relative h-full w-full overflow-hidden rounded-[16px]">
                  <Image src={profile.avatar} alt={profile.fullName} fill className="object-cover" />
                </div>
              ) : (
                initials
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                <h1 className="text-[36px] font-black leading-none tracking-[-0.02em] sm:text-[46px]">{profile.fullName}</h1>
                {isInsider && (
                  <span className="rounded-pill bg-orange-accent px-3.5 py-1.5 text-[13px] font-extrabold text-[#241202]">
                    ⭐ {t('insiderBadge')}
                  </span>
                )}
              </div>
              <div className="mt-1 text-[18px] font-semibold opacity-90">@{profile.username}</div>
              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[15px] font-semibold opacity-90 md:justify-start">
                {profile.country && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-lg">{getCountryFlag(profile.country)}</span>
                    {getCountryName(profile.country, locale)}
                  </span>
                )}
                {profile.city && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {profile.city}</span>}
                {genderLabel && <span>{genderLabel}</span>}
              </div>
              {hasSocials && (
                <div className="mt-4 flex items-center justify-center gap-2.5 md:justify-start">
                  {profile.instagramUrl && <SocialIcon href={profile.instagramUrl}><Instagram className="h-4 w-4" /></SocialIcon>}
                  {profile.facebookUrl && <SocialIcon href={profile.facebookUrl}><Facebook className="h-4 w-4" /></SocialIcon>}
                  {profile.twitterUrl && <SocialIcon href={profile.twitterUrl}><Twitter className="h-4 w-4" /></SocialIcon>}
                  {profile.youtubeUrl && <SocialIcon href={profile.youtubeUrl}><Youtube className="h-4 w-4" /></SocialIcon>}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-9 self-center">
              <HeroStat value={profile.stats.totalFinishes} label={t('statFinishes')} />
              <HeroStat value={profile.stats.totalParticipations} label={t('statRaces')} />
              <HeroStat value={profile.stats.totalDNF} label={t('statDNF')} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto grid max-w-content grid-cols-1 items-start gap-7 px-6 py-8 sm:px-8 lg:grid-cols-[360px_1fr] lg:px-10">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {profile.bio && (
            <div className="rounded-[18px] border border-border bg-surface p-6 shadow-card">
              <h2 className="mb-3 text-[20px] font-black text-ink-2">{t('aboutMe')}</h2>
              <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-text-muted">{profile.bio}</p>
            </div>
          )}

          <div className="rounded-[18px] border border-border bg-surface p-6 shadow-card">
            <h2 className="mb-4 text-[20px] font-black text-ink-2">{t('information')}</h2>
            <div className="flex flex-col">
              <InfoRow label={t('memberSince')} value={new Date(profile.createdAt).toLocaleDateString(locale, { year: 'numeric', month: 'long' })} />
              {profile.country && (
                <InfoRow
                  label={t('country')}
                  value={<span className="flex items-center gap-1.5">{getCountryFlag(profile.country)} {getCountryName(profile.country, locale)}</span>}
                />
              )}
              {profile.city && <InfoRow label={t('city')} value={profile.city} last />}
            </div>
          </div>

          {isInsider && (
            <div className="rounded-[18px] p-6 text-white" style={{ background: 'linear-gradient(135deg,#e8961f,#d1631f)' }}>
              <div className="mb-1.5 text-[17px] font-black">⭐ {t('insiderBadge')}</div>
              <p className="text-[13.5px] leading-[1.55] text-[#ffeacf]">
                {t('insiderDescription')}
              </p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="min-h-[380px] rounded-[18px] border border-border bg-surface p-[30px] shadow-card">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[22px] font-black tracking-[-0.01em] text-ink-2">{t('raceHistory')}</h2>
            <span className="text-[14px] font-semibold text-text-faint">{t('racesCount', { count: profile.participations.length })}</span>
          </div>

          {profile.participations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[70px] text-center">
              <div className="text-[56px] opacity-50">🏆</div>
              <div className="mt-3 text-[15px] font-semibold text-text-faint">{t('noParticipations')}</div>
              <Link
                href="/events"
                className="mt-5 rounded-md bg-green-brand px-[22px] py-3 text-[14px] font-extrabold text-white transition-[filter] hover:brightness-95"
              >
                {t('exploreRaces')} →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.participations.map((participation) => (
                <ParticipationCard key={participation.id} participation={participation} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="font-stat text-[44px] font-bold leading-none">{value}</div>
      <div className="mt-1 text-[12px] font-bold uppercase tracking-[0.08em] opacity-85">{label}</div>
    </div>
  );
}

function InfoRow({ label, value, last }: { label: string; value: React.ReactNode; last?: boolean }) {
  return (
    <div className={`flex justify-between py-[13px] ${last ? '' : 'border-b border-hairline'}`}>
      <span className="text-[14px] font-semibold text-text-muted">{label}</span>
      <span className="text-[14px] font-bold text-ink-2">{value}</span>
    </div>
  );
}

function SocialIcon({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
    >
      {children}
    </a>
  );
}

function profileInitials(name: string, fallback: string): string {
  const words = (name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return (fallback || '?').slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// Participation card component
function ParticipationCard({
  participation,
  locale,
}: {
  participation: UserParticipation;
  locale: string;
}) {
  const t = useTranslations('pgAccount');
  const isFinisher = participation.status === 'COMPLETED';
  const isDNF = participation.status === 'DNF';

  return (
    <Link href={`/${locale}/editions/${participation.edition.slug}`} className="block">
      <div className="rounded-lg border border-border p-4 transition-colors hover:border-green-brand hover:bg-[#fbfdfb]">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="font-extrabold text-ink-2">{participation.edition.competition.event.name}</h3>
              <span
                className={`rounded-pill px-2 py-0.5 text-[11px] font-bold ${
                  isFinisher
                    ? 'bg-green-tint-bg text-green-brand'
                    : isDNF
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-surface-alt text-text-muted'
                }`}
              >
                {isFinisher ? t('finisher') : isDNF ? t('statDNF') : participation.status}
              </span>
            </div>
            <p className="mb-2 text-[13.5px] text-text-muted">
              {participation.edition.competition.name} · {participation.edition.year}
            </p>
            <div className="flex items-center gap-1 text-[12px] text-text-faint">
              <Flag className="h-3 w-3" />
              {getCountryName(participation.edition.competition.event.country, locale)}
            </div>
          </div>

          {/* Results */}
          {isFinisher && (participation.finishTime || participation.position) && (
            <div className="text-right">
              {participation.position && (
                <div className="flex items-center justify-end gap-1 text-[14px]">
                  <Medal className="h-4 w-4 text-orange-accent" />
                  <span className="font-bold text-ink-2">#{participation.position}</span>
                </div>
              )}
              {participation.finishTime && (
                <div className="flex items-center justify-end gap-1 text-[14px] text-text-muted">
                  <Clock className="h-4 w-4" />
                  {participation.finishTime}
                </div>
              )}
              {participation.categoryPosition && participation.categoryType && (
                <div className="mt-1 text-[12px] text-text-faint">
                  {t('categoryAbbr')} #{participation.categoryPosition} (
                  {participation.categoryType === 'CATEGORY'
                    ? participation.categoryName
                    : participation.categoryType === 'MALE'
                    ? t('categoryMale')
                    : participation.categoryType === 'FEMALE'
                    ? t('categoryFemale')
                    : t('categoryGeneral')}
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
