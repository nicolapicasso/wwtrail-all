// lib/utils/encoding.ts
// UTF-8 normalization utilities for import/export

/**
 * Strip BOM (Byte Order Mark) from string
 */
function stripBOM(text: string): string {
  if (text.charCodeAt(0) === 0xFEFF) {
    return text.slice(1);
  }
  return text;
}

/**
 * Normalize Unicode to NFC form (composed characters)
 * e.g., 'é' as e+combining_accent → single 'é' codepoint
 */
function normalizeUnicode(text: string): string {
  return text.normalize('NFC');
}

/**
 * Fix common encoding corruption patterns
 * These occur when Latin-1/Windows-1252 bytes are misinterpreted as UTF-8
 */
const ENCODING_FIXES: [RegExp, string][] = [
  // Double-encoded UTF-8 (Latin-1 → UTF-8 → UTF-8)
  [/Ã¡/g, 'á'], [/Ã©/g, 'é'], [/Ã­/g, 'í'], [/Ã³/g, 'ó'], [/Ãº/g, 'ú'],
  [/Ã±/g, 'ñ'], [/Ã¼/g, 'ü'], [/Ã§/g, 'ç'],
  [/Ã /g, 'à'], [/Ã¨/g, 'è'], [/Ã¬/g, 'ì'], [/Ã²/g, 'ò'], [/Ã¹/g, 'ù'],
  [/Ã‰/g, 'É'], [/Ã"/g, 'Ó'], [/Ãš/g, 'Ú'], [/Ã'/g, 'Ñ'],
  [/Ã¶/g, 'ö'], [/Ã¤/g, 'ä'], [/Ã¢/g, 'â'], [/Ãª/g, 'ê'], [/Ã®/g, 'î'],
  [/Ã´/g, 'ô'], [/Ã»/g, 'û'],
  // Windows-1252 specific
  [/â€œ/g, '"'], [/â€\u009d/g, '"'], [/â€˜/g, '''], [/â€™/g, '''],
  [/â€"/g, '—'], [/â€"/g, '–'], [/â€¦/g, '…'],
  // Standalone replacement characters
  [/\uFFFD/g, ''],
];

/**
 * Fix a single string value: strip BOM, normalize Unicode, fix mojibake
 */
export function fixString(value: string): string {
  if (!value || typeof value !== 'string') return value;

  let result = stripBOM(value);

  // Apply mojibake fixes
  for (const [pattern, replacement] of ENCODING_FIXES) {
    result = result.replace(pattern, replacement);
  }

  // Remove orphan ?? replacement patterns (data already lost)
  result = result.replace(/\?\?/g, '');

  // Normalize Unicode
  result = normalizeUnicode(result);

  // Clean up double spaces left by removals
  result = result.replace(/\s{2,}/g, ' ').trim();

  return result;
}

/**
 * Recursively fix encoding in any data structure (object, array, string)
 * Returns a new object with all strings normalized
 */
export function fixEncoding(data: any): any {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    return fixString(data);
  }

  if (Array.isArray(data)) {
    return data.map(fixEncoding);
  }

  if (typeof data === 'object') {
    const fixed: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      fixed[key] = fixEncoding(value);
    }
    return fixed;
  }

  return data; // numbers, booleans, etc.
}

/**
 * Parse JSON with encoding normalization
 * Handles BOM, normalizes all strings in the parsed result
 */
export function parseJsonWithEncoding(text: string): any {
  const clean = stripBOM(text);
  const parsed = JSON.parse(clean);
  return fixEncoding(parsed);
}
