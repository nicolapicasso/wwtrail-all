// lib/services/cookieRegistry.ts
// Curated registry of the cookies each known integration sets. The catalog on
// /dashboard/cookies is auto-seeded from here: when an integration is
// configured (GTM / GA4 / Brevo) its standard cookies are added with correct
// category, provider, purpose and duration already written. "Necessary"
// cookies are the platform's own and are always included.
//
// Seeding never overwrites a cookie already in the catalog (matched by name),
// so manual edits are preserved — it only fills in what is missing.

export interface RegistryCookie {
  name: string;
  category: 'NECESSARY' | 'PREFERENCES' | 'ANALYTICS' | 'MARKETING';
  provider: string;
  purpose: string;
  duration: string;
}

// The platform's own strictly-necessary cookies (no consent required).
export const NECESSARY_COOKIES: RegistryCookie[] = [
  {
    name: 'accessToken',
    category: 'NECESSARY',
    provider: 'WWTRAIL',
    purpose: 'Mantiene la sesión iniciada del usuario autenticado.',
    duration: '7 días',
  },
  {
    name: 'cookie_consent',
    category: 'NECESSARY',
    provider: 'WWTRAIL',
    purpose: 'Guarda las preferencias de consentimiento de cookies del visitante.',
    duration: '1 año',
  },
  {
    name: 'NEXT_LOCALE',
    category: 'NECESSARY',
    provider: 'WWTRAIL',
    purpose: 'Recuerda el idioma seleccionado para mostrar el sitio.',
    duration: '1 año',
  },
];

// Cookies keyed by integration. The seeder picks the groups whose integration
// is configured. GTM itself sets no cookies (it is only the tag loader); the
// cookies below are set by the tags GTM commonly routes (GA4, conversion
// linker) and by Brevo.
export const INTEGRATION_COOKIES: Record<'ga' | 'ads' | 'brevo', RegistryCookie[]> = {
  ga: [
    {
      name: '_ga',
      category: 'ANALYTICS',
      provider: 'Google Analytics',
      purpose: 'Distingue a los usuarios asignando un identificador de cliente único.',
      duration: '2 años',
    },
    {
      name: '_ga_*',
      category: 'ANALYTICS',
      provider: 'Google Analytics',
      purpose: 'Mantiene el estado de la sesión para la propiedad de Google Analytics 4.',
      duration: '2 años',
    },
  ],
  // Google Ads / conversion linker — only relevant if marketing tags are used
  // in the GTM container. Added alongside GTM so it can be deactivated if not.
  ads: [
    {
      name: '_gcl_au',
      category: 'MARKETING',
      provider: 'Google',
      purpose: 'Enlaza conversiones de Google Ads (Conversion Linker). Desactívala si no usas Google Ads.',
      duration: '90 días',
    },
  ],
  brevo: [
    {
      name: 'sib_cuid',
      category: 'MARKETING',
      provider: 'Brevo',
      purpose: 'Identifica de forma única al visitante para el seguimiento de marketing automation.',
      duration: '13 meses',
    },
  ],
};
