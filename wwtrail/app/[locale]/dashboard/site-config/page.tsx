'use client';

import { useEffect, useState } from 'react';
import {
  Settings, Save, Loader2, Key, Palette, Type, Square,
  Sun, Upload, Eye, EyeOff, Check, Bookmark, Trash2, Plus, Sparkles
} from 'lucide-react';
import { apiClientV2 } from '@/lib/api/client';
import { uploadFile } from '@/lib/api/files.service';
import { THEME_FIELDS, type ThemePreset } from '@/lib/theme/presets';

interface SiteConfig {
  id: string;
  siteName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  fontPrimary: string;
  fontSecondary: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorBackground: string;
  colorText: string;
  colorSuccess: string;
  colorDanger: string;
  borderRadius: string;
  shadowStyle: string;
  openaiApiKey: string | null;
  hasOpenaiKey: boolean;
}

const FONT_OPTIONS = [
  'Montserrat', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins',
  'Nunito', 'Raleway', 'Source Sans Pro', 'Oswald', 'Work Sans',
  'DM Sans', 'Plus Jakarta Sans', 'sans-serif',
];

const BORDER_RADIUS_OPTIONS = [
  { value: '0', label: 'Sin redondeo (0px)' },
  { value: '4', label: 'Sutil (4px)' },
  { value: '8', label: 'Moderado (8px)' },
  { value: '12', label: 'Redondeado (12px)' },
  { value: '16', label: 'Muy redondeado (16px)' },
  { value: '9999', label: 'Pill (completo)' },
];

const SHADOW_OPTIONS = [
  { value: 'none', label: 'Sin sombra' },
  { value: 'subtle', label: 'Sutil' },
  { value: 'medium', label: 'Media' },
  { value: 'strong', label: 'Pronunciada' },
];

export default function SiteConfigPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  // Theme presets
  const [presets, setPresets] = useState<ThemePreset[]>([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [savingPreset, setSavingPreset] = useState(false);
  const [presetMsg, setPresetMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    try {
      const res = await apiClientV2.get('/admin/theme-presets');
      setPresets(res.data?.data || res.data || []);
    } catch {
      // Non-critical: presets just won't show
    }
  };

  // Load a preset's values into the form (does not persist until "Guardar").
  const applyPreset = (preset: ThemePreset) => {
    if (!config) return;
    const patch: Partial<SiteConfig> = {};
    THEME_FIELDS.forEach((field) => {
      patch[field] = preset[field];
    });
    setConfig({ ...config, ...patch });
    setPresetMsg(`Preset "${preset.name}" cargado — pulsa Guardar para aplicarlo`);
    setTimeout(() => setPresetMsg(null), 5000);
  };

  const saveCurrentAsPreset = async () => {
    if (!config || !newPresetName.trim()) return;
    try {
      setSavingPreset(true);
      setError(null);
      const payload: any = { name: newPresetName.trim() };
      THEME_FIELDS.forEach((field) => {
        payload[field] = config[field];
      });
      await apiClientV2.post('/admin/theme-presets', payload);
      setNewPresetName('');
      setPresetMsg(`Preset "${payload.name}" guardado`);
      setTimeout(() => setPresetMsg(null), 4000);
      await fetchPresets();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error guardando el preset');
    } finally {
      setSavingPreset(false);
    }
  };

  const deletePreset = async (preset: ThemePreset) => {
    if (preset.builtin) return;
    if (!confirm(`¿Eliminar el preset "${preset.name}"?`)) return;
    try {
      await apiClientV2.delete(`/admin/theme-presets/${preset.id}`);
      await fetchPresets();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error eliminando el preset');
    }
  };

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await apiClientV2.get('/admin/site-config');
      const data = res.data?.data || res.data;
      setConfig(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error cargando configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    try {
      setSaving(true);
      setError(null);

      const payload: any = { ...config };
      delete payload.id;
      delete payload.hasOpenaiKey;
      delete payload.updatedAt;

      // Only send API key if user typed a new one
      if (newApiKey) {
        payload.openaiApiKey = newApiKey;
      } else {
        delete payload.openaiApiKey;
      }

      const res = await apiClientV2.put('/admin/site-config', payload);
      const data = res.data?.data || res.data;
      setConfig(data);
      setNewApiKey('');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error guardando configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logoUrl' | 'faviconUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file || !config) return;

    const setUploading = field === 'logoUrl' ? setUploadingLogo : setUploadingFavicon;
    try {
      setUploading(true);
      const url = await uploadFile(file, field === 'logoUrl' ? 'logo' : 'favicon');
      setConfig({ ...config, [field]: url });
    } catch (err: any) {
      setError(`Error subiendo ${field === 'logoUrl' ? 'logo' : 'favicon'}: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const updateField = (field: keyof SiteConfig, value: string) => {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-6 text-center text-red-600">
        {error || 'No se pudo cargar la configuración'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-7 w-7 text-gray-700" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ajustes del Sitio</h1>
            <p className="text-sm text-gray-500">Configuración general, estilos y claves API</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Theme Presets Section */}
      <section className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Presets de tema</h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Carga una configuración de estilos guardada o guarda la actual con un nombre.
            Aplicar un preset rellena el formulario; recuerda pulsar <strong>Guardar</strong> para publicarlo.
          </p>
        </div>
        <div className="p-6 space-y-5">
          {presetMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">
              {presetMsg}
            </div>
          )}

          {/* Preset cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="relative rounded-lg border border-gray-200 p-3 hover:border-green-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      {preset.builtin && <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{preset.name}</h3>
                    </div>
                    {preset.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{preset.description}</p>
                    )}
                  </div>
                  {!preset.builtin && (
                    <button
                      onClick={() => deletePreset(preset)}
                      className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                      title="Eliminar preset"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Color swatches */}
                <div className="flex items-center gap-1 mt-3">
                  {[preset.colorPrimary, preset.colorSecondary, preset.colorAccent, preset.colorBackground, preset.colorText].map((c, i) => (
                    <span
                      key={i}
                      className="h-5 w-5 rounded-full border border-gray-200"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>

                <button
                  onClick={() => applyPreset(preset)}
                  className="mt-3 w-full text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg py-1.5 transition-colors"
                >
                  Aplicar
                </button>
              </div>
            ))}
          </div>

          {/* Save current as preset */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="Nombre del nuevo preset..."
              maxLength={80}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            />
            <button
              onClick={saveCurrentAsPreset}
              disabled={savingPreset || !newPresetName.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-40 transition-colors text-sm whitespace-nowrap"
            >
              {savingPreset ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Guardar tema actual
            </button>
          </div>
        </div>
      </section>

      {/* API Keys Section */}
      <section className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900">Claves API</h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">Configura las claves de servicios externos</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OpenAI API Key
              <span className="text-gray-400 font-normal ml-2">(Traducciones, SEO, Auto-relleno IA)</span>
            </label>
            {config.hasOpenaiKey && !newApiKey && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                  Configurada: {config.openaiApiKey}
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder={config.hasOpenaiKey ? 'Dejar vacío para mantener la actual' : 'sk-...'}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              La clave se almacena de forma segura y nunca se muestra completa
            </p>
          </div>
        </div>
      </section>

      {/* Branding Section */}
      <section className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Marca e Identidad</h2>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Site Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Sitio</label>
            <input
              type="text"
              value={config.siteName}
              onChange={(e) => updateField('siteName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Logo & Favicon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logotipo</label>
              <div className="flex items-center gap-4">
                {config.logoUrl && (
                  <img
                    src={config.logoUrl}
                    alt="Logo"
                    className="h-16 w-auto object-contain border border-gray-200 rounded p-1 bg-white"
                  />
                )}
                <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors text-sm">
                  <Upload className="h-4 w-4" />
                  {uploadingLogo ? 'Subiendo...' : 'Subir logo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logoUrl')}
                    className="hidden"
                    disabled={uploadingLogo}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
              <div className="flex items-center gap-4">
                {config.faviconUrl && (
                  <img
                    src={config.faviconUrl}
                    alt="Favicon"
                    className="h-10 w-10 object-contain border border-gray-200 rounded p-1 bg-white"
                  />
                )}
                <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors text-sm">
                  <Upload className="h-4 w-4" />
                  {uploadingFavicon ? 'Subiendo...' : 'Subir favicon'}
                  <input
                    type="file"
                    accept="image/*,.ico"
                    onChange={(e) => handleImageUpload(e, 'faviconUrl')}
                    className="hidden"
                    disabled={uploadingFavicon}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Type className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Tipografía</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuente principal</label>
              <select
                value={config.fontPrimary}
                onChange={(e) => updateField('fontPrimary', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: config.fontPrimary }}>
                Vista previa: The quick brown fox jumps
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuente secundaria</label>
              <select
                value={config.fontSecondary}
                onChange={(e) => updateField('fontSecondary', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Colors Section */}
      <section className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-pink-600" />
            <h2 className="text-lg font-semibold text-gray-900">Colores</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {([
              { field: 'colorPrimary', label: 'Primario' },
              { field: 'colorSecondary', label: 'Secundario' },
              { field: 'colorAccent', label: 'Acento' },
              { field: 'colorBackground', label: 'Fondo' },
              { field: 'colorText', label: 'Texto' },
              { field: 'colorSuccess', label: 'Success' },
              { field: 'colorDanger', label: 'Danger' },
            ] as { field: keyof SiteConfig; label: string }[]).map(({ field, label }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config[field] as string}
                    onChange={(e) => updateField(field, e.target.value)}
                    className="h-10 w-10 rounded border border-gray-300 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={config[field] as string}
                    onChange={(e) => updateField(field, e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm font-mono"
                    maxLength={9}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Color Preview */}
          <div className="mt-6 p-4 rounded-lg border border-gray-200" style={{ backgroundColor: config.colorBackground }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: config.colorText }}>Vista previa de colores</h3>
            <p className="text-sm mb-3" style={{ color: config.colorText }}>Texto de ejemplo sobre el fondo configurado.</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded text-white text-sm" style={{ backgroundColor: config.colorPrimary }}>Primario</span>
              <span className="px-3 py-1 rounded text-white text-sm" style={{ backgroundColor: config.colorSecondary }}>Secundario</span>
              <span className="px-3 py-1 rounded text-white text-sm" style={{ backgroundColor: config.colorAccent }}>Acento</span>
              <span className="px-3 py-1 rounded text-white text-sm" style={{ backgroundColor: config.colorSuccess }}>Success</span>
              <span className="px-3 py-1 rounded text-white text-sm" style={{ backgroundColor: config.colorDanger }}>Danger</span>
            </div>
          </div>
        </div>
      </section>

      {/* Borders & Shadows Section */}
      <section className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Square className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Bordes y Sombras</h2>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Redondeo de bordes</label>
              <select
                value={config.borderRadius}
                onChange={(e) => updateField('borderRadius', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {BORDER_RADIUS_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estilo de sombras</label>
              <select
                value={config.shadowStyle}
                onChange={(e) => updateField('shadowStyle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {SHADOW_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="flex gap-4 flex-wrap">
            {['Card 1', 'Card 2', 'Card 3'].map((text, i) => {
              const shadowMap: Record<string, string> = {
                none: 'none',
                subtle: '0 1px 3px rgba(0,0,0,0.12)',
                medium: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
                strong: '0 10px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)',
              };
              return (
                <div
                  key={i}
                  className="flex-1 min-w-[120px] p-4 bg-white border border-gray-200 text-center text-sm text-gray-700"
                  style={{
                    borderRadius: `${config.borderRadius === '9999' ? '9999' : config.borderRadius}px`,
                    boxShadow: shadowMap[config.shadowStyle] || 'none',
                  }}
                >
                  {text}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
