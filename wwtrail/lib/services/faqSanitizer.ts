// lib/services/faqSanitizer.ts
// Cleans AI-generated FAQ text so it never presents WWTRAIL as the official
// site of an event or tells users to register/sign up on WWTRAIL. Instead,
// offending sentences are replaced by a neutral pointer to the event's own
// official website. Runs at generation time and in a bulk cleanup over
// already-stored FAQs (no AI cost).

type Lang = 'ES' | 'EN' | 'IT' | 'CA' | 'FR' | 'DE';

const SAFE_SENTENCE: Record<Lang, string> = {
  ES: 'Para inscribirte y consultar la información oficial, visita la web oficial del evento.',
  EN: "To register and find official information, visit the event's official website.",
  IT: "Per iscriverti e trovare informazioni ufficiali, visita il sito ufficiale dell'evento.",
  CA: "Per inscriure't i consultar la informació oficial, visita el web oficial de l'esdeveniment.",
  FR: "Pour vous inscrire et trouver les informations officielles, visitez le site officiel de l'événement.",
  DE: 'Um dich anzumelden und offizielle Informationen zu finden, besuche die offizielle Website der Veranstaltung.',
};

const normLang = (l?: string | null): Lang => {
  const up = (l || 'ES').toUpperCase();
  return (['ES', 'EN', 'IT', 'CA', 'FR', 'DE'].includes(up) ? up : 'ES') as Lang;
};

// Accent- and case-insensitive haystack.
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const OFFICIAL_WORDS = /(oficial|official|ufficiale|officiel|offiziell)/;
// register / sign up / enroll across the 6 languages.
const REGISTER_WORDS = /(inscrib|inscri|registr|regist|apunt|iscriv|sign\s?-?up|sign up|anmeld|enroll)/;

/** True if a sentence wrongly frames WWTRAIL as official or as the place to register. */
function isOffending(sentence: string): boolean {
  const f = fold(sentence);
  if (!f.includes('wwtrail')) return false;
  return OFFICIAL_WORDS.test(f) || REGISTER_WORDS.test(f);
}

/**
 * Sanitize a block of FAQ text. Splits into sentences, replaces any offending
 * sentence with the localized safe pointer (deduplicated), and returns the
 * rejoined text. Returns { text, changed }.
 */
export function sanitizeText(text: string, language?: string): { text: string; changed: boolean } {
  if (!text) return { text, changed: false };
  const lang = normLang(language);
  const safe = SAFE_SENTENCE[lang];

  // Split keeping the delimiter so punctuation/spacing is preserved.
  const parts = text.match(/[^.!?]+[.!?]*\s*/g) || [text];
  let changed = false;
  let safeInserted = false;
  const out: string[] = [];

  for (const part of parts) {
    if (isOffending(part)) {
      changed = true;
      if (!safeInserted) { out.push(safe + ' '); safeInserted = true; }
      // otherwise drop the offending sentence entirely
    } else {
      out.push(part);
    }
  }

  let result = out.join('').replace(/\s+/g, ' ').trim();
  if (!result) result = safe;
  return { text: result, changed };
}

/** Known entity data used to resolve or drop leftover placeholders. */
export interface PlaceholderData {
  website?: string | null;
  city?: string | null;
  country?: string | null;
}

/**
 * Replace or remove leftover placeholder brackets like "[insertar URL]",
 * "[insertar localidad]", "[fecha de inicio]". Known placeholders (URL/web,
 * locality) are filled from the entity data; unknown ones are dropped, and the
 * surrounding punctuation/spacing is tidied so no awkward gaps remain.
 */
export function fillPlaceholders(text: string, data?: PlaceholderData): { text: string; changed: boolean } {
  if (!text || !text.includes('[')) return { text, changed: false };
  const web = data?.website || '';
  const city = data?.city || '';
  let changed = false;

  let out = text.replace(/\[[^\]]*\]/g, (match) => {
    changed = true;
    const f = fold(match);
    if (web && /(url|web|sitio|enlace|link|inscrip|registr)/.test(f)) return web;
    if (city && /(localidad|ciudad|poblaci|lugar|sede|municipi)/.test(f)) return city;
    return ''; // unknown placeholder → drop
  });

  if (changed) {
    out = out
      .replace(/\bdesde\s+hasta\b/gi, '')     // "desde [x] hasta [y]" → both dropped
      .replace(/\bentre\s+y\b/gi, '')          // "entre [x] y [y]" → both dropped
      .replace(/\(\s*\)/g, '')
      .replace(/([([]) +/g, '$1')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+([.,;:!?])/g, '$1')         // orphan space before punctuation (last)
      .trim();
  }
  return { text: out, changed };
}

/** Sanitize an array of { question, answer } FAQ items. */
export function sanitizeFaqItems(
  items: Array<{ question: string; answer: string }>,
  language?: string,
  data?: PlaceholderData
): { items: Array<{ question: string; answer: string }>; changed: boolean } {
  if (!Array.isArray(items)) return { items: [], changed: false };
  let changed = false;
  const cleaned = items.map((it) => {
    const q = sanitizeText(it.question || '', language);
    const qp = fillPlaceholders(q.text, data);
    const a = sanitizeText(it.answer || '', language);
    const ap = fillPlaceholders(a.text, data);
    if (q.changed || a.changed || qp.changed || ap.changed) changed = true;
    return { question: qp.text, answer: ap.text };
  });
  return { items: cleaned, changed };
}
