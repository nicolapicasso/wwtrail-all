'use client';

import { useState } from 'react';
import { Sparkles, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import aiAutofillService from '@/lib/api/v2/aiAutofill.service';
import editionsService from '@/lib/api/v2/editions.service';
import { toast } from 'sonner';

interface Props {
  competitionId: string;
  competitionName?: string;
  eventName?: string;
  eventWebsite?: string | null;
  baseDistance?: number | null;
  baseElevation?: number | null;
  onClose: () => void;
  onCreated?: () => void;
}

interface ReviewData {
  startDate: string;
  endDate: string;
  registrationOpenDate: string;
  registrationCloseDate: string;
  registrationUrl: string;
  distance: string;
  elevation: string;
  maxParticipants: string;
  priceEarly: string;
  priceNormal: string;
  priceLate: string;
}

const empty: ReviewData = {
  startDate: '', endDate: '', registrationOpenDate: '', registrationCloseDate: '',
  registrationUrl: '', distance: '', elevation: '', maxParticipants: '',
  priceEarly: '', priceNormal: '', priceLate: '',
};

export function AiEditionCreator({
  competitionId, competitionName, eventName, eventWebsite,
  baseDistance, baseElevation, onClose, onCreated,
}: Props) {
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [url, setUrl] = useState(eventWebsite || '');
  const [step, setStep] = useState<'input' | 'review'>('input');
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [data, setData] = useState<ReviewData>(empty);

  const search = async () => {
    setError(null); setNotes(null);
    const y = parseInt(year, 10);
    if (!y || y < 1900 || y > 2100) { setError('Indica un año válido.'); return; }
    if (!url.trim()) { setError('Indica la URL de la web del evento.'); return; }
    setSearching(true);
    try {
      const r = await aiAutofillService.autofillEdition(url.trim(), y, {
        competitionName, eventName, baseDistance, baseElevation,
      });
      if ((r as any).error) { setError((r as any).error); return; }
      const iso = (s?: string) => (s && /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : '');
      setData({
        startDate: iso(r.startDate),
        endDate: iso(r.endDate),
        registrationOpenDate: iso(r.registrationOpenDate),
        registrationCloseDate: iso(r.registrationCloseDate),
        registrationUrl: r.registrationUrl || '',
        distance: r.distance != null ? String(r.distance) : '',
        elevation: r.elevation != null ? String(r.elevation) : '',
        maxParticipants: r.maxParticipants != null ? String(r.maxParticipants) : '',
        priceEarly: r.prices?.early != null ? String(r.prices.early) : '',
        priceNormal: r.prices?.normal != null ? String(r.prices.normal) : '',
        priceLate: r.prices?.late != null ? String(r.prices.late) : '',
      });
      setNotes(r.notes || null);
      setStep('review');
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || 'No se pudo obtener la información.');
    } finally { setSearching(false); }
  };

  const create = async () => {
    setError(null);
    const y = parseInt(year, 10);
    if (!data.startDate) { setError('La fecha de inicio es obligatoria para crear la edición.'); return; }
    setCreating(true);
    try {
      const dt = (d: string) => (d ? new Date(d).toISOString() : undefined);
      const prices: any = {};
      if (data.priceEarly) prices.early = parseFloat(data.priceEarly);
      if (data.priceNormal) prices.normal = parseFloat(data.priceNormal);
      if (data.priceLate) prices.late = parseFloat(data.priceLate);

      await editionsService.create(competitionId, {
        year: y,
        language: 'ES' as any,
        startDate: dt(data.startDate),
        endDate: dt(data.endDate),
        distance: data.distance ? parseFloat(data.distance) : undefined,
        elevation: data.elevation ? parseInt(data.elevation, 10) : undefined,
        maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants, 10) : undefined,
        registrationUrl: data.registrationUrl || undefined,
        registrationOpenDate: dt(data.registrationOpenDate),
        registrationCloseDate: dt(data.registrationCloseDate),
        prices: Object.keys(prices).length ? prices : undefined,
      } as any);
      toast.success(`Edición ${y} creada.`);
      onCreated?.();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.response?.data?.error || 'No se pudo crear la edición.');
    } finally { setCreating(false); }
  };

  const set = (k: keyof ReviewData, v: string) => setData((d) => ({ ...d, [k]: v }));
  const inp = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm';
  const lbl = 'mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Crear edición con IA</h2>
              <p className="text-sm text-gray-500">{competitionName || 'Competición'}{eventName ? ` · ${eventName}` : ''}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4" />{error}</div>
        )}

        {step === 'input' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={lbl}>Año de la edición</label>
                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className={inp} />
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>URL a analizar</label>
                <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://web-del-evento.com" className={inp} />
              </div>
            </div>
            <p className="text-xs text-gray-400">Por defecto usa la web oficial del evento. Puedes pegar una URL más específica (p. ej. la página de inscripciones de esa edición).</p>
            <button onClick={search} disabled={searching} className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-60">
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {searching ? 'Buscando…' : 'Buscar con IA'}
            </button>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 text-sm text-purple-800">
              <p className="font-semibold">Se ha encontrado esta información de la edición {year}. Revísala y ajústala antes de crear.</p>
              {notes && <p className="mt-1 text-purple-700">{notes}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><label className={lbl}>Fecha inicio *</label><input type="date" value={data.startDate} onChange={(e) => set('startDate', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>Fecha fin</label><input type="date" value={data.endDate} onChange={(e) => set('endDate', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>Apertura inscripción</label><input type="date" value={data.registrationOpenDate} onChange={(e) => set('registrationOpenDate', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>Cierre inscripción</label><input type="date" value={data.registrationCloseDate} onChange={(e) => set('registrationCloseDate', e.target.value)} className={inp} /></div>
              <div className="sm:col-span-2"><label className={lbl}>URL de inscripción</label><input value={data.registrationUrl} onChange={(e) => set('registrationUrl', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>Distancia (km)</label><input value={data.distance} onChange={(e) => set('distance', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>Desnivel (m D+)</label><input value={data.elevation} onChange={(e) => set('elevation', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>Plazas máximas</label><input value={data.maxParticipants} onChange={(e) => set('maxParticipants', e.target.value)} className={inp} /></div>
              <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                <div><label className={lbl}>Precio early</label><input value={data.priceEarly} onChange={(e) => set('priceEarly', e.target.value)} className={inp} /></div>
                <div><label className={lbl}>Precio normal</label><input value={data.priceNormal} onChange={(e) => set('priceNormal', e.target.value)} className={inp} /></div>
                <div><label className={lbl}>Precio late</label><input value={data.priceLate} onChange={(e) => set('priceLate', e.target.value)} className={inp} /></div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={create} disabled={creating} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Crear edición {year}
              </button>
              <button onClick={() => setStep('input')} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Volver a buscar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AiEditionCreator;
