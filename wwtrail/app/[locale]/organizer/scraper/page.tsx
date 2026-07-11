'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Globe, Loader2, Sparkles, Search, AlertCircle, CheckCircle2, Link2, ClipboardPaste,
  Calendar, Trophy, MapPin, ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClientV2 } from '@/lib/api/client';

type FetchMode = 'auto' | 'static' | 'render' | 'paste';

interface Edition {
  year: number;
  startDate?: string | null;
  endDate?: string | null;
  distance?: number | null;
  elevation?: number | null;
  registrationUrl?: string | null;
  existing?: { id: string } | null;
}
interface MatchInfo { id: string; slug?: string; name: string; score: number; reason: string; }
interface Competition {
  name: string;
  description?: string | null;
  type?: string | null;
  baseDistance?: number | null;
  baseElevation?: number | null;
  itraPoints?: number | null;
  editions: Edition[];
  existing?: { id: string; slug: string } | null;
  suggestion?: MatchInfo | null;
  _include?: boolean; // client-only
}
interface EventNode {
  name: string;
  country?: string | null;
  city?: string | null;
  website?: string | null;
  description?: string | null;
  typicalMonth?: number | null;
  firstEditionYear?: number | null;
  existing?: { id: string; slug: string; name: string } | null;
  suggestion?: MatchInfo | null;
}
interface Graph { event: EventNode; competitions: Competition[]; }
interface ScanResult { sourceUrl: string | null; fetchMode: FetchMode; title: string | null; graph: Graph; warnings: string[]; }

export default function ScraperPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<FetchMode>('auto');
  const [html, setHtml] = useState('');
  const [scanning, setScanning] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [graph, setGraph] = useState<Graph | null>(null);
  const [importResult, setImportResult] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) router.push('/organizer');
  }, [user, authLoading, router]);

  const runScan = async () => {
    setError(null); setImportResult(null); setScan(null); setGraph(null);
    if (mode === 'paste' ? !html.trim() : !url.trim()) {
      setError(mode === 'paste' ? 'Pega el HTML de la página' : 'Introduce una URL');
      return;
    }
    try {
      setScanning(true);
      const res = await apiClientV2.post('/admin/scraper/scan', { url, html, mode });
      const data: ScanResult = res.data?.data || res.data;
      // Default-include all non-existing competitions
      data.graph.competitions.forEach((c) => (c._include = !c.existing));
      setScan(data);
      setGraph(data.graph);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error al escanear');
    } finally {
      setScanning(false);
    }
  };

  const runImport = async () => {
    if (!graph) return;
    setError(null);
    try {
      setImporting(true);
      const payload = { graph: { ...graph, competitions: graph.competitions.filter((c) => c._include || c.existing) } };
      const res = await apiClientV2.post('/admin/scraper/import', payload);
      setImportResult(res.data?.data || res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error al importar');
    } finally {
      setImporting(false);
    }
  };

  const setEvent = (patch: Partial<EventNode>) => graph && setGraph({ ...graph, event: { ...graph.event, ...patch } });
  const setComp = (i: number, patch: Partial<Competition>) => {
    if (!graph) return;
    const comps = [...graph.competitions];
    comps[i] = { ...comps[i], ...patch };
    setGraph({ ...graph, competitions: comps });
  };

  const promoteEventSuggestion = () => {
    const s = graph?.event.suggestion;
    if (s) setEvent({ existing: { id: s.id, slug: s.slug || '', name: s.name }, suggestion: null });
  };
  const promoteCompSuggestion = (i: number) => {
    const s = graph?.competitions[i]?.suggestion;
    if (s) setComp(i, { existing: { id: s.id, slug: s.slug || '' }, suggestion: null, _include: false });
  };

  if (authLoading) {
    return <div className="flex min-h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-text-faint" /></div>;
  }
  if (!user || user.role !== 'ADMIN') return null;

  const newComps = graph?.competitions.filter((c) => !c.existing).length || 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Sparkles className="h-7 w-7 text-green-brand" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Importador con IA</h1>
          <p className="text-sm text-gray-500">Escanea una web de carreras y extrae eventos, competiciones y ediciones</p>
        </div>
      </div>

      {/* Input card */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        {/* Mode tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {([
            { k: 'auto', label: 'Auto', icon: Sparkles },
            { k: 'static', label: 'Estático', icon: Link2 },
            { k: 'render', label: 'Render (SPA)', icon: Globe },
            { k: 'paste', label: 'Pegar HTML', icon: ClipboardPaste },
          ] as { k: FetchMode; label: string; icon: any }[]).map(({ k, label, icon: Icon }) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ${
                mode === k ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {mode !== 'paste' ? (
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://ejemplo.com/calendario-trail-2026"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
          />
        ) : (
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="Pega aquí el HTML de la página (Ctrl+U → copiar todo)…"
            rows={6}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 font-mono text-xs outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
          />
        )}
        {mode === 'render' && (
          <p className="mt-2 text-xs text-amber-600">
            El render headless requiere playwright-core instalado en el servidor. Si no está, usa «Pegar HTML».
          </p>
        )}

        <button
          onClick={runScan}
          disabled={scanning}
          className="mt-4 flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
        >
          {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {scanning ? 'Escaneando…' : 'Escanear'}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Warnings */}
      {scan?.warnings?.length ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {scan.warnings.map((w, i) => <div key={i}>• {w}</div>)}
        </div>
      ) : null}

      {/* Import result */}
      {importResult && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-5">
          <div className="mb-2 flex items-center gap-2 font-semibold text-green-800">
            <CheckCircle2 className="h-5 w-5" /> Importación completada
          </div>
          <div className="text-sm text-green-900">
            Evento: <b>{importResult.event.created ? 'creado' : 'reutilizado'}</b> ·{' '}
            Competiciones creadas: <b>{importResult.competitions.filter((c: any) => c.created).length}</b> ·{' '}
            Ediciones creadas: <b>{importResult.editions.filter((e: any) => e.created).length}</b>
          </div>
          {importResult.event.slug && (
            <a href={`/events/${importResult.event.slug}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:underline">
              Ver evento <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Preview / review */}
      {graph && graph.event.name && !importResult && (
        <div className="space-y-4">
          {/* Event */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Calendar className="h-5 w-5 text-green-600" /> Evento
              </h2>
              {graph.event.existing ? (
                <span className="flex items-center gap-2 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                  Ya existe · se reutilizará
                  <button onClick={() => setEvent({ existing: null })} className="text-blue-500 underline">deshacer</button>
                </span>
              ) : graph.event.suggestion ? (
                <div className="flex items-center gap-2 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
                  <span title={graph.event.suggestion.reason}>¿Es «{graph.event.suggestion.name}»? ({Math.round(graph.event.suggestion.score * 100)}%)</span>
                  <button onClick={promoteEventSuggestion} className="rounded bg-amber-600 px-2 py-0.5 text-white">Sí, usar</button>
                  <button onClick={() => setEvent({ suggestion: null })} className="text-amber-700 underline">No, es nuevo</button>
                </div>
              ) : (
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">Nuevo</span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Nombre"><input value={graph.event.name} onChange={(e) => setEvent({ name: e.target.value })} className={inputCls} /></Field>
              <Field label="País (ISO-2)"><input value={graph.event.country || ''} onChange={(e) => setEvent({ country: e.target.value.toUpperCase().slice(0, 2) })} className={inputCls} /></Field>
              <Field label="Ciudad"><input value={graph.event.city || ''} onChange={(e) => setEvent({ city: e.target.value })} className={inputCls} /></Field>
              <Field label="Web"><input value={graph.event.website || ''} onChange={(e) => setEvent({ website: e.target.value })} className={inputCls} /></Field>
              <Field label="Primera edición (año)"><input type="number" value={graph.event.firstEditionYear ?? ''} onChange={(e) => setEvent({ firstEditionYear: e.target.value ? Number(e.target.value) : null })} className={inputCls} /></Field>
              <Field label="Mes habitual (1-12)"><input type="number" min="1" max="12" value={graph.event.typicalMonth ?? ''} onChange={(e) => setEvent({ typicalMonth: e.target.value ? Number(e.target.value) : null })} className={inputCls} /></Field>
            </div>
          </div>

          {/* Competitions */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
              <Trophy className="h-5 w-5 text-green-600" /> Competiciones ({graph.competitions.length})
            </h2>
            <div className="space-y-3">
              {graph.competitions.map((c, i) => (
                <div key={i} className={`rounded-lg border p-3 ${c.existing ? 'border-gray-200 bg-gray-50' : c.suggestion ? 'border-amber-200 bg-amber-50/40' : 'border-green-200'}`}>
                  <div className="flex items-center gap-3">
                    {!c.existing && (
                      <input type="checkbox" checked={!!c._include} onChange={(e) => setComp(i, { _include: e.target.checked })} className="h-4 w-4" style={{ accentColor: '#1f7a4d' }} />
                    )}
                    <input value={c.name} onChange={(e) => setComp(i, { name: e.target.value })} className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm font-semibold" />
                    {c.existing ? (
                      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
                        Existe
                        <button onClick={() => setComp(i, { existing: null, _include: true })} className="text-blue-500 underline">deshacer</button>
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700">Nueva</span>
                    )}
                  </div>
                  {c.suggestion && !c.existing && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 rounded-md bg-amber-100/60 px-2 py-1.5 pl-7 text-xs text-amber-900">
                      <span title={c.suggestion.reason}>Posible duplicado: <b>{c.suggestion.name}</b> ({Math.round(c.suggestion.score * 100)}% · {c.suggestion.reason})</span>
                      <button onClick={() => promoteCompSuggestion(i)} className="rounded bg-amber-600 px-2 py-0.5 font-semibold text-white">Sí, es la misma</button>
                      <button onClick={() => setComp(i, { suggestion: null })} className="underline">No, es nueva</button>
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2 pl-7 text-sm">
                    <label className="flex items-center gap-1 text-gray-500">Dist.
                      <input type="number" value={c.baseDistance ?? ''} onChange={(e) => setComp(i, { baseDistance: e.target.value ? Number(e.target.value) : null })} className="w-16 rounded border border-gray-300 px-1.5 py-0.5" /> km</label>
                    <label className="flex items-center gap-1 text-gray-500">Desnivel
                      <input type="number" value={c.baseElevation ?? ''} onChange={(e) => setComp(i, { baseElevation: e.target.value ? Number(e.target.value) : null })} className="w-20 rounded border border-gray-300 px-1.5 py-0.5" /> m</label>
                    {c.type && <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">{c.type}</span>}
                  </div>
                  {c.editions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 pl-7">
                      {c.editions.map((ed, j) => (
                        <span key={j} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${ed.existing ? 'bg-gray-100 text-gray-500' : ed.startDate ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                          <MapPin className="h-3 w-3" />{ed.year}{ed.startDate ? ` · ${ed.startDate}` : ' · sin fecha'}{ed.existing ? ' · existe' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Import action */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <span className="text-sm text-gray-600">
              {graph.event.existing ? 'Se reutilizará el evento' : 'Se creará el evento'} · {newComps} competición(es) nueva(s)
            </span>
            <button
              onClick={runImport}
              disabled={importing}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
            >
              {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {importing ? 'Importando…' : 'Importar al portal'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = 'w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-400">{label}</span>
      {children}
    </label>
  );
}
