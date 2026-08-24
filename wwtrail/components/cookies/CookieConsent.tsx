'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'wwtrail_cookie_consent';
const CATEGORIES = ['preferences', 'analytics', 'marketing'] as const;
type Cat = (typeof CATEGORIES)[number];

interface Consent {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  ts: number;
}

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeConsent(c: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    // Mirror into a cookie so server/analytics can read the choice too.
    document.cookie = `cookie_consent=${encodeURIComponent(JSON.stringify(c))};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
  } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: c }));
}

export function CookieConsent() {
  const t = useTranslations('cookies');
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState<Record<Cat, boolean>>({ preferences: false, analytics: false, marketing: false });

  useEffect(() => {
    if (!readConsent()) setOpen(true);
    const reopen = () => {
      const c = readConsent();
      if (c) setPrefs({ preferences: c.preferences, analytics: c.analytics, marketing: c.marketing });
      setShowPrefs(true);
      setOpen(true);
    };
    window.addEventListener('open-cookie-settings', reopen);
    return () => window.removeEventListener('open-cookie-settings', reopen);
  }, []);

  const save = (all?: boolean, none?: boolean) => {
    const c: Consent = {
      necessary: true,
      preferences: all ? true : none ? false : prefs.preferences,
      analytics: all ? true : none ? false : prefs.analytics,
      marketing: all ? true : none ? false : prefs.marketing,
      ts: Date.now(),
    };
    writeConsent(c);
    setOpen(false);
    setShowPrefs(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4">
      <div className="mx-auto max-w-3xl rounded-xl border border-border bg-surface p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 h-6 w-6 shrink-0 text-green-brand" />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-ink-2">{t('title')}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-text-muted">
              {t('description')}{' '}
              <Link href="/legal/cookies" className="font-semibold text-green-brand underline">{t('moreInfo')}</Link>
            </p>

            {showPrefs && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-surface-alt px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-ink-2">{t('catNecessary')}</p>
                    <p className="text-xs text-text-faint">{t('catNecessaryDesc')}</p>
                  </div>
                  <span className="text-xs font-bold uppercase text-text-faint">{t('always')}</span>
                </div>
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold text-ink-2">{t(`cat${cat[0].toUpperCase()}${cat.slice(1)}` as any)}</p>
                      <p className="text-xs text-text-faint">{t(`cat${cat[0].toUpperCase()}${cat.slice(1)}Desc` as any)}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefs[cat]}
                      onChange={(e) => setPrefs((p) => ({ ...p, [cat]: e.target.checked }))}
                      className="h-5 w-5 accent-green-brand"
                    />
                  </label>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => save(true)} className="rounded-lg bg-green-brand px-4 py-2 text-sm font-bold text-white hover:brightness-110">{t('acceptAll')}</button>
              <button onClick={() => save(false, true)} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-ink-2 hover:bg-surface-alt">{t('rejectAll')}</button>
              {showPrefs ? (
                <button onClick={() => save()} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-ink-2 hover:bg-surface-alt">{t('savePrefs')}</button>
              ) : (
                <button onClick={() => setShowPrefs(true)} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-ink-2 hover:bg-surface-alt">{t('customize')}</button>
              )}
            </div>
          </div>
          <button onClick={() => save(false, true)} aria-label={t('rejectAll')} className="rounded p-1 text-text-faint hover:text-ink-2"><X className="h-5 w-5" /></button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
