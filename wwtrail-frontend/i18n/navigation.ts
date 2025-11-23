// i18n/navigation.ts
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales } from '../i18n';

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales });
