'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiClientV2 } from '@/lib/api/client';
import { Mail, Save, RotateCcw, Loader2, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import EventSelect from '@/components/EventSelect';
import eventsService from '@/lib/api/v2/events.service';
import competitionsService from '@/lib/api/v2/competitions.service';

const TYPES = [
  { key: 'WELCOME', label: 'Bienvenida (invitación al crear evento)' },
  { key: 'REMINDER', label: 'Recordatorio (T‑60 / T‑30)' },
  { key: 'MAGAZINE', label: 'Magazine (post‑evento)' },
];
const LANGS = ['ES', 'EN', 'IT', 'CA', 'FR', 'DE'];

// Sample values so the preview shows something realistic.
const SAMPLE: Record<string, string> = {
  eventName: 'Ultra Trail Ejemplo',
  competitionName: 'Maratón 42K',
  days: '30',
  link: 'https://wwtrail.com/es/organizer/events',
};

function renderVars(str: string, vars: Record<string, string>) {
  return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => (vars[k] ?? ''));
}

export default function OutreachTemplatesPage() {
  const [type, setType] = useState('WELCOME');
  const [language, setLanguage] = useState('ES');
  const [subject, setSubject] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Send-test state
  const [events, setEvents] = useState<Array<{ id: string; name: string; city?: string; country?: string }>>([]);
  const [testEventId, setTestEventId] = useState('');
  const [competitions, setCompetitions] = useState<Array<{ id: string; name: string }>>([]);
  const [testCompetitionId, setTestCompetitionId] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testMsg, setTestMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res: any = await eventsService.getAll({ limit: 1000 });
        const list = res?.data || res?.events || res || [];
        setEvents(Array.isArray(list) ? list : []);
      } catch { setEvents([]); }
    })();
  }, []);

  useEffect(() => {
    if (!testEventId) { setCompetitions([]); setTestCompetitionId(''); return; }
    (async () => {
      try {
        const comps = await competitionsService.getByEvent(testEventId);
        setCompetitions((comps || []).map((c: any) => ({ id: c.id, name: c.name })));
      } catch { setCompetitions([]); }
      setTestCompetitionId('');
    })();
  }, [testEventId]);

  const sendTest = async () => {
    setTestMsg(null);
    if (!testEmail) { setTestMsg({ ok: false, text: 'Indica un email de destino.' }); return; }
    setSendingTest(true);
    try {
      await apiClientV2.post('/admin/outreach-templates/test', {
        language, subject, htmlBody,
        eventId: testEventId || undefined,
        competitionId: testCompetitionId || undefined,
        to: testEmail,
      });
      setTestMsg({ ok: true, text: `Prueba enviada a ${testEmail}.` });
    } catch (e: any) {
      setTestMsg({ ok: false, text: e?.response?.data?.error || 'No se pudo enviar la prueba.' });
    } finally {
      setSendingTest(false);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await apiClientV2.get(`/admin/outreach-templates?type=${type}&language=${language}`);
      const d = res.data?.data ?? res.data;
      setSubject(d.subject);
      setHtmlBody(d.htmlBody);
      setVariables(d.variables || []);
      setIsCustom(d.isCustom);
    } catch {
      setMsg({ ok: false, text: 'No se pudo cargar la plantilla.' });
    } finally {
      setLoading(false);
    }
  }, [type, language]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await apiClientV2.put('/admin/outreach-templates', { type, language, subject, htmlBody });
      const d = res.data?.data ?? res.data;
      setIsCustom(d.isCustom);
      setMsg({ ok: true, text: 'Plantilla guardada.' });
    } catch (e: any) {
      setMsg({ ok: false, text: e?.response?.data?.error || 'No se pudo guardar.' });
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm('¿Restaurar el texto por defecto para este tipo e idioma? Se perderá tu personalización.')) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await apiClientV2.delete(`/admin/outreach-templates?type=${type}&language=${language}`);
      const d = res.data?.data ?? res.data;
      setSubject(d.subject);
      setHtmlBody(d.htmlBody);
      setIsCustom(d.isCustom);
      setMsg({ ok: true, text: 'Restaurado al texto por defecto.' });
    } catch {
      setMsg({ ok: false, text: 'No se pudo restaurar.' });
    } finally {
      setSaving(false);
    }
  };

  const previewHtml = renderVars(htmlBody, SAMPLE);
  const previewSubject = renderVars(subject, SAMPLE);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-3">
        <Mail className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plantillas de email</h1>
          <p className="text-gray-600">Edita los correos automáticos por tipo e idioma. Si no personalizas uno, se usa el texto por defecto.</p>
        </div>
      </div>

      {/* Selectors */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Tipo</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            {TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Idioma</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${isCustom ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
            {isCustom ? 'Personalizada' : 'Texto por defecto'}
          </span>
        </div>
      </div>

      {msg && (
        <div className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-sm ${msg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}{msg.text}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Editor */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Asunto</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Cuerpo (HTML)</label>
              <textarea value={htmlBody} onChange={(e) => setHtmlBody(e.target.value)} rows={16} className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs" />
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Variables disponibles</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {variables.map((v) => (
                  <code key={v} className="rounded bg-white px-2 py-1 text-xs text-blue-700 ring-1 ring-gray-200">{`{{${v}}}`}</code>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-400">Escribe la variable entre dobles llaves y se sustituirá al enviar.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Guardar
              </button>
              {isCustom && (
                <button onClick={reset} disabled={saving} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <RotateCcw className="h-4 w-4" /> Restaurar por defecto
                </button>
              )}
            </div>
          </div>

          {/* Preview */}
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">Vista previa</p>
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="mb-2 text-xs text-gray-500">Asunto: <span className="font-semibold text-gray-800">{previewSubject}</span></p>
              <iframe title="preview" srcDoc={previewHtml} className="h-[420px] w-full rounded border border-gray-100" />
            </div>

            {/* Send test */}
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Send className="h-4 w-4 text-blue-600" /> Enviar prueba
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                Envía este correo (con el contenido actual del editor) a un email, usando los datos reales del evento/competición que elijas.
              </p>
              <div className="mt-3 space-y-2">
                <EventSelect
                  value={testEventId}
                  onChange={setTestEventId}
                  events={events.map((e) => ({ id: e.id, name: e.name, city: e.city, country: e.country }))}
                  placeholder="Evento (opcional)…"
                  showAllOption
                  allOptionLabel="— Sin evento (datos de ejemplo) —"
                />
                {type !== 'WELCOME' && (
                  <select
                    value={testCompetitionId}
                    onChange={(e) => setTestCompetitionId(e.target.value)}
                    disabled={!testEventId}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                  >
                    <option value="">{testEventId ? 'Competición (opcional)…' : 'Elige un evento primero'}</option>
                    {competitions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Email de destino"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <button
                  onClick={sendTest}
                  disabled={sendingTest}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {sendingTest ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Enviar prueba
                </button>
                {testMsg && (
                  <p className={`text-sm font-semibold ${testMsg.ok ? 'text-green-600' : 'text-red-600'}`}>{testMsg.text}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
