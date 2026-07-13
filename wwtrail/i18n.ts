import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';

export const locales = ['es', 'en', 'it', 'ca', 'fr', 'de'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  it: 'Italiano',
  ca: 'Català',
  fr: 'Français',
  de: 'Deutsch',
};

export const localeFlags: Record<Locale, string> = {
  es: '🇪🇸',
  en: '🇬🇧',
  it: '🇮🇹',
  ca: '🏴',
  fr: '🇫🇷',
  de: '🇩🇪',
};

export default getRequestConfig(async ({ requestLocale }) => {
  // next-intl v4: the locale comes from `requestLocale` (a Promise); the old
  // `locale` param is undefined here. Falling back to the default locale keeps
  // server components (getTranslations/getFormatter) from throwing NEXT_NOT_FOUND.
  const requested = await requestLocale;
  const locale = hasLocale(locales, requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
