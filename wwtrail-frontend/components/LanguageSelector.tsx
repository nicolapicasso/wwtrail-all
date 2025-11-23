'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe, ChevronDown } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/i18n';

export default function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // Get the current pathname without the locale prefix
    // Remove locale prefix including the trailing slash
    const pathnameWithoutLocale = pathname.replace(new RegExp(`^/(${locales.join('|')})(/|$)`), '');

    // Build the new path with the new locale
    // For 'es' (default locale), don't add prefix when using 'as-needed'
    const newPath = newLocale === 'es'
      ? `/${pathnameWithoutLocale || ''}`
      : `/${newLocale}/${pathnameWithoutLocale || ''}`;

    // Remove any double slashes
    const cleanPath = newPath.replace(/\/+/g, '/').replace(/\/$/, '') || '/';

    router.push(cleanPath);
    router.refresh();
  };

  const currentLocaleName = localeNames[locale as Locale] || 'Español';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-white hover:text-hover hover:bg-gray-900"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLocaleName}</span>
          <span className="sm:hidden">{locale.toUpperCase()}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`cursor-pointer ${
              loc === locale ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
          >
            <span className="font-medium">{loc.toUpperCase()}</span>
            <span className="ml-2 text-sm text-gray-500">
              {localeNames[loc]}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
