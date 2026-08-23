'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function UnsubscribePage() {
  const params = useParams();
  const token = params?.token as string;
  const [state, setState] = useState<'working' | 'done' | 'error'>('working');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/v2/marketing/unsubscribe?token=${encodeURIComponent(token)}`);
        const json = await res.json();
        setState(res.ok && json?.success ? 'done' : 'error');
      } catch {
        setState('error');
      }
    })();
  }, [token]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
        {state === 'working' && (
          <>
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-green-brand" />
            <p className="text-sm text-text-muted">Procesando tu baja…</p>
          </>
        )}
        {state === 'done' && (
          <>
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-brand" />
            <h1 className="text-lg font-bold text-ink-2">Te has dado de baja</h1>
            <p className="mt-1 text-sm text-text-muted">Ya no recibirás más correos de marketing de WWTRAIL. Puedes volver a activarlos desde tu perfil cuando quieras.</p>
          </>
        )}
        {state === 'error' && (
          <>
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
            <h1 className="text-lg font-bold text-ink-2">No se pudo procesar</h1>
            <p className="mt-1 text-sm text-text-muted">El enlace no es válido. Si sigues recibiendo correos, contáctanos.</p>
          </>
        )}
      </div>
    </div>
  );
}
