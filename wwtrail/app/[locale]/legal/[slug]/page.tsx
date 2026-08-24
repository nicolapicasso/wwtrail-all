import { LegalService, COOKIE_CATEGORIES } from '@/lib/services/legal.service';
import { CookieSettingsButton } from '@/components/cookies/CookieSettingsButton';

export const dynamic = 'force-dynamic';

const CAT_LABELS: Record<string, Record<string, string>> = {
  ES: { NECESSARY: 'Necesarias', PREFERENCES: 'Preferencias', ANALYTICS: 'Analíticas', MARKETING: 'Marketing' },
  EN: { NECESSARY: 'Necessary', PREFERENCES: 'Preferences', ANALYTICS: 'Analytics', MARKETING: 'Marketing' },
  IT: { NECESSARY: 'Necessari', PREFERENCES: 'Preferenze', ANALYTICS: 'Analitici', MARKETING: 'Marketing' },
  CA: { NECESSARY: 'Necessàries', PREFERENCES: 'Preferències', ANALYTICS: 'Analítiques', MARKETING: 'Màrqueting' },
  FR: { NECESSARY: 'Nécessaires', PREFERENCES: 'Préférences', ANALYTICS: 'Analytiques', MARKETING: 'Marketing' },
  DE: { NECESSARY: 'Notwendig', PREFERENCES: 'Präferenzen', ANALYTICS: 'Analyse', MARKETING: 'Marketing' },
};
const COLS: Record<string, [string, string, string, string]> = {
  ES: ['Cookie', 'Proveedor', 'Finalidad', 'Duración'],
  EN: ['Cookie', 'Provider', 'Purpose', 'Duration'],
  IT: ['Cookie', 'Fornitore', 'Finalità', 'Durata'],
  CA: ['Cookie', 'Proveïdor', 'Finalitat', 'Durada'],
  FR: ['Cookie', 'Fournisseur', 'Finalité', 'Durée'],
  DE: ['Cookie', 'Anbieter', 'Zweck', 'Dauer'],
};

export default async function LegalPage({ params }: { params: { locale: string; slug: string } }) {
  const { locale, slug } = params;
  const lang = (locale || 'es').toUpperCase();
  const page = await LegalService.getPage(slug, lang);
  const isCookies = slug.toLowerCase() === 'cookies';
  const cookies = isCookies ? await LegalService.listCookies(true) : [];
  const cats = CAT_LABELS[lang] || CAT_LABELS.ES;
  const cols = COLS[lang] || COLS.ES;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-[32px] font-black tracking-[-0.02em] text-ink-2">{page.title}</h1>

      {page.content ? (
        <div className="prose prose-neutral mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
      ) : (
        <p className="mt-6 text-text-muted">—</p>
      )}

      {isCookies && (
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-[22px] font-bold text-ink-2">{cols[0]}s</h2>
            <CookieSettingsButton />
          </div>
          {COOKIE_CATEGORIES.map((cat) => {
            const group = cookies.filter((c) => c.category === cat);
            if (group.length === 0) return null;
            return (
              <div key={cat} className="mb-8">
                <h3 className="mb-2 text-[16px] font-bold text-ink-2">{cats[cat]}</h3>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-alt text-text-faint">
                      <tr>{cols.map((c) => <th key={c} className="px-3 py-2 font-semibold">{c}</th>)}</tr>
                    </thead>
                    <tbody>
                      {group.map((c) => (
                        <tr key={c.id} className="border-t border-hairline">
                          <td className="px-3 py-2 font-semibold text-ink-2">{c.name}</td>
                          <td className="px-3 py-2 text-text-muted">{c.provider || '—'}</td>
                          <td className="px-3 py-2 text-text-muted">{c.purpose}</td>
                          <td className="px-3 py-2 text-text-muted">{c.duration || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
          {cookies.length === 0 && <p className="text-text-muted">No hay cookies registradas.</p>}
        </div>
      )}
    </div>
  );
}
