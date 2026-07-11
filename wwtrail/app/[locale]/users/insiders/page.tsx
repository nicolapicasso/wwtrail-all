'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, User, Globe } from 'lucide-react';
import { userService } from '@/lib/api/user.service';
import { COUNTRIES } from '@/lib/utils/countries';

interface InsiderData {
  config: {
    badgeUrl: string | null;
    introTextES: string | null;
    introTextEN: string | null;
    introTextIT: string | null;
    introTextCA: string | null;
    introTextFR: string | null;
    introTextDE: string | null;
  } | null;
  insiders: Array<{
    id: string;
    username: string;
    fullName: string;
    avatar: string | null;
    country: string | null;
    city: string | null;
    bio: string | null;
  }>;
  stats: {
    total: number;
    byCountry: Record<string, number>;
  };
}

export default function InsidersPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'es';

  const [data, setData] = useState<InsiderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await userService.getPublicInsiders();
        setData(result);
      } catch (err: any) {
        console.error('Error fetching insiders:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getIntroText = () => {
    if (!data?.config) return null;

    const textMap: Record<string, string | null> = {
      es: data.config.introTextES,
      en: data.config.introTextEN,
      it: data.config.introTextIT,
      ca: data.config.introTextCA,
      fr: data.config.introTextFR,
      de: data.config.introTextDE,
    };

    // Return text for current locale, or fallback to Spanish, or any available text
    return textMap[locale] || textMap['es'] || Object.values(textMap).find(t => t) || null;
  };

  const getCountryName = (code: string) => {
    const country = COUNTRIES.find((c) => c.code === code);
    return country?.name || code;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-strong border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-destructive">{error}</p>
          <button onClick={() => window.location.reload()} className="font-semibold text-green-brand hover:underline">
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  const introText = getIntroText();

  return (
    <div className="min-h-screen bg-paper">
      {/* Hero — gold/orange band */}
      <div
        className="relative h-[200px] overflow-hidden"
        style={{ background: 'linear-gradient(105deg,#e8961f 0%,#d1631f 100%)' }}
      >
        <svg className="absolute inset-0 h-full w-full opacity-[.15]" preserveAspectRatio="none" viewBox="0 0 1360 200" aria-hidden>
          <g fill="none" stroke="#fff" strokeWidth="1.2">
            <path d="M0 150 Q340 100 680 128 T1360 112" />
            <path d="M0 116 Q340 66 680 96 T1360 78" />
            <path d="M0 82 Q340 34 680 64 T1360 46" />
          </g>
        </svg>
        <div className="relative mx-auto flex h-full max-w-content items-center justify-center gap-6 px-6 text-white sm:px-8 lg:px-10">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[20px] border-2 border-white/40 bg-white/15 text-[40px]">
            {data?.config?.badgeUrl ? (
              <Image src={data.config.badgeUrl} alt="WWTrail Insider" width={64} height={64} className="object-contain" />
            ) : (
              '⛰️'
            )}
          </div>
          <div className="text-left">
            <h1 className="text-[36px] font-black leading-none tracking-[-0.02em] sm:text-[44px]">WWTrail Insiders</h1>
            <div className="mt-2.5 flex gap-6 text-[15px] font-bold opacity-95">
              <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {data?.stats?.total || 0} Insiders</span>
              <span className="flex items-center gap-1.5"><Globe className="h-4 w-4" /> {Object.keys(data?.stats?.byCountry || {}).length} Países</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-6 py-8 sm:px-8 lg:px-10">
        {/* Intro Text */}
        {introText && (
          <div className="mb-7 rounded-lg border border-border bg-surface p-6 shadow-card">
            <p className="whitespace-pre-line text-[15.5px] leading-[1.7] text-[#3a3f40]">{introText}</p>
          </div>
        )}

        {/* Insiders Grid */}
        {data?.insiders && data.insiders.length > 0 ? (
          <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
            {data.insiders.map((insider) => {
              const color = insiderColor(insider.username || insider.fullName);
              const ini = insiderInitials(insider.fullName, insider.username);
              return (
                <Link
                  key={insider.id}
                  href={`/users/${insider.username}`}
                  className="rounded-[18px] border border-border bg-surface p-7 text-center shadow-card transition-shadow hover:shadow-floating"
                >
                  <div className="relative mx-auto h-24 w-24">
                    {insider.avatar ? (
                      <div className="h-24 w-24 overflow-hidden rounded-full">
                        <Image src={insider.avatar} alt={insider.fullName} width={96} height={96} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <span
                        className="flex h-24 w-24 items-center justify-center rounded-full text-[30px] font-black text-white"
                        style={{ backgroundColor: color }}
                      >
                        {ini}
                      </span>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-[34px] w-[34px] items-center justify-center rounded-full border-[3px] border-white bg-orange-accent text-[15px]">
                      ⭐
                    </span>
                  </div>
                  <div className="mt-4 text-[19px] font-extrabold text-ink-2">{insider.fullName}</div>
                  <div className="text-[14px] font-bold text-orange-strong">@{insider.username}</div>
                  {(insider.city || insider.country) && (
                    <div className="mt-2.5 flex items-center justify-center gap-1 text-[13.5px] font-semibold text-text-muted">
                      <MapPin className="h-3.5 w-3.5" />
                      {[insider.city, insider.country && getCountryName(insider.country)].filter(Boolean).join(', ')}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Star className="mx-auto mb-4 h-16 w-16 text-text-faint/40" />
            <h2 className="mb-2 text-[20px] font-extrabold text-ink-2">Próximamente</h2>
            <p className="text-[15px] text-text-muted">
              Pronto conocerás a nuestros corresponsales especiales de trail running
            </p>
          </div>
        )}

        {/* Country Distribution */}
        {data?.stats?.byCountry && Object.keys(data.stats.byCountry).length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-center text-[20px] font-black text-ink-2">Insiders por País</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {Object.entries(data.stats.byCountry)
                .sort((a, b) => b[1] - a[1])
                .map(([code, count]) => (
                  <div key={code} className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-4 py-2 shadow-card">
                    <span className="font-semibold text-ink-2">{getCountryName(code)}</span>
                    <span className="text-[13px] text-text-faint">({count})</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Deterministic avatar color + initials for insiders without an avatar.
const INSIDER_COLORS = ['#b9541a', '#1f7a4d', '#173f6e', '#7a5a12', '#0e4a52', '#5a2018'];
function insiderColor(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return INSIDER_COLORS[h % INSIDER_COLORS.length];
}
function insiderInitials(name: string, fallback: string): string {
  const words = (name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return (fallback || '?').slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
