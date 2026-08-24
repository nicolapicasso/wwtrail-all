'use client';

import { useTranslations } from 'next-intl';

/** Re-opens the cookie consent banner (used from the cookie policy + footer). */
export function CookieSettingsButton({ className }: { className?: string }) {
  const t = useTranslations('cookies');
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
      className={className || 'rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-ink-2 hover:bg-surface-alt'}
    >
      {t('manage')}
    </button>
  );
}

export default CookieSettingsButton;
