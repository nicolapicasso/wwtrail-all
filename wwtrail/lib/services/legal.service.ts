// lib/services/legal.service.ts
// Editable legal pages (privacy/cookies/terms) per language, plus the dynamic
// cookie catalog that feeds the consent banner and the cookie policy page.

import prisma from '@/lib/db';
import { SiteConfigService } from '@/lib/services/siteConfig.service';
import { NECESSARY_COOKIES, INTEGRATION_COOKIES, RegistryCookie } from '@/lib/services/cookieRegistry';

export type CookieCategory = 'NECESSARY' | 'PREFERENCES' | 'ANALYTICS' | 'MARKETING';
export const COOKIE_CATEGORIES: CookieCategory[] = ['NECESSARY', 'PREFERENCES', 'ANALYTICS', 'MARKETING'];

const DEFAULT_TITLES: Record<string, string> = {
  privacy: 'Política de privacidad',
  cookies: 'Política de cookies',
  terms: 'Términos y condiciones',
};

export const LegalService = {
  /** Legal page for slug+language, falling back to ES then to an empty default. */
  async getPage(slug: string, language: string): Promise<{ slug: string; language: string; title: string; content: string; isCustom: boolean }> {
    const s = slug.toLowerCase();
    const l = (language || 'ES').toUpperCase();
    let row = await prisma.legalPage.findUnique({ where: { slug_language: { slug: s, language: l } } });
    if (!row && l !== 'ES') {
      row = await prisma.legalPage.findUnique({ where: { slug_language: { slug: s, language: 'ES' } } });
    }
    if (row) return { slug: s, language: l, title: row.title, content: row.content, isCustom: true };
    return { slug: s, language: l, title: DEFAULT_TITLES[s] || s, content: '', isCustom: false };
  },

  async upsertPage(slug: string, language: string, title: string, content: string) {
    const s = slug.toLowerCase();
    const l = (language || 'ES').toUpperCase();
    return prisma.legalPage.upsert({
      where: { slug_language: { slug: s, language: l } },
      update: { title, content },
      create: { slug: s, language: l, title, content },
    });
  },

  // ---- Cookie catalog ----
  async listCookies(activeOnly = false) {
    return prisma.cookieDefinition.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    });
  },

  async createCookie(data: { name: string; category: string; provider?: string; purpose: string; duration?: string; isActive?: boolean; sortOrder?: number }) {
    return prisma.cookieDefinition.create({
      data: {
        name: data.name,
        category: (data.category || 'NECESSARY').toUpperCase(),
        provider: data.provider || null,
        purpose: data.purpose,
        duration: data.duration || null,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  },

  async updateCookie(id: string, data: any) {
    const patch: any = {};
    for (const k of ['name', 'provider', 'purpose', 'duration', 'sortOrder', 'isActive']) {
      if (data[k] !== undefined) patch[k] = data[k];
    }
    if (data.category !== undefined) patch.category = String(data.category).toUpperCase();
    return prisma.cookieDefinition.update({ where: { id }, data: patch });
  },

  async deleteCookie(id: string) {
    await prisma.cookieDefinition.delete({ where: { id } });
    return { deleted: true };
  },

  /**
   * Auto-seed the cookie catalog from the configured integrations. Adds the
   * standard cookies of each active integration (GA4/Ads via GTM, Brevo) plus
   * the platform's own necessary cookies. Matches by name (case-insensitive)
   * and never overwrites an existing entry, so manual edits are preserved —
   * it only fills in what is missing. Returns which cookies were added/skipped.
   */
  async seedFromIntegrations(): Promise<{ added: string[]; skipped: string[]; integrations: string[] }> {
    const cfg = await SiteConfigService.getAnalyticsConfig();

    const integrations: string[] = [];
    const wanted: RegistryCookie[] = [...NECESSARY_COOKIES];

    // GA cookies apply when GA4 is configured directly OR routed through GTM
    // (the common case). GTM alone is a loader and sets no cookies of its own.
    if (cfg.gaMeasurementId || cfg.gtmContainerId) {
      wanted.push(...INTEGRATION_COOKIES.ga);
      integrations.push(cfg.gtmContainerId ? 'Google Analytics (vía GTM)' : 'Google Analytics');
    }
    // A GTM container may route Google Ads tags → include the conversion linker.
    if (cfg.gtmContainerId) {
      wanted.push(...INTEGRATION_COOKIES.ads);
      integrations.push('Google Tag Manager');
    }
    if (cfg.brevoTrackerId) {
      wanted.push(...INTEGRATION_COOKIES.brevo);
      integrations.push('Brevo');
    }

    const existing = await prisma.cookieDefinition.findMany({ select: { name: true } });
    const existingNames = new Set(existing.map((c) => c.name.toLowerCase()));

    const added: string[] = [];
    const skipped: string[] = [];
    let sortOrder = 0;

    for (const c of wanted) {
      if (existingNames.has(c.name.toLowerCase())) {
        skipped.push(c.name);
        continue;
      }
      await prisma.cookieDefinition.create({
        data: {
          name: c.name,
          category: c.category,
          provider: c.provider,
          purpose: c.purpose,
          duration: c.duration,
          isActive: true,
          sortOrder: sortOrder++,
        },
      });
      existingNames.add(c.name.toLowerCase());
      added.push(c.name);
    }

    return { added, skipped, integrations };
  },
};

export default LegalService;
