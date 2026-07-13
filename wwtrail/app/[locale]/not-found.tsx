'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

// Self-contained 404 page. It deliberately avoids next-intl message lookups so
// it can never itself throw while rendering the error boundary. Rendered inside
// the [locale] layout, which already provides <html>/<body>.
const COPY: Record<string, { title: string; body: string; home: string }> = {
  es: { title: 'Página no encontrada', body: 'La página que buscas no existe o ha sido movida.', home: 'Volver al inicio' },
  en: { title: 'Page not found', body: "The page you're looking for doesn't exist or has been moved.", home: 'Back to home' },
  it: { title: 'Pagina non trovata', body: 'La pagina che cerchi non esiste o è stata spostata.', home: 'Torna alla home' },
  ca: { title: 'Pàgina no trobada', body: 'La pàgina que busques no existeix o s’ha mogut.', home: 'Torna a l’inici' },
  fr: { title: 'Page introuvable', body: 'La page que vous recherchez n’existe pas ou a été déplacée.', home: 'Retour à l’accueil' },
  de: { title: 'Seite nicht gefunden', body: 'Die gesuchte Seite existiert nicht oder wurde verschoben.', home: 'Zur Startseite' },
};

export default function NotFound() {
  const locale = useLocale();
  const t = COPY[locale] || COPY.es;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-[64px] font-black leading-none tracking-tight text-ink-2">404</p>
      <h1 className="mt-4 text-[24px] font-bold text-ink-2">{t.title}</h1>
      <p className="mt-2 max-w-md text-[15px] text-text-muted">{t.body}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 inline-flex items-center rounded-md bg-green-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green"
      >
        {t.home}
      </Link>
    </div>
  );
}
