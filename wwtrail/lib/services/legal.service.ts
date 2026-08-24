// lib/services/legal.service.ts
// Editable legal pages (privacy/cookies/terms) per language, plus the dynamic
// cookie catalog that feeds the consent banner and the cookie policy page.

import prisma from '@/lib/db';

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
};

export default LegalService;
