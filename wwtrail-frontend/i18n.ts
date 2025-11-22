// i18n.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Lista de idiomas soportados
export const locales = ['es', 'en', 'it', 'ca', 'fr', 'de'] as const;
export type Locale = (typeof locales)[number];

// Idioma por defecto
export const defaultLocale: Locale = 'es';

// Nombres de idiomas para mostrar en el selector
export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  it: 'Italiano',
  ca: 'Català',
  fr: 'Français',
  de: 'Deutsch',
};

// Banderas de idiomas (emojis)
export const localeFlags: Record<Locale, string> = {
  es: '🇪🇸',
  en: '🇬🇧',
  it: '🇮🇹',
  ca: '🏴',
  fr: '🇫🇷',
  de: '🇩🇪',
};

export default getRequestConfig(async ({ locale }) => {
  // Validar que el locale sea válido
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
