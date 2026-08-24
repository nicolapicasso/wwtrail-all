'use client';

import { useEffect, useState } from 'react';
import { apiClientV2 } from '@/lib/api/client';
import { Cookie, Plus, Save, Trash2, Loader2 } from 'lucide-react';

const CATEGORIES = ['NECESSARY', 'PREFERENCES', 'ANALYTICS', 'MARKETING'];

interface CookieDef {
  id: string; name: string; category: string; provider: string | null;
  purpose: string; duration: string | null; isActive: boolean; sortOrder: number;
}

export default function CookiesAdminPage() {
  const [rows, setRows] = useState<CookieDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [nw, setNw] = useState({ name: '', category: 'NECESSARY', provider: '', purpose: '', duration: '' });
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClientV2.get('/admin/cookies');
      setRows((res.data?.data ?? res.data) || []);
    } catch { setRows([]); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const patch = (id: string, field: keyof CookieDef, value: any) =>
    setRows((r) => r.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  const saveRow = async (c: CookieDef) => {
    setSavingId(c.id);
    try {
      await apiClientV2.put(`/admin/cookies/${c.id}`, c);
    } finally { setSavingId(null); }
  };

  const del = async (id: string) => {
    if (!confirm('¿Eliminar esta cookie del catálogo?')) return;
    await apiClientV2.delete(`/admin/cookies/${id}`);
    setRows((r) => r.filter((c) => c.id !== id));
  };

  const add = async () => {
    if (!nw.name || !nw.purpose) return;
    setAdding(true);
    try {
      await apiClientV2.post('/admin/cookies', nw);
      setNw({ name: '', category: 'NECESSARY', provider: '', purpose: '', duration: '' });
      await load();
    } finally { setAdding(false); }
  };

  const inp = 'w-full rounded border border-gray-300 px-2 py-1 text-sm';

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-3">
        <Cookie className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de cookies</h1>
          <p className="text-gray-600">Estas cookies se muestran en el banner de consentimiento y en la página de cookies.</p>
        </div>
      </div>

      {/* Add new */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"><Plus className="h-4 w-4 text-blue-600" /> Añadir cookie</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-6">
          <input placeholder="Nombre" value={nw.name} onChange={(e) => setNw({ ...nw, name: e.target.value })} className={inp} />
          <select value={nw.category} onChange={(e) => setNw({ ...nw, category: e.target.value })} className={inp}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input placeholder="Proveedor" value={nw.provider} onChange={(e) => setNw({ ...nw, provider: e.target.value })} className={inp} />
          <input placeholder="Finalidad" value={nw.purpose} onChange={(e) => setNw({ ...nw, purpose: e.target.value })} className={`${inp} sm:col-span-2`} />
          <input placeholder="Duración" value={nw.duration} onChange={(e) => setNw({ ...nw, duration: e.target.value })} className={inp} />
        </div>
        <button onClick={add} disabled={adding || !nw.name || !nw.purpose} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Añadir
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
      ) : rows.length === 0 ? (
        <p className="text-gray-500">Todavía no hay cookies en el catálogo.</p>
      ) : (
        <div className="space-y-2">
          {rows.map((c) => (
            <div key={c.id} className="grid grid-cols-1 items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 sm:grid-cols-12">
              <input value={c.name} onChange={(e) => patch(c.id, 'name', e.target.value)} className={`${inp} sm:col-span-2`} />
              <select value={c.category} onChange={(e) => patch(c.id, 'category', e.target.value)} className={`${inp} sm:col-span-2`}>
                {CATEGORIES.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
              <input value={c.provider || ''} onChange={(e) => patch(c.id, 'provider', e.target.value)} placeholder="Proveedor" className={`${inp} sm:col-span-2`} />
              <input value={c.purpose} onChange={(e) => patch(c.id, 'purpose', e.target.value)} placeholder="Finalidad" className={`${inp} sm:col-span-3`} />
              <input value={c.duration || ''} onChange={(e) => patch(c.id, 'duration', e.target.value)} placeholder="Duración" className={`${inp} sm:col-span-1`} />
              <label className="flex items-center justify-center gap-1 text-xs text-gray-600">
                <input type="checkbox" checked={c.isActive} onChange={(e) => patch(c.id, 'isActive', e.target.checked)} className="h-4 w-4 accent-green-600" /> Activa
              </label>
              <div className="flex items-center justify-end gap-1">
                <button onClick={() => saveRow(c)} disabled={savingId === c.id} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="Guardar">
                  {savingId === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </button>
                <button onClick={() => del(c.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" title="Eliminar"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
