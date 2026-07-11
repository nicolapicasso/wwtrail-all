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

export interface FetchedContent {
  sourceUrl: string | null;
  usedMode: FetchMode;
  title: string | null;
  text: string;
  warnings: string[];
}

/** Strip a full HTML document down to readable text + <title>. */
export function htmlToText(html: string): { title: string | null; text: string } {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeEntities(titleMatch[1]).trim() : null;

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

  const text = decodeEntities(body)
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n')
    .trim();

  return { title, text };
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
    const { title, text } = htmlToText(input.html);
    return { sourceUrl: input.url || null, usedMode: 'paste', title, text, warnings };
  }

  if (!input.url) throw new Error('Falta la URL a escanear.');
  const safe = await assertSafeUrl(input.url);
  const url = safe.toString();

  if (mode === 'render') {
    const html = await fetchRendered(url);
    const { title, text } = htmlToText(html);
    return { sourceUrl: url, usedMode: 'render', title, text, warnings };
  }

  // static or auto
  let html = '';
  try {
    html = await fetchStatic(url);
  } catch (err: any) {
    if (mode === 'static') throw err;
    warnings.push(`Fetch estático falló (${err.message}); intentando renderizado…`);
  }

  let { title, text } = html ? htmlToText(html) : { title: null, text: '' };

  if (mode === 'auto' && text.length < THIN_TEXT_THRESHOLD) {
    // Likely an SPA shell — try rendering.
    try {
      const rendered = await fetchRendered(url);
      const r = htmlToText(rendered);
      if (r.text.length > text.length) {
        title = r.title || title;
        text = r.text;
        return { sourceUrl: url, usedMode: 'render', title, text, warnings };
      }
    } catch (err: any) {
      warnings.push(
        `Contenido escaso y sin renderizado headless (${err.message}). ` +
          'Si es un sitio JavaScript, usa el modo "Pegar HTML".'
      );
      logger.warn(`Scraper render fallback failed for ${url}: ${err.message}`);
    }
  }

  return { sourceUrl: url, usedMode: html ? 'static' : 'render', title, text, warnings };
}
