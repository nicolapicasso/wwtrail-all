'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiClientV2 } from '@/lib/api/client';
import { Megaphone, Upload, Send, Users, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const LANGS = ['', 'ES', 'EN', 'IT', 'CA', 'FR', 'DE'];

// Parse pasted CSV / email list → import rows.
function parseRows(text: string) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const rows: any[] = [];
  for (const line of lines) {
    const parts = line.split(/[;,\t]/).map((p) => p.trim());
    const email = parts[0];
    if (!email || !email.includes('@')) continue; // skip header/invalid
    rows.push({ email, firstName: parts[1] || undefined, lastName: parts[2] || undefined, country: parts[3] || undefined, language: parts[4] || undefined });
  }
  return rows;
}

export default function MarketingPage() {
  // Import
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Compose / broadcast
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('<p>Hola {{firstName}},</p>\n<p>...</p>');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');
  const [audience, setAudience] = useState<number | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [busy, setBusy] = useState<'' | 'test' | 'dry' | 'send'>('');
  const [sendMsg, setSendMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const loadAudience = useCallback(async () => {
    try {
      const res = await apiClientV2.get(`/admin/marketing/segment?country=${country}&language=${language}`);
      setAudience((res.data?.data ?? res.data)?.count ?? null);
    } catch { setAudience(null); }
  }, [country, language]);

  useEffect(() => { loadAudience(); }, [loadAudience]);

  const doImport = async () => {
    const rows = parseRows(importText);
    if (rows.length === 0) { setImportMsg({ ok: false, text: 'No se detectaron emails válidos.' }); return; }
    setImporting(true); setImportMsg(null);
    try {
      const res = await apiClientV2.post('/admin/marketing/import', { rows });
      const d = res.data?.data ?? res.data;
      setImportMsg({ ok: true, text: `Importados: ${d.created} nuevos, ${d.updated} actualizados, ${d.skipped} omitidos.` });
      loadAudience();
    } catch (e: any) {
      setImportMsg({ ok: false, text: e?.response?.data?.error || 'Error al importar.' });
    } finally { setImporting(false); }
  };

  const previewHtml = html.replace(/\{\{\s*firstName\s*\}\}/g, 'Nombre');

  const sendTest = async () => {
    if (!testEmail) { setSendMsg({ ok: false, text: 'Indica un email de prueba.' }); return; }
    setBusy('test'); setSendMsg(null);
    try {
      await apiClientV2.post('/admin/marketing/test', { subject, html, to: testEmail, language: language || 'ES' });
      setSendMsg({ ok: true, text: `Prueba enviada a ${testEmail}.` });
    } catch (e: any) { setSendMsg({ ok: false, text: e?.response?.data?.error || 'Error al enviar la prueba.' }); }
    finally { setBusy(''); }
  };

  const broadcast = async (dryRun: boolean) => {
    if (!subject || !html) { setSendMsg({ ok: false, text: 'Asunto y cuerpo son obligatorios.' }); return; }
    if (!dryRun && !confirm(`Vas a enviar a ${audience ?? '?'} personas. ¿Continuar?`)) return;
    setBusy(dryRun ? 'dry' : 'send'); setSendMsg(null);
    try {
      const res = await apiClientV2.post('/admin/marketing/broadcast', { subject, html, filters: { country: country || undefined, language: language || undefined }, dryRun });
      const d = res.data?.data ?? res.data;
      setSendMsg({ ok: true, text: dryRun ? `Simulación: se enviaría a ${d.total} personas.` : `Enviado a ${d.sent} de ${d.total}.` });
    } catch (e: any) { setSendMsg({ ok: false, text: e?.response?.data?.error || 'Error al enviar.' }); }
    finally { setBusy(''); }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-3">
        <Megaphone className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing</h1>
          <p className="text-gray-600">Importa usuarios consentidos y envía campañas a los suscritos. Todos los correos llevan enlace de baja.</p>
        </div>
      </div>

      {/* Import */}
      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-gray-900"><Upload className="h-5 w-5 text-blue-600" /> Importar usuarios (consentimiento heredado)</h2>
        <p className="mb-3 text-sm text-gray-500">Pega una línea por usuario. Formato: <code>email,nombre,apellido,país(ISO2),idioma</code> (solo el email es obligatorio). Se marcan como suscritos.</p>
        <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={6}
          placeholder="ana@example.com,Ana,García,ES,ES&#10;joe@example.com" className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs" />
        <div className="mt-3 flex items-center gap-3">
          <button onClick={doImport} disabled={importing} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Importar
          </button>
          {importMsg && <span className={`text-sm font-semibold ${importMsg.ok ? 'text-green-600' : 'text-red-600'}`}>{importMsg.text}</span>}
        </div>
      </section>

      {/* Compose */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900"><Send className="h-5 w-5 text-blue-600" /> Nueva campaña</h2>

        <div className="mb-4 flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">País (ISO2)</label>
            <input value={country} onChange={(e) => setCountry(e.target.value.toUpperCase().slice(0, 2))} placeholder="Todos" className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Idioma</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {LANGS.map((l) => <option key={l} value={l}>{l || 'Todos'}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
            <Users className="h-4 w-4" /> {audience ?? '—'} destinatarios
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Asunto</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Cuerpo (HTML)</label>
              <textarea value={html} onChange={(e) => setHtml(e.target.value)} rows={12} className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs" />
              <p className="mt-1 text-xs text-gray-400">Variables: <code>{'{{firstName}}'}</code>. El enlace de baja se añade automáticamente al pie.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="Email de prueba" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <button onClick={sendTest} disabled={busy !== ''} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                {busy === 'test' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Enviar prueba
              </button>
              <button onClick={() => broadcast(true)} disabled={busy !== ''} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Simular
              </button>
              <button onClick={() => broadcast(false)} disabled={busy !== ''} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60">
                {busy === 'send' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Enviar campaña
              </button>
            </div>
            {sendMsg && (
              <p className={`flex items-center gap-2 text-sm font-semibold ${sendMsg.ok ? 'text-green-600' : 'text-red-600'}`}>
                {sendMsg.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}{sendMsg.text}
              </p>
            )}
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">Vista previa</p>
            <iframe title="preview" srcDoc={previewHtml} className="h-[420px] w-full rounded border border-gray-200" />
          </div>
        </div>
      </section>
    </div>
  );
}
