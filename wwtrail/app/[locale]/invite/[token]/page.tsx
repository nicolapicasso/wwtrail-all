'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Loader2, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

export default function OrganizerInvitePage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('invite');
  const token = params?.token as string;
  const locale = (params?.locale as string) || 'es';

  const [state, setState] = useState<'validating' | 'ready' | 'invalid' | 'saving' | 'done'>('validating');
  const [info, setInfo] = useState<{ email: string; eventName: string } | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/v2/auth/accept-invite?token=${encodeURIComponent(token)}`);
        const json = await res.json();
        if (!res.ok || !json?.success) throw new Error();
        setInfo(json.data);
        setState('ready');
      } catch {
        setState('invalid');
      }
    })();
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError(t('passwordTooShort')); return; }
    if (password !== confirm) { setError(t('passwordsDontMatch')); return; }
    setState('saving');
    try {
      const res = await fetch('/api/v2/auth/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || 'error');
      setState('done');
      setTimeout(() => router.push(`/${locale}/auth/login`), 2200);
    } catch (err: any) {
      setError(err?.message || t('genericError'));
      setState('ready');
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-card">
        {state === 'validating' && (
          <div className="flex flex-col items-center gap-3 py-8 text-text-muted">
            <Loader2 className="h-8 w-8 animate-spin text-green-brand" />
            <p className="text-sm">{t('validating')}</p>
          </div>
        )}

        {state === 'invalid' && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <h1 className="text-lg font-bold text-ink-2">{t('invalidTitle')}</h1>
            <p className="text-sm text-text-muted">{t('invalidBody')}</p>
          </div>
        )}

        {state === 'done' && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-brand" />
            <h1 className="text-lg font-bold text-ink-2">{t('doneTitle')}</h1>
            <p className="text-sm text-text-muted">{t('doneBody')}</p>
          </div>
        )}

        {(state === 'ready' || state === 'saving') && info && (
          <form onSubmit={submit}>
            <h1 className="text-[22px] font-black tracking-[-0.01em] text-ink-2">{t('title')}</h1>
            <p className="mt-1 text-sm text-text-muted">
              {t('subtitle', { event: info.eventName })}
            </p>
            <p className="mt-3 rounded-lg bg-surface-alt px-3 py-2 text-sm font-semibold text-ink-2">{info.email}</p>

            <label className="mt-5 block text-xs font-bold uppercase tracking-wide text-text-faint">{t('password')}</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 focus-within:border-green-brand">
              <Lock className="h-4 w-4 text-text-faint" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full bg-transparent py-2.5 text-[15px] outline-none"
                placeholder="••••••••"
              />
            </div>

            <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-text-faint">{t('confirmPassword')}</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 focus-within:border-green-brand">
              <Lock className="h-4 w-4 text-text-faint" />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                className="w-full bg-transparent py-2.5 text-[15px] outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="mt-3 text-sm font-semibold text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={state === 'saving'}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-green-brand py-3 text-[15px] font-bold text-white transition-colors hover:brightness-110 disabled:opacity-60"
            >
              {state === 'saving' && <Loader2 className="h-4 w-4 animate-spin" />}
              {t('submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
