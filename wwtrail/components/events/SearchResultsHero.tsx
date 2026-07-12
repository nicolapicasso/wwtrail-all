// components/events/SearchResultsHero.tsx
// Shown in the events hero when there is a ?search= query: performs a real
// cross-entity search (events + competitions + services) and renders result
// cards. Falls back to a friendly empty state.

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { MapPin, Calendar, Flag, Building2, Loader2 } from 'lucide-react';
import eventsService from '@/lib/api/v2/events.service';
import competitionsService from '@/lib/api/v2/competitions.service';
import servicesService from '@/lib/api/v2/services.service';
import { EventStatus } from '@/types/event';

type ResultType = 'event' | 'competition' | 'service';
interface Result {
  id: string;
  type: ResultType;
  name: string;
  href: string;
  place: string;
  img: string | null;
}

const TYPE_META: Record<ResultType, { labelKey: string; icon: any }> = {
  event: { labelKey: 'typeEvent', icon: Calendar },
  competition: { labelKey: 'typeCompetition', icon: Flag },
  service: { labelKey: 'typeService', icon: Building2 },
};

function toArray(res: any): any[] {
  if (Array.isArray(res)) return res;
  return res?.data ?? res?.competitions ?? [];
}

export function SearchResultsHero({ search }: { search: string }) {
  const t = useTranslations('cmpLayout');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const [ev, comp, svc] = await Promise.allSettled([
          eventsService.getAll({ search, limit: 8, status: EventStatus.PUBLISHED }),
          competitionsService.getAll({ search, limit: 8 }),
          servicesService.getAll({ search, limit: 8, status: 'PUBLISHED' } as any),
        ]);

        const out: Result[] = [];

        if (ev.status === 'fulfilled') {
          for (const e of toArray(ev.value)) {
            out.push({
              id: `e-${e.id}`, type: 'event', name: e.name,
              href: `/events/${e.slug}`,
              place: [e.city, e.country].filter(Boolean).join(', '),
              img: e.coverImage || e.coverImageUrl || e.logo || e.logoUrl || null,
            });
          }
        }
        if (comp.status === 'fulfilled') {
          for (const c of toArray(comp.value)) {
            if (!c.event?.slug) continue;
            out.push({
              id: `c-${c.id}`, type: 'competition', name: c.name,
              href: `/events/${c.event.slug}/${c.slug}`,
              place: [c.event?.city, c.event?.country].filter(Boolean).join(', '),
              img: c.coverImage || c.logoUrl || c.event?.coverImage || c.event?.logoUrl || null,
            });
          }
        }
        if (svc.status === 'fulfilled') {
          for (const s of toArray(svc.value)) {
            out.push({
              id: `s-${s.id}`, type: 'service', name: s.name,
              href: `/services/${s.slug}`,
              place: [s.city, s.country].filter(Boolean).join(', '),
              img: s.coverImage || s.logoUrl || s.imageUrl || null,
            });
          }
        }

        if (active) setResults(out);
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [search]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-white/70">
        <Loader2 className="h-5 w-5 animate-spin" /> {t('searching', { search })}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-[16px] font-semibold text-white">{t('noResultsFor', { search })}</p>
        <p className="mt-1 text-[14px] text-white/60">{t('noResultsHint')}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-[14px] text-white/70">
        {t.rich('resultsCountFor', {
          count: results.length,
          search,
          b: (chunks) => <span className="font-bold text-white">{chunks}</span>,
        })}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.slice(0, 9).map((r) => {
          const meta = TYPE_META[r.type];
          const Icon = meta.icon;
          return (
            <Link
              key={r.id}
              href={r.href}
              className="group relative flex min-h-[150px] flex-col justify-end overflow-hidden rounded-xl border border-white/10"
            >
              {r.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.img} alt={r.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 bg-surface-alt" />
              )}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(15,19,21,.85))' }} />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-pill bg-black/50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                <Icon className="h-3 w-3" /> {t(meta.labelKey)}
              </span>
              <div className="relative p-4">
                {r.place && (
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-white/75">
                    <MapPin className="h-3.5 w-3.5" /> {r.place}
                  </span>
                )}
                <h3 className="mt-1 text-[17px] font-extrabold leading-tight text-white">{r.name}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SearchResultsHero;
