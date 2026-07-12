// components/SpecialSeriesCard.tsx - Special series card (redesign)

'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SpecialSeriesListItem } from '@/types/v2';
import { Trophy, Globe, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpecialSeriesCardProps {
  specialSeries: SpecialSeriesListItem;
  onClick?: () => void;
  className?: string;
}

// Deterministic header color derived from the series name.
const HEADER_COLORS = [
  '#1f7a4d', '#173f6e', '#8a4b1f', '#5b3b8c', '#0f6e6e', '#a13a3a', '#3a6ea1', '#7a6a1f',
];
function colorFor(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return HEADER_COLORS[h % HEADER_COLORS.length];
}

function abbreviate(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.slice(0, 3).map((w) => w[0]).join('').toUpperCase();
}

export function SpecialSeriesCard({ specialSeries, onClick, className = '' }: SpecialSeriesCardProps) {
  const t = useTranslations('cmp');
  const bg = colorFor(specialSeries.slug || specialSeries.name);
  const count = specialSeries._count?.competitions;

  const content = (
    <div
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-shadow hover:shadow-floating',
        className
      )}
    >
      {/* Colored header */}
      <div
        className="relative flex h-32 items-center justify-center"
        style={{ backgroundColor: bg }}
      >
        {specialSeries.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={specialSeries.logoUrl} alt={specialSeries.name} className="max-h-20 max-w-[70%] object-contain" />
        ) : (
          <span className="font-stat text-[44px] font-bold leading-none tracking-tight text-white/95">
            {abbreviate(specialSeries.name)}
          </span>
        )}
        {count !== undefined && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-pill bg-black/25 px-2.5 py-1 text-[12px] font-bold text-white backdrop-blur-sm">
            <Trophy className="h-3.5 w-3.5" /> {count}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-[18px] font-extrabold text-ink-2 group-hover:text-green-brand">
          {specialSeries.name}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-[13px] text-text-muted">
          <Globe className="h-4 w-4" />
          <span>{specialSeries.country}</span>
          {count !== undefined && (
            <>
              <span className="text-text-faint">·</span>
              <span>{t('competitionsCount', { count })}</span>
            </>
          )}
        </div>
        <div className="mt-4 flex items-center gap-1 pt-1 text-[13px] font-extrabold text-green-brand opacity-0 transition-opacity group-hover:opacity-100">
          {t('viewSeries')} <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return <Link href={`/special-series/${specialSeries.slug}`}>{content}</Link>;
}
