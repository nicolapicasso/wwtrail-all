// app/[locale]/calendar/page.tsx — Public competition calendar (editions by date)
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from '@/i18n/navigation';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  isSameMonth, isSameDay, addMonths, subMonths, format, parseISO,
  getMonth, isBefore, startOfDay,
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Search,
  LayoutGrid, List, CalendarDays, Mountain, TrendingUp,
} from 'lucide-react';
import CountrySelect from '@/components/CountrySelect';
import specialSeriesService from '@/lib/api/v2/specialSeries.service';

type CalView = 'month' | 'agenda' | 'year';

interface CalEdition {
  id: string;
  slug: string;
  year: number;
  startDate: string;
  endDate: string | null;
  distance: number | null;
  elevation: number | null;
  featured: boolean;
  registrationUrl: string | null;
  competition: {
    id: string;
    name: string;
    slug: string;
    type: string | null;
    baseDistance: number | null;
    baseElevation: number | null;
    event: {
      id: string;
      name: string;
      slug: string;
      country: string | null;
      city: string | null;
      logoUrl: string | null;
    };
  };
}

const effDistance = (e: CalEdition) => e.distance ?? e.competition.baseDistance ?? null;
const effElevation = (e: CalEdition) => e.elevation ?? e.competition.baseElevation ?? null;
const editionHref = (e: CalEdition) => `/events/${e.competition.event.slug}/${e.competition.slug}`;

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function CalendarPage() {
  const [editions, setEditions] = useState<CalEdition[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<CalView>('month');
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));

  // Filters
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [country, setCountry] = useState('');
  const [competitionType, setCompetitionType] = useState('');
  const [specialSeriesId, setSpecialSeriesId] = useState('');
  const [minDistance, setMinDistance] = useState('');
  const [maxDistance, setMaxDistance] = useState('');
  const [specialSeriesList, setSpecialSeriesList] = useState<any[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    specialSeriesService
      .getAll({ status: 'PUBLISHED', limit: 100 })
      .then((r: any) => {
        const raw = r?.data ?? r;
        setSpecialSeriesList(Array.isArray(raw) ? raw : raw?.data ?? []);
      })
      .catch(() => {});
  }, []);

  const fetchEditions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: '1000' });
      if (debounced) params.set('search', debounced);
      if (country) params.set('country', country);
      if (competitionType) params.set('competitionType', competitionType);
      if (specialSeriesId) params.set('specialSeriesId', specialSeriesId);
      if (minDistance) params.set('minDistance', minDistance);
      if (maxDistance) params.set('maxDistance', maxDistance);

      const res = await fetch(`/api/v2/editions/calendar?${params.toString()}`);
      const json = await res.json();
      const data = json?.data?.data ?? json?.data ?? [];
      setEditions(Array.isArray(data) ? data : []);
    } catch {
      setEditions([]);
    } finally {
      setLoading(false);
    }
  }, [debounced, country, competitionType, specialSeriesId, minDistance, maxDistance]);

  useEffect(() => {
    fetchEditions();
  }, [fetchEditions]);

  // Bucket editions by day (yyyy-MM-dd)
  const byDay = useMemo(() => {
    const map = new Map<string, CalEdition[]>();
    for (const e of editions) {
      if (!e.startDate) continue;
      const key = format(parseISO(e.startDate), 'yyyy-MM-dd');
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return map;
  }, [editions]);

  const competitionTypes = useMemo(() => {
    const s = new Set<string>();
    editions.forEach((e) => e.competition.type && s.add(e.competition.type));
    return Array.from(s).sort();
  }, [editions]);

  const hasActiveFilters = search || country || competitionType || specialSeriesId || minDistance || maxDistance;
  const clearFilters = () => {
    setSearch(''); setCountry(''); setCompetitionType(''); setSpecialSeriesId('');
    setMinDistance(''); setMaxDistance('');
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <div className="border-b border-hairline bg-surface">
        <div className="mx-auto max-w-content px-6 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-orange-strong">
                <CalendarIcon className="h-3.5 w-3.5" /> Calendario
              </span>
              <h1 className="text-[34px] font-black leading-none tracking-[-0.02em] text-ink-2 sm:text-[40px]">
                Próximas carreras
              </h1>
              <p className="mt-2 text-[15px] text-text-muted">
                Todas las ediciones con fecha confirmada · {editions.length} en total
              </p>
            </div>

            {/* View switch */}
            <div className="inline-flex rounded-md border border-border bg-surface p-1 shadow-card">
              {([
                { k: 'month', label: 'Mes', icon: LayoutGrid },
                { k: 'agenda', label: 'Agenda', icon: List },
                { k: 'year', label: 'Año', icon: CalendarDays },
              ] as { k: CalView; label: string; icon: any }[]).map(({ k, label, icon: Icon }) => (
                <button
                  key={k}
                  onClick={() => setView(k)}
                  className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                    view === k ? 'bg-green-brand text-white' : 'text-text-muted hover:text-ink-2'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto max-w-content px-6 pt-6 sm:px-8 lg:px-10">
        <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-faint" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar carrera o evento..."
                className="w-full rounded-md border border-border py-2 pl-10 pr-3 text-[14px] outline-none placeholder:text-placeholder focus:border-green-brand focus:ring-2 focus:ring-green-brand/30"
              />
            </div>
            <CountrySelect value={country} onChange={setCountry} placeholder="Todos los países" />
            <select
              value={competitionType}
              onChange={(e) => setCompetitionType(e.target.value)}
              className="rounded-md border border-border bg-surface px-3 py-2 text-[14px] outline-none focus:border-green-brand focus:ring-2 focus:ring-green-brand/30"
            >
              <option value="">Todos los tipos</option>
              {competitionTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={specialSeriesId}
              onChange={(e) => setSpecialSeriesId(e.target.value)}
              className="rounded-md border border-border bg-surface px-3 py-2 text-[14px] outline-none focus:border-green-brand focus:ring-2 focus:ring-green-brand/30"
            >
              <option value="">Todas las series</option>
              {specialSeriesList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className="flex items-center gap-2">
              <input
                type="number" min="0" value={minDistance}
                onChange={(e) => setMinDistance(e.target.value)}
                placeholder="Dist. min (km)"
                className="w-full rounded-md border border-border px-3 py-2 text-[14px] outline-none placeholder:text-placeholder focus:border-green-brand focus:ring-2 focus:ring-green-brand/30"
              />
              <input
                type="number" min="0" value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                placeholder="Dist. max (km)"
                className="w-full rounded-md border border-border px-3 py-2 text-[14px] outline-none placeholder:text-placeholder focus:border-green-brand focus:ring-2 focus:ring-green-brand/30"
              />
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="justify-self-start text-[13px] font-semibold text-green-brand hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-content px-6 py-6 sm:px-8 lg:px-10">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-brand border-t-transparent" />
          </div>
        ) : view === 'month' ? (
          <MonthView cursor={cursor} setCursor={setCursor} byDay={byDay} />
        ) : view === 'agenda' ? (
          <AgendaView editions={editions} />
        ) : (
          <YearView
            cursor={cursor}
            setCursor={setCursor}
            editions={editions}
            onPickMonth={(d) => { setCursor(d); setView('month'); }}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------- Month view ---------------- */
function MonthView({
  cursor, setCursor, byDay,
}: {
  cursor: Date;
  setCursor: (d: Date) => void;
  byDay: Map<string, CalEdition[]>;
}) {
  const gridStart = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const today = startOfDay(new Date());
  const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div>
      <MonthNav cursor={cursor} setCursor={setCursor} />
      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
        <div className="grid grid-cols-7 border-b border-hairline bg-surface-alt">
          {weekdays.map((d) => (
            <div key={d} className="px-2 py-2 text-center text-[11px] font-bold uppercase tracking-wide text-text-faint">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const items = byDay.get(key) || [];
            const inMonth = isSameMonth(day, cursor);
            const isToday = isSameDay(day, today);
            return (
              <div
                key={key}
                className={`min-h-[104px] border-b border-r border-hairline p-1.5 last:border-r-0 ${
                  inMonth ? 'bg-surface' : 'bg-surface-alt/40'
                }`}
              >
                <div className="mb-1 flex justify-end">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold ${
                      isToday ? 'bg-green-brand text-white' : inMonth ? 'text-ink-2' : 'text-text-faint'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="space-y-1">
                  {items.slice(0, 3).map((e) => (
                    <Link
                      key={e.id}
                      href={editionHref(e)}
                      title={`${e.competition.name} · ${e.competition.event.name}`}
                      className={`block truncate rounded-sm px-1.5 py-0.5 text-[11px] font-semibold leading-tight ${
                        e.featured
                          ? 'bg-orange-tint-bg text-orange-strong'
                          : 'bg-green-tint-bg text-green-brand'
                      } hover:brightness-95`}
                    >
                      {e.competition.name}
                    </Link>
                  ))}
                  {items.length > 3 && (
                    <span className="block px-1.5 text-[11px] font-semibold text-text-faint">
                      +{items.length - 3} más
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MonthNav({ cursor, setCursor }: { cursor: Date; setCursor: (d: Date) => void }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-[22px] font-black capitalize tracking-[-0.01em] text-ink-2">
        {format(cursor, 'LLLL yyyy', { locale: es })}
      </h2>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCursor(startOfMonth(new Date()))}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-[13px] font-semibold text-ink-2 hover:border-green-brand"
        >
          Hoy
        </button>
        <button
          onClick={() => setCursor(subMonths(cursor, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-ink-2 hover:border-green-brand"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => setCursor(addMonths(cursor, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-ink-2 hover:border-green-brand"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ---------------- Agenda view ---------------- */
function AgendaView({ editions }: { editions: CalEdition[] }) {
  const today = startOfDay(new Date());
  const upcoming = useMemo(
    () =>
      editions
        .filter((e) => e.startDate && !isBefore(parseISO(e.startDate), today))
        .sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()),
    [editions, today]
  );

  const groups = useMemo(() => {
    const map = new Map<string, CalEdition[]>();
    for (const e of upcoming) {
      const key = format(parseISO(e.startDate), 'yyyy-MM');
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries());
  }, [upcoming]);

  if (groups.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8">
      {groups.map(([key, items]) => {
        const d = parseISO(`${key}-01`);
        return (
          <div key={key}>
            <h3 className="mb-3 text-[16px] font-black capitalize tracking-[-0.01em] text-ink-2">
              {format(d, 'LLLL yyyy', { locale: es })}
              <span className="ml-2 text-[13px] font-semibold text-text-faint">{items.length}</span>
            </h3>
            <div className="space-y-2">
              {items.map((e) => (
                <AgendaRow key={e.id} e={e} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AgendaRow({ e }: { e: CalEdition }) {
  const d = parseISO(e.startDate);
  const dist = effDistance(e);
  const elev = effElevation(e);
  return (
    <Link
      href={editionHref(e)}
      className="flex items-center gap-4 rounded-lg border border-border bg-surface p-3 shadow-card transition-colors hover:border-green-brand"
    >
      {/* Date badge */}
      <div className={`flex w-14 shrink-0 flex-col items-center rounded-md py-1.5 ${
        e.featured ? 'bg-orange-tint-bg' : 'bg-green-tint-bg'
      }`}>
        <span className={`font-stat text-[22px] font-bold leading-none ${e.featured ? 'text-orange-strong' : 'text-green-brand'}`}>
          {format(d, 'd')}
        </span>
        <span className={`text-[11px] font-bold uppercase ${e.featured ? 'text-orange-strong' : 'text-green-brand'}`}>
          {format(d, 'LLL', { locale: es })}
        </span>
      </div>

      {/* Main */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate text-[16px] font-extrabold text-ink-2">{e.competition.name}</h4>
          {e.competition.type && (
            <span className="shrink-0 rounded-pill bg-surface-alt px-2 py-0.5 text-[11px] font-bold text-text-muted">
              {e.competition.type}
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-text-muted">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">
            {e.competition.event.name}
            {e.competition.event.city ? ` · ${e.competition.event.city}` : ''}
            {e.competition.event.country ? `, ${e.competition.event.country}` : ''}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden shrink-0 items-center gap-4 sm:flex">
        {dist != null && (
          <span className="flex items-center gap-1 font-stat text-[15px] font-bold text-ink-2">
            <Mountain className="h-4 w-4 text-text-faint" /> {dist}<span className="text-[12px] font-semibold text-text-faint">km</span>
          </span>
        )}
        {elev != null && (
          <span className="flex items-center gap-1 font-stat text-[15px] font-bold text-ink-2">
            <TrendingUp className="h-4 w-4 text-text-faint" /> {elev}<span className="text-[12px] font-semibold text-text-faint">m</span>
          </span>
        )}
      </div>
    </Link>
  );
}

/* ---------------- Year view ---------------- */
function YearView({
  cursor, setCursor, editions, onPickMonth,
}: {
  cursor: Date;
  setCursor: (d: Date) => void;
  editions: CalEdition[];
  onPickMonth: (d: Date) => void;
}) {
  const year = cursor.getFullYear();
  const counts = useMemo(() => {
    const arr = new Array(12).fill(0);
    for (const e of editions) {
      if (!e.startDate) continue;
      const d = parseISO(e.startDate);
      if (d.getFullYear() === year) arr[getMonth(d)]++;
    }
    return arr;
  }, [editions, year]);
  const max = Math.max(1, ...counts);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[22px] font-black text-ink-2">{year}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCursor(new Date(year - 1, 0, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-ink-2 hover:border-green-brand"
            aria-label="Año anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCursor(new Date(year + 1, 0, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-ink-2 hover:border-green-brand"
            aria-label="Año siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {MONTHS_ES.map((label, i) => {
          const count = counts[i];
          const pct = Math.round((count / max) * 100);
          return (
            <button
              key={label}
              onClick={() => onPickMonth(new Date(year, i, 1))}
              className="rounded-lg border border-border bg-surface p-4 text-left shadow-card transition-colors hover:border-green-brand"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] font-extrabold text-ink-2">{label}</span>
                <span className="font-stat text-[24px] font-bold text-green-brand">{count}</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-alt">
                <div className="h-full rounded-full bg-green-brand transition-all" style={{ width: `${pct}%` }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-border bg-surface p-16 text-center shadow-card">
      <CalendarIcon className="mx-auto mb-4 h-14 w-14 text-text-faint/50" />
      <h3 className="mb-1 text-[18px] font-extrabold text-ink-2">No hay carreras próximas</h3>
      <p className="text-[14px] text-text-muted">Prueba a ajustar los filtros o cambia de mes.</p>
    </div>
  );
}
