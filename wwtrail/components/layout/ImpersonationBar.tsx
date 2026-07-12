'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, LogOut, Loader2 } from 'lucide-react';
import { getImpersonatedName, stopImpersonation } from '@/lib/impersonation';

// Shown at the top of the dashboard while an admin is viewing the backoffice as
// another user. Reads the client-side `imp` cookie set on start.
export function ImpersonationBar() {
  const t = useTranslations('cmpLayout');
  const [name, setName] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setName(getImpersonatedName());
  }, []);

  if (!name) return null;

  return (
    <div className="sticky top-0 z-40 flex items-center justify-center gap-3 bg-amber-500 px-4 py-2 text-sm font-semibold text-[#241202] shadow">
      <Eye className="h-4 w-4" />
      <span>
        {t.rich('impersonationViewingAs', {
          name,
          b: (chunks) => <b>{chunks}</b>,
        })}
      </span>
      <button
        onClick={async () => {
          setLeaving(true);
          try {
            await stopImpersonation();
          } catch {
            setLeaving(false);
          }
        }}
        disabled={leaving}
        className="ml-2 inline-flex items-center gap-1.5 rounded-md bg-[#241202]/90 px-3 py-1 text-xs font-bold text-amber-100 hover:bg-[#241202] disabled:opacity-60"
      >
        {leaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
        {t('impersonationExit')}
      </button>
    </div>
  );
}
