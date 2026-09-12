'use client';

import { useState } from 'react';
import { apiClientV2 } from '@/lib/api/client';
import { FileText, Loader2, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

const LANGS = ['ES', 'EN', 'IT', 'CA', 'FR', 'DE'];
const CATEGORIES = ['GENERAL', 'TRAINING', 'NUTRITION', 'GEAR', 'DESTINATIONS', 'INTERVIEWS', 'RACE_REPORTS', 'TIPS'];

interface ParsedPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: string;
  publishedAt: string | null;
  featuredImage: string | null;
}

// Parse a native WordPress WXR export using the browser's DOMParser.
function parseWxr(xml: string): ParsedPost[] {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.getElementsByTagName('parsererror').length) throw new Error('El archivo no es un XML válido.');
  const items = Array.from(doc.getElementsByTagName('item'));
  const out: ParsedPost[] = [];
  for (const item of items) {
    const get = (tag: string) => item.getElementsByTagName(tag)[0]?.textContent?.trim() || '';
    if (get('wp:post_type') !== 'post') continue; // skip pages, attachments, nav, etc.
    if (get('wp:status') === 'trash') continue;
    const content = item.getElementsByTagName('content:encoded')[0]?.textContent || '';
    const rawDate = get('wp:post_date_gmt') || get('pubDate');
    let iso: string | null = null;
    if (rawDate && rawDate !== '0000-00-00 00:00:00') {
      const d = new Date(/\d{4}-\d{2}-\d{2} /.test(rawDate) ? rawDate.replace(' ', 'T') + 'Z' : rawDate);
      iso = isNaN(d.getTime()) ? null : d.toISOString();
    }
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    out.push({
      title: get('title'),
      slug: get('wp:post_name'),
      content,
      excerpt: item.getElementsByTagName('excerpt:encoded')[0]?.textContent?.trim() || '',
      status: get('wp:status'),
      publishedAt: iso,
      featuredImage: imgMatch ? imgMatch[1] : null,
    });
  }
  return out;
}

export default function ImportPostsPage() {
  const [posts, setPosts] = useState<ParsedPost[]>([]);
  const [fileName, setFileName] = useState('');
  const [language, setLanguage] = useState('ES');
  const [category, setCategory] = useState('GENERAL');
  const [onlyDrafts, setOnlyDrafts] = useState(true);
  const [internalizeImages, setInternalizeImages] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ created: number; skipped: number; errors: any[] } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Migrate images of already-imported posts to our CDN (batched loop).
  const [migrating, setMigrating] = useState(false);
  const [migrateMsg, setMigrateMsg] = useState<string | null>(null);
  const runImageMigration = async () => {
    setMigrating(true); setMigrateMsg('Iniciando…');
    try {
      let offset = 0, updated = 0, images = 0, total = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const res = await apiClientV2.post('/admin/posts/migrate-images', { offset, limit: 15 });
        const d = res.data?.data ?? res.data;
        total = d.total;
        updated += d.updated || 0;
        images += d.migratedImages || 0;
        offset += d.processed || 0;
        setMigrateMsg(`Procesando ${Math.min(offset, total)}/${total} · ${images} imágenes migradas…`);
        if (d.remaining <= 0 || d.processed === 0) break;
      }
      setMigrateMsg(`Listo: ${updated} posts actualizados, ${images} imágenes movidas a nuestro CDN.`);
    } catch (e: any) {
      setMigrateMsg(e?.response?.data?.error || 'Error durante la migración.');
    } finally { setMigrating(false); }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name); setErr(null); setResult(null); setPosts([]);
    setParsing(true);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        setPosts(parseWxr(String(reader.result || '')));
      } catch (e: any) {
        setErr(e?.message || 'No se pudo leer el archivo.');
      } finally { setParsing(false); }
    };
    reader.onerror = () => { setErr('No se pudo leer el archivo.'); setParsing(false); };
    reader.readAsText(file);
  };

  const doImport = async () => {
    if (posts.length === 0) return;
    setImporting(true); setErr(null); setResult(null); setProgress(0);
    const CHUNK = 25;
    const acc = { created: 0, skipped: 0, errors: [] as any[] };
    try {
      for (let i = 0; i < posts.length; i += CHUNK) {
        const chunk = posts.slice(i, i + CHUNK);
        const res = await apiClientV2.post('/admin/posts/import-wordpress', {
          posts: chunk, language, category, onlyDrafts, internalizeImages,
        });
        const d = res.data?.data ?? res.data;
        acc.created += d.created || 0;
        acc.skipped += d.skipped || 0;
        if (d.errors?.length) acc.errors.push(...d.errors);
        setProgress(Math.min(posts.length, i + CHUNK));
      }
      setResult(acc);
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Error al importar.');
    } finally { setImporting(false); }
  };

  const publishable = posts.filter((p) => p.status === 'publish').length;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-3">
        <FileText className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Importar artículos de WordPress</h1>
          <p className="text-gray-600">Sube el archivo de exportación nativo de WordPress (WXR / .xml) para migrar tus posts.</p>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          <Upload className="h-4 w-4 text-blue-600" /> Seleccionar archivo WXR (.xml)
          <input type="file" accept=".xml,text/xml,application/xml" onChange={onFile} className="hidden" />
        </label>
        {fileName && <span className="ml-3 text-sm text-gray-500">{fileName}</span>}
        <p className="mt-2 text-xs text-gray-400">En WordPress: Herramientas → Exportar → Entradas. Genera un archivo .xml.</p>
      </div>

      {parsing && <div className="flex items-center gap-2 text-sm text-gray-500"><Loader2 className="h-4 w-4 animate-spin" /> Analizando archivo…</div>}
      {err && <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4" />{err}</div>}

      {posts.length > 0 && (
        <>
          <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-700"><b>{posts.length}</b> entradas detectadas ({publishable} publicadas en WordPress).</p>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Idioma de los posts</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Categoría destino</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={onlyDrafts} onChange={(e) => setOnlyDrafts(e.target.checked)} className="h-4 w-4 accent-blue-600" />
                Importar todo como borrador (revisar antes de publicar)
              </label>
            </div>
          </div>

          <label className="mb-4 flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={internalizeImages} onChange={(e) => setInternalizeImages(e.target.checked)} className="h-4 w-4 accent-blue-600" />
            Descargar las imágenes a nuestro CDN y enlazarlas a nuestro servidor (recomendado)
          </label>

          <div className="mb-4 max-h-80 overflow-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-gray-50 text-gray-500">
                <tr><th className="px-3 py-2 text-left font-semibold">Título</th><th className="px-3 py-2 text-left font-semibold">Slug</th><th className="px-3 py-2 text-left font-semibold">Estado WP</th><th className="px-3 py-2 text-left font-semibold">Fecha</th></tr>
              </thead>
              <tbody>
                {posts.slice(0, 100).map((p, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-3 py-1.5 text-gray-800">{p.title || <span className="text-red-500">(sin título)</span>}</td>
                    <td className="px-3 py-1.5 text-gray-500">{p.slug}</td>
                    <td className="px-3 py-1.5 text-gray-500">{p.status}</td>
                    <td className="px-3 py-1.5 text-gray-500">{p.publishedAt ? p.publishedAt.slice(0, 10) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {posts.length > 100 && <p className="bg-gray-50 px-3 py-1.5 text-xs text-gray-400">Mostrando 100 de {posts.length}.</p>}
          </div>

          {result && (
            <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
              <p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4" /> Importación completada</p>
              <p className="mt-1">Creados: {result.created} · Omitidos (duplicados/vacíos): {result.skipped}</p>
              {result.errors.length > 0 && (
                <details className="mt-2"><summary className="cursor-pointer text-red-700">{result.errors.length} incidencia(s)</summary>
                  <ul className="mt-1 list-inside list-disc text-xs text-red-700">{result.errors.slice(0, 20).map((e: any, i: number) => <li key={i}>{e.title}: {e.reason}</li>)}</ul>
                </details>
              )}
            </div>
          )}

          <button onClick={doImport} disabled={importing} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {importing ? `Importando… ${progress}/${posts.length}` : `Importar ${posts.length} artículos`}
          </button>
        </>
      )}

      {/* Migrate images of already-imported posts to our CDN */}
      <div className="mt-10 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">Migrar imágenes de posts al CDN</h2>
        <p className="mt-1 text-sm text-gray-500">
          Descarga las imágenes que aún apuntan a servidores externos (por ejemplo el antiguo
          WordPress) y las vuelve a enlazar desde nuestro CDN. Aplica a todos los artículos
          existentes; se puede ejecutar varias veces sin duplicar.
        </p>
        <button
          onClick={runImageMigration}
          disabled={migrating}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-60"
        >
          {migrating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Migrar imágenes ahora
        </button>
        {migrateMsg && <p className="mt-2 text-sm text-gray-600">{migrateMsg}</p>}
      </div>
    </div>
  );
}
