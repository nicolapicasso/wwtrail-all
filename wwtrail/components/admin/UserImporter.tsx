'use client';

import { useMemo, useState } from 'react';
import { apiClientV2 } from '@/lib/api/client';
import { Upload, Loader2, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export type AccountMode = 'none' | 'provisional' | 'invite';

// Target fields the importer can map columns onto.
const ALL_FIELDS: { key: string; label: string; required?: boolean }[] = [
  { key: 'email', label: 'Email', required: true },
  { key: 'firstName', label: 'Nombre' },
  { key: 'lastName', label: 'Apellidos' },
  { key: 'country', label: 'País (ISO-2)' },
  { key: 'language', label: 'Idioma' },
  { key: 'city', label: 'Ciudad' },
  { key: 'phone', label: 'Teléfono' },
  { key: 'bio', label: 'Bio' },
  { key: 'instagramUrl', label: 'Instagram' },
  { key: 'facebookUrl', label: 'Facebook' },
  { key: 'twitterUrl', label: 'Twitter/X' },
  { key: 'youtubeUrl', label: 'YouTube' },
];

// Header-name hints for auto-mapping.
const HINTS: Record<string, string[]> = {
  email: ['email', 'e-mail', 'correo', 'mail'],
  firstName: ['first', 'nombre', 'name', 'firstname'],
  lastName: ['last', 'apellido', 'apellidos', 'surname', 'lastname'],
  country: ['country', 'pais', 'país', 'cc'],
  language: ['lang', 'idioma', 'language', 'locale'],
  city: ['city', 'ciudad', 'localidad'],
  phone: ['phone', 'tel', 'telefono', 'teléfono', 'movil', 'móvil'],
  bio: ['bio', 'about', 'descripcion', 'descripción'],
  instagramUrl: ['instagram', 'ig'],
  facebookUrl: ['facebook', 'fb'],
  twitterUrl: ['twitter', 'x'],
  youtubeUrl: ['youtube', 'yt'],
};

// Minimal CSV parser: detects delimiter (, ; tab), honors double-quoted fields.
function parseCsv(text: string): string[][] {
  const t = text.replace(/\r\n?/g, '\n').trim();
  if (!t) return [];
  const firstLine = t.split('\n')[0];
  const counts: Record<string, number> = {
    ',': (firstLine.match(/,/g) || []).length,
    ';': (firstLine.match(/;/g) || []).length,
    '\t': (firstLine.match(/\t/g) || []).length,
  };
  const delim = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][1] > 0)
    ? Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] : ',';

  const rows: string[][] = [];
  let field = '', row: string[] = [], inQuotes = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (inQuotes) {
      if (ch === '"') {
        if (t[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === delim) { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field); rows.push(row); field = ''; row = []; }
    else field += ch;
  }
  row.push(field);
  rows.push(row);
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

interface Props {
  title: string;
  description: string;
  /** Account modes to offer; if omitted, mode is fixed to 'none'. */
  accountModes?: AccountMode[];
  /** Fixed insider flag (insiders tab). */
  fixedAsInsider?: boolean;
  /** Default state of the marketing opt-in checkbox. */
  defaultMarketingOptIn?: boolean;
  /** Restrict mappable fields (defaults to all). */
  fields?: string[];
}

const MODE_LABEL: Record<AccountMode, string> = {
  none: 'Sin acceso (solo datos)',
  provisional: 'Crear con contraseña provisional (email al usuario)',
  invite: 'Enviar email para que fijen su contraseña',
};

export function UserImporter({ title, description, accountModes, fixedAsInsider = false, defaultMarketingOptIn = false, fields }: Props) {
  const targetFields = useMemo(
    () => ALL_FIELDS.filter((f) => !fields || f.key === 'email' || fields.includes(f.key)),
    [fields]
  );

  const [raw, setRaw] = useState('');
  const [grid, setGrid] = useState<string[][]>([]);
  const [hasHeader, setHasHeader] = useState(true);
  const [map, setMap] = useState<Record<string, number>>({}); // fieldKey → column index (-1 = none)
  const [accountMode, setAccountMode] = useState<AccountMode>(accountModes?.[0] ?? 'none');
  const [marketingOptIn, setMarketingOptIn] = useState(defaultMarketingOptIn);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  const ingest = (text: string) => {
    setRaw(text);
    setResult(null); setErr(null);
    const g = parseCsv(text);
    setGrid(g);
    if (g.length) {
      const header = g[0].map((h) => h.trim().toLowerCase());
      const guess: Record<string, number> = {};
      for (const f of targetFields) {
        const idx = header.findIndex((h) => (HINTS[f.key] || [f.key]).some((hint) => h === hint || h.includes(hint)));
        guess[f.key] = idx;
      }
      // If nothing matched email, assume first column is email.
      if (guess.email === undefined || guess.email < 0) guess.email = 0;
      setMap(guess);
      setHasHeader(header.some((h) => (HINTS.email).some((hint) => h.includes(hint))));
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => ingest(String(reader.result || ''));
    reader.readAsText(file);
  };

  const dataRows = hasHeader ? grid.slice(1) : grid;
  const preview = dataRows.slice(0, 5);

  const buildRows = () => {
    const emailCol = map.email;
    return dataRows
      .map((r) => {
        const obj: any = {};
        for (const f of targetFields) {
          const idx = map[f.key];
          if (idx !== undefined && idx >= 0) obj[f.key] = (r[idx] || '').trim();
        }
        return obj;
      })
      .filter((o) => o.email && o.email.includes('@'));
  };

  const doImport = async () => {
    const rows = buildRows();
    if (rows.length === 0) { setErr('No se detectaron filas con email válido. Revisa el mapeo.'); return; }
    setImporting(true); setErr(null); setResult(null);
    try {
      const res = await apiClientV2.post('/admin/users/import', {
        rows,
        accountMode: accountModes ? accountMode : 'none',
        asInsider: fixedAsInsider,
        marketingOptIn,
      });
      setResult(res.data?.data ?? res.data);
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Error al importar.');
    } finally { setImporting(false); }
  };

  const sel = 'rounded border border-gray-300 px-2 py-1 text-sm';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {/* Input */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <FileText className="h-4 w-4 text-blue-600" /> Subir CSV
            <input type="file" accept=".csv,text/csv,text/plain" onChange={onFile} className="hidden" />
          </label>
          <span className="text-xs text-gray-400">o pega el contenido abajo</span>
        </div>
        <textarea
          value={raw}
          onChange={(e) => ingest(e.target.value)}
          rows={5}
          placeholder="email,nombre,apellidos,pais,idioma&#10;ana@example.com,Ana,García,ES,ES"
          className="w-full rounded border border-gray-300 px-3 py-2 font-mono text-xs"
        />
      </div>

      {grid.length > 0 && (
        <>
          {/* Header toggle + mapping */}
          <div className="rounded-lg border border-gray-200 p-4">
            <label className="mb-3 flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} className="h-4 w-4 accent-blue-600" />
              La primera fila es cabecera
            </label>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Mapeo de columnas</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {targetFields.map((f) => (
                <label key={f.key} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-gray-700">{f.label}{f.required && <span className="text-red-500"> *</span>}</span>
                  <select
                    value={map[f.key] ?? -1}
                    onChange={(e) => setMap({ ...map, [f.key]: parseInt(e.target.value, 10) })}
                    className={sel}
                  >
                    <option value={-1}>—</option>
                    {(grid[0] || []).map((h, i) => (
                      <option key={i} value={i}>{hasHeader ? (h.trim() || `Col ${i + 1}`) : `Col ${i + 1}`}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>{targetFields.filter((f) => (map[f.key] ?? -1) >= 0).map((f) => <th key={f.key} className="px-3 py-2 text-left font-semibold">{f.label}</th>)}</tr>
                </thead>
                <tbody>
                  {preview.map((r, ri) => (
                    <tr key={ri} className="border-t border-gray-100">
                      {targetFields.filter((f) => (map[f.key] ?? -1) >= 0).map((f) => <td key={f.key} className="px-3 py-1.5 text-gray-700">{r[map[f.key]] || ''}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="bg-gray-50 px-3 py-1.5 text-xs text-gray-400">{dataRows.length} fila(s) detectada(s) · vista previa de {preview.length}</p>
            </div>
          )}

          {/* Options */}
          <div className="space-y-3 rounded-lg border border-gray-200 p-4">
            {accountModes && (
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">Cuenta de portal</p>
                <div className="space-y-1">
                  {accountModes.map((m) => (
                    <label key={m} className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="radio" name="accountMode" checked={accountMode === m} onChange={() => setAccountMode(m)} className="accent-blue-600" />
                      {MODE_LABEL[m]}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={marketingOptIn} onChange={(e) => setMarketingOptIn(e.target.checked)} className="h-4 w-4 accent-green-600" />
              Marcar consentimiento de marketing (solo si este CSV trae consentimiento heredado)
            </label>
            {fixedAsInsider && (
              <p className="rounded bg-amber-50 px-3 py-2 text-xs text-amber-700">Estos usuarios se marcarán como <b>Insiders</b>.</p>
            )}
          </div>

          {err && <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4" />{err}</div>}
          {result && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
              <p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4" /> Importación completada</p>
              <p className="mt-1">Creados: {result.created} · Actualizados: {result.updated} · Emails enviados: {result.emailed} · Omitidos: {result.skipped}</p>
              {result.errors?.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-red-700">{result.errors.length} incidencia(s)</summary>
                  <ul className="mt-1 list-inside list-disc text-xs text-red-700">
                    {result.errors.slice(0, 20).map((e: any, i: number) => <li key={i}>{e.email}: {e.reason}</li>)}
                  </ul>
                </details>
              )}
            </div>
          )}

          <button onClick={doImport} disabled={importing} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Importar
          </button>
        </>
      )}
    </div>
  );
}

export default UserImporter;
