// lib/theme/presets.ts
// Theme presets: a named snapshot of the site's typography, colors and
// borders/shadows. Built-in presets live here (always available, load-only);
// user-created presets are persisted in the ThemePreset table.

export interface ThemeValues {
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
}

export interface ThemePreset extends ThemeValues {
  id: string;
  name: string;
  builtin?: boolean;
  description?: string;
}

// The exact fields a preset carries. Used to strip a full SiteConfig down to a
// theme snapshot (and vice-versa) without dragging along identity fields like
// siteName, logoUrl, faviconUrl or the API key.
export const THEME_FIELDS: (keyof ThemeValues)[] = [
  'fontPrimary',
  'fontSecondary',
  'colorPrimary',
  'colorSecondary',
  'colorAccent',
  'colorBackground',
  'colorText',
  'colorSuccess',
  'colorDanger',
  'borderRadius',
  'shadowStyle',
];

/** Pick only the theme fields from an arbitrary config-like object. */
export function pickThemeValues(source: Partial<ThemeValues>): ThemeValues {
  const out = {} as ThemeValues;
  for (const key of THEME_FIELDS) {
    out[key] = (source[key] ?? '') as string;
  }
  return out;
}

// Built-in presets. `WWTRAIL Moderno` mirrors the current redesign defaults;
// `WWTRAIL Clásico` recovers the legacy palette for a one-click revert.
export const BUILTIN_PRESETS: ThemePreset[] = [
  {
    id: 'builtin:wwtrail-moderno',
    name: 'WWTRAIL Moderno',
    builtin: true,
    description: 'Paleta del rediseño 2026 — verde de marca, acento naranja y papel.',
    fontPrimary: 'Archivo',
    fontSecondary: 'Barlow Semi Condensed',
    colorPrimary: '#1f7a4d',
    colorSecondary: '#173f6e',
    colorAccent: '#f0a05a',
    colorBackground: '#f4f3ee',
    colorText: '#14181a',
    colorSuccess: '#2ea36a',
    colorDanger: '#d1631f',
    borderRadius: '14',
    shadowStyle: 'subtle',
  },
  {
    id: 'builtin:wwtrail-clasico',
    name: 'WWTRAIL Clásico',
    builtin: true,
    description: 'Paleta original previa al rediseño.',
    fontPrimary: 'Montserrat',
    fontSecondary: 'sans-serif',
    colorPrimary: '#B5751A',
    colorSecondary: '#16A34A',
    colorAccent: '#B66916',
    colorBackground: '#FFFFFF',
    colorText: '#333333',
    colorSuccess: '#28A745',
    colorDanger: '#DC3545',
    borderRadius: '0',
    shadowStyle: 'subtle',
  },
];
