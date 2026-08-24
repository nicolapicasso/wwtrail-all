'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiClientV2 } from '@/lib/api/client';
import { FileText, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const SLUGS = [
  { key: 'privacy', label: 'Política de privacidad' },
  { key: 'cookies', label: 'Política de cookies' },
  { key: 'terms', label: 'Términos y condiciones' },
];
const LANGS = ['ES', 'EN', 'IT', 'CA', 'FR', 'DE'];

export default function LegalAdminPage() {
  const [slug, setSlug] = useState('privacy');
  const [language, setLanguage] = useState('ES');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await apiClientV2.get(`/admin/legal?slug=${slug}&language=${language}`);
      const d = res.data?.data ?? res.data;
      setTitle(d.title || ''); setContent(d.content || ''); setIsCustom(d.isCustom);
    } catch { setMsg({ ok: false, text: 'No se pudo cargar.' }); }
    finally { setLoading(false); }
  }, [slug, language]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      await apiClientV2.put('/admin/legal', { slug, language, title, content });
      setIsCustom(true);
      setMsg({ ok: true, text: 'Guardado.' });
    } catch (e: any) { setMsg({ ok: false, text: e?.response?.data?.error || 'No se pudo guardar.' }); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-3">
        <FileText className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Páginas legales</h1>
          <p className="text-gray-600">Edita privacidad, cookies y términos por idioma. Para la política de cookies, el catálogo se muestra automáticamente debajo del texto.</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Página</label>
          <select value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            {SLUGS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Idioma</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${isCustom ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{isCustom ? 'Editada' : 'Vacía'}</span>
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
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Título</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Contenido (HTML)</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={20} className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs" />
            </div>
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Guardar
            </button>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">Vista previa</p>
            <div className="prose prose-sm max-w-none rounded-lg border border-gray-200 bg-white p-4">
              <h1>{title}</h1>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
