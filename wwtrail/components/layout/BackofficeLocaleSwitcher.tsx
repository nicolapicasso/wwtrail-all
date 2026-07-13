'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, ChevronDown } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/i18n';

/**
 * Compact locale switcher for the backoffice sidebar (light theme).
 * Lets the user choose the language in which they see the backoffice.
 */
export function BackofficeLocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('cmpLayout');

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) return;
    router.push(pathname, { locale: newLocale });
  };

  const currentLocaleName = localeNames[locale as Locale] || locale.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title={t('language')}
          className="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <span className="truncate">{currentLocaleName}</span>
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`cursor-pointer ${
              loc === locale ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
          >
            <span className="font-medium">{loc.toUpperCase()}</span>
            <span className="ml-2 text-sm text-gray-500">{localeNames[loc]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
