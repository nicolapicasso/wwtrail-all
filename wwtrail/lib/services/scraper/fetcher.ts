// lib/services/scraper/fetcher.ts
// Content acquisition for the scraper. Three strategies:
//  - static: plain fetch (works for server-rendered sites)
//  - render: headless Chromium via playwright-core (for SPAs like UTMB);
//            optional — only works if playwright-core is installed and a
//            Chromium executable is available.
//  - paste:  caller supplies raw HTML/text directly (always works)
// 'auto' tries static and, if the extracted text looks too thin (typical of a
// JS-only SPA shell), falls back to render when available.

import { existsSync } from 'fs';
import { assertSafeUrl } from '@/lib/utils/ssrf';
import logger from '@/lib/utils/logger';
import type { FetchMode } from './types';

// Resolve a Chromium executable for headless rendering. Prefers an explicit env
// var, then common system locations (Alpine's chromium package, dev browsers).
// Returns undefined to let playwright-core resolve its own bundled browser.
function resolveChromiumPath(): string | undefined {
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    process.env.CHROMIUM_PATH,
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/opt/pw-browsers/chromium/chrome-linux/chrome',
  ].filter(Boolean) as string[];
  for (const p of candidates) {
    try {
      if (existsSync(p)) return p;
    } catch {}
  }
  return undefined;
}

const USER_AGENT =
  'Mozilla/5.0 (compatible; WWTrailBot/1.0; +https://wwtrail.app) AppleWebKit/537.36';

// Minimum meaningful text length; below this a static fetch likely got an empty
// SPA shell and we should try rendering.
const THIN_TEXT_THRESHOLD = 600;

import type { SuggestedImage } from './types';

export interface FetchedContent {
  sourceUrl: string | null;
  usedMode: FetchMode;
  title: string | null;
  text: string;
  images: SuggestedImage[];
  warnings: string[];
}

/**
 * Strip a full HTML document down to readable text + <title>, and extract image
 * candidates. The text gets an "[IMAGES FOUND ON PAGE]" appendix so the AI can
 * pick a logo/cover from real URLs on the page.
 */
export function htmlToText(html: string, baseUrl?: string): { title: string | null; text: string; images: SuggestedImage[] } {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeEntities(titleMatch[1]).trim() : null;

  const images = extractImages(html, baseUrl || '');

  let body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  // Keep some structure: turn block boundaries into newlines.
  body = body
    .replace(/<\/(p|div|section|article|li|tr|h[1-6]|br)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, ' ');

  let text = decodeEntities(body)
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n')
    .trim();

  if (images.length > 0) {
    text +=
      '\n\n[IMAGES FOUND ON PAGE]:\n' +
      images.slice(0, 30).map((img) => `- ${img.url} (alt: ${img.alt || 'none'}, type: ${img.type})`).join('\n');
  }

  return { title, text, images };
}

// --- Image extraction (ported from ai-autofill.service) ---
function extractImages(html: string, baseUrl: string): SuggestedImage[] {
  const images: SuggestedImage[] = [];
  const seen = new Set<string>();
  const push = (rawSrc: string, alt: string, forced?: SuggestedImage['type']) => {
    const src = resolveImageUrl(rawSrc, baseUrl);
    if (src && !seen.has(src) && isValidImageUrl(src)) {
      seen.add(src);
      images.push({ url: src, alt, type: forced || classifyImage(src, alt) });
    }
  };

  let m: RegExpExecArray | null;
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/gi;
  while ((m = imgRegex.exec(html)) !== null) push(m[1], m[2] || '');

  const metaRegex = /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
  while ((m = metaRegex.exec(html)) !== null) push(m[1], 'Open Graph image', 'cover');

  const bgRegex = /background-image:\s*url\(["']?([^"')]+)["']?\)/gi;
  while ((m = bgRegex.exec(html)) !== null) push(m[1], '', 'cover');

  return images;
}

function resolveImageUrl(src: string, baseUrl: string): string | null {
  try {
    if (src.startsWith('data:')) return null;
    if (src.startsWith('//')) return 'https:' + src;
    if (src.startsWith('http')) return src;
    if (!baseUrl) return null;
    return new URL(src, new URL(baseUrl)).href;
  } catch {
    return null;
  }
}

function isValidImageUrl(url: string): boolean {
  const lower = url.toLowerCase();
  if (lower.includes('favicon')) return false;
  if (lower.includes('pixel') || lower.includes('tracking')) return false;
  if (lower.includes('1x1') || lower.includes('spacer')) return false;
  if (lower.endsWith('.svg') && lower.includes('icon')) return false;
  return true;
}

function classifyImage(url: string, alt: string): SuggestedImage['type'] {
  const lower = (url + ' ' + alt).toLowerCase();
  if (lower.includes('logo')) return 'logo';
  if (lower.includes('banner') || lower.includes('hero') || lower.includes('cover') || lower.includes('header')) return 'cover';
  if (lower.includes('gallery') || lower.includes('foto') || lower.includes('photo')) return 'gallery';
  return 'unknown';
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => {
      try { return String.fromCodePoint(Number(n)); } catch { return ' '; }
    });
}

async function fetchStatic(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml' },
    redirect: 'follow',
    // 20s cap
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    throw new Error(`El sitio respondió ${res.status} ${res.statusText}`);
  }
  return await res.text();
}

// Headless render via playwright-core. Optional dependency: imported dynamically
// so the app builds and runs even when it isn't installed.
async function fetchRendered(url: string): Promise<string> {
  let chromium: any;
  try {
    // Use a non-analyzable require so the bundler doesn't try to resolve the
    // optional dependency at build time. playwright-core is only needed at
    // runtime when headless rendering is actually requested.
    // eslint-disable-next-line no-eval
    const nodeRequire = eval('require') as NodeRequire;
    ({ chromium } = nodeRequire('playwright-core'));
  } catch {
    throw new Error(
      'Renderizado headless no disponible: instala "playwright-core" y configura ' +
        'PLAYWRIGHT_CHROMIUM_EXECUTABLE. Mientras tanto usa el modo "Pegar HTML".'
    );
  }

  const executablePath = resolveChromiumPath();

  const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    const page = await browser.newPage({ userAgent: USER_AGENT });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    // Give client-rendered lists a moment to populate.
    await page.waitForTimeout(1500);
    return await page.content();
  } finally {
    await browser.close();
  }
}

export async function fetchContent(input: {
  url?: string;
  html?: string;
  mode?: FetchMode;
}): Promise<FetchedContent> {
  const mode: FetchMode = input.mode || 'auto';
  const warnings: string[] = [];

  // Paste mode: caller provided HTML directly.
  if (mode === 'paste' || (input.html && !input.url)) {
    if (!input.html) throw new Error('No se ha proporcionado HTML para el modo pegar.');
    const { title, text, images } = htmlToText(input.html, input.url || '');
    return { sourceUrl: input.url || null, usedMode: 'paste', title, text, images, warnings };
  }

  if (!input.url) throw new Error('Falta la URL a escanear.');
  const safe = await assertSafeUrl(input.url);
  const url = safe.toString();

  if (mode === 'render') {
    const html = await fetchRendered(url);
    const { title, text, images } = htmlToText(html, url);
    return { sourceUrl: url, usedMode: 'render', title, text, images, warnings };
  }

  // static or auto
  let html = '';
  try {
    html = await fetchStatic(url);
  } catch (err: any) {
    if (mode === 'static') throw err;
    warnings.push(`Fetch estático falló (${err.message}); intentando renderizado…`);
  }

  let { title, text, images } = html
    ? htmlToText(html, url)
    : { title: null as string | null, text: '', images: [] as SuggestedImage[] };

  if (mode === 'auto' && text.length < THIN_TEXT_THRESHOLD) {
    // Likely an SPA shell — try rendering.
    try {
      const rendered = await fetchRendered(url);
      const r = htmlToText(rendered, url);
      if (r.text.length > text.length) {
        title = r.title || title;
        text = r.text;
        images = r.images;
        return { sourceUrl: url, usedMode: 'render', title, text, images, warnings };
      }
    } catch (err: any) {
      warnings.push(
        `Contenido escaso y sin renderizado headless (${err.message}). ` +
          'Si es un sitio JavaScript, usa el modo "Pegar HTML".'
      );
      logger.warn(`Scraper render fallback failed for ${url}: ${err.message}`);
    }
  }

  return { sourceUrl: url, usedMode: html ? 'static' : 'render', title, text, images, warnings };
}
