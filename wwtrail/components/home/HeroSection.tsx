// components/home/HeroSection.tsx
// Redesigned hero: dark panel with diagonal hatch + topographic contour motif,
// eyebrow, large display H1, a search bar, a row of live stats, and (optional)
// background-image carousel with dots.

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface HeroSectionProps {
  images?: string[];
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  autoPlayInterval?: number;
}

interface Stat {
  value: number;
  label: string;
}

const DEFAULT_TITLE = 'Toda carrera de montaña del mundo, en un solo lugar.';
const DEFAULT_SUBTITLE =
  'Descubre eventos, competiciones y circuitos de trail running de todo el planeta.';
const DEFAULT_EYEBROW = 'La plataforma para trail runners';

// Reads a paginated total from a v2 list endpoint (limit=1), resilient to
// the two envelope shapes the API uses.
async function fetchTotal(path: string): Promise<number | null> {
  try {
    const res = await fetch(`${path}${path.includes('?') ? '&' : '?'}limit=1`);
    const json = await res.json();
    const data = json?.data ?? json;
    return (
      data?.pagination?.total ??
      data?.total ??
      (Array.isArray(data?.data) ? data.data.length : null)
    );
  } catch {
    return null;
  }
}

export function HeroSection({
  images = [],
  title,
  subtitle,
  eyebrow,
  autoPlayInterval = 6000,
}: HeroSectionProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [stats, setStats] = useState<Stat[]>([]);

  const heroImages = images.filter(Boolean);

  const goToNext = useCallback(() => {
    if (heroImages.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, [heroImages.length]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [goToNext, autoPlayInterval, heroImages.length]);

  // Live stats
  useEffect(() => {
    let active = true;
    (async () => {
      const [events, series, organizers] = await Promise.all([
        fetchTotal('/api/v2/events'),
        fetchTotal('/api/v2/special-series'),
        fetchTotal('/api/v2/organizers'),
      ]);
      if (!active) return;
      const next: Stat[] = [];
      if (events != null) next.push({ value: events, label: 'Eventos' });
      if (series != null) next.push({ value: series, label: 'Circuitos' });
      if (organizers != null) next.push({ value: organizers, label: 'Organizadores' });
      setStats(next);
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/events?search=${encodeURIComponent(q)}` : '/events');
  };

  return (
    <section className="relative min-h-[520px] w-full overflow-hidden bg-ink text-white">
      {/* Background image carousel (optional) */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
            index === currentIndex ? 'opacity-30' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden
        />
      ))}

      {/* Motif layers */}
      <div className="ww-hatch absolute inset-0" aria-hidden />
      <div className="ww-topo absolute inset-0 opacity-70" aria-hidden />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(15,19,21,.35), rgba(15,19,21,.85))' }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[520px] max-w-content flex-col justify-center px-6 py-20 sm:px-8 lg:px-10">
        <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.14em] text-orange-accent">
          {eyebrow || DEFAULT_EYEBROW}
        </p>
        <h1 className="max-w-4xl text-[40px] font-black leading-[0.98] tracking-[-0.03em] sm:text-[54px] lg:text-[64px]">
          {title || DEFAULT_TITLE}
        </h1>
        <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/70 sm:text-[18px]">
          {subtitle || DEFAULT_SUBTITLE}
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="mt-8 flex w-full max-w-2xl items-center gap-2 rounded-xl bg-surface p-2 shadow-elevated"
        >
          <div className="flex flex-1 items-center gap-2 pl-3">
            <Search className="h-5 w-5 shrink-0 text-text-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca un evento, ciudad o circuito…"
              className="w-full bg-transparent py-2.5 text-[15px] text-ink-2 outline-none placeholder:text-placeholder"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-green-brand px-6 py-2.5 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
          >
            Buscar
          </button>
        </form>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-8">
                {i > 0 && <span className="hidden h-8 w-px bg-white/15 sm:block" />}
                <div>
                  <span className="font-stat text-[34px] font-bold leading-none">
                    {s.value.toLocaleString('es-ES')}
                  </span>
                  <span className="ml-2 text-[13px] font-semibold uppercase tracking-wide text-white/60">
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Carousel dots */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-pill transition-all ${
                index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
