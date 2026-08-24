// lib/services/marketing.service.ts
// End-user marketing: explicit-consent audience, bulk import of already-consented
// users (migrated from a previous system), segmenting, one-off broadcasts, and
// unsubscribe. Every marketing email carries a localized unsubscribe footer.

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import logger from '@/lib/utils/logger';
import { sendEmail } from './mailer';
import { renderVars } from './emailContent.defaults';

const JWT_SECRET = process.env.JWT_SECRET || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://wwtrail.com';

type Lang = 'ES' | 'EN' | 'IT' | 'CA' | 'FR' | 'DE';
const LANGS: Lang[] = ['ES', 'EN', 'IT', 'CA', 'FR', 'DE'];
const normLang = (l?: string | null): Lang => {
  const up = (l || '').toUpperCase();
  return (LANGS.includes(up as Lang) ? up : 'ES') as Lang;
};

interface ImportRow {
  email: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  language?: string;
}

interface SegmentFilters {
  country?: string;
  language?: string;
}

const UNSUB_LABEL: Record<Lang, string> = {
  ES: 'Si no quieres recibir más correos, date de baja aquí',
  EN: 'If you no longer want these emails, unsubscribe here',
  IT: 'Se non vuoi più ricevere queste email, annulla l’iscrizione qui',
  CA: 'Si no vols rebre més correus, dona’t de baixa aquí',
  FR: 'Si vous ne souhaitez plus recevoir ces e-mails, désabonnez-vous ici',
  DE: 'Wenn du diese E-Mails nicht mehr erhalten möchtest, melde dich hier ab',
};

function unsubToken(userId: string): string {
  return jwt.sign({ purpose: 'unsub', uid: userId }, JWT_SECRET, { expiresIn: '3650d' });
}
function unsubLink(userId: string, lang: Lang): string {
  return `${APP_URL}/${lang.toLowerCase()}/unsubscribe/${unsubToken(userId)}`;
}
function unsubFooter(lang: Lang, link: string): string {
  return `<div style="max-width:560px;margin:8px auto 24px;text-align:center;font-family:Helvetica,Arial,sans-serif">
    <a href="${link}" style="color:#8b95a0;font-size:12px">${UNSUB_LABEL[lang]}</a>
  </div>`;
}

/** Public helper: per-user unsubscribe link + localized footer HTML. */
export function unsubscribeBlock(userId: string, lang: string): { link: string; footer: string } {
  const l = normLang(lang);
  const link = unsubLink(userId, l);
  return { link, footer: unsubFooter(l, link) };
}

export const MarketingService = {
  /** Bulk-import already-consented users (migrated). Creates missing ones. */
  async importConsentedUsers(rows: ImportRow[]): Promise<{ created: number; updated: number; skipped: number }> {
    let created = 0, updated = 0, skipped = 0;
    for (const row of rows) {
      const email = (row.email || '').trim().toLowerCase();
      if (!email || !email.includes('@')) { skipped++; continue; }
      const lang = normLang(row.language);
      const country = row.country ? row.country.trim().toUpperCase().slice(0, 2) : undefined;
      try {
        const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
        if (existing) {
          await prisma.user.update({
            where: { id: existing.id },
            data: { marketingOptIn: true, marketingOptInAt: new Date() },
          });
          updated++;
        } else {
          const randomPass = await bcrypt.hash(`${Math.random()}${Date.now()}`, 10);
          const base = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20) || 'user';
          await prisma.user.create({
            data: {
              email,
              username: `${base}-${Math.random().toString(36).slice(2, 6)}`,
              password: randomPass,
              role: 'ATHLETE',
              isActive: true,
              firstName: row.firstName?.trim() || null,
              lastName: row.lastName?.trim() || null,
              country: country || null,
              language: lang as any,
              marketingOptIn: true,
              marketingOptInAt: new Date(),
            },
          });
          created++;
        }
      } catch (e: any) {
        logger.warn(`[marketing-import] ${email} failed: ${e?.message || e}`);
        skipped++;
      }
    }
    logger.info(`[marketing-import] created=${created} updated=${updated} skipped=${skipped}`);
    return { created, updated, skipped };
  },

  /** Opted-in end users matching the segment filters. */
  async segment(filters: SegmentFilters = {}) {
    const where: any = { marketingOptIn: true, isActive: true, role: 'ATHLETE' };
    if (filters.country) where.country = filters.country.toUpperCase().slice(0, 2);
    if (filters.language) where.language = normLang(filters.language);
    return prisma.user.findMany({
      where,
      select: { id: true, email: true, firstName: true, language: true, country: true },
    });
  },

  async segmentCount(filters: SegmentFilters = {}): Promise<number> {
    const where: any = { marketingOptIn: true, isActive: true, role: 'ATHLETE' };
    if (filters.country) where.country = filters.country.toUpperCase().slice(0, 2);
    if (filters.language) where.language = normLang(filters.language);
    return prisma.user.count({ where });
  },

  /** Send a one-off broadcast to a segment (opted-in only). */
  async broadcast(params: {
    subject: string; html: string; filters?: SegmentFilters; dryRun?: boolean;
  }): Promise<{ total: number; sent: number; dryRun: boolean }> {
    const users = await this.segment(params.filters || {});
    let sent = 0;
    for (const u of users) {
      const lang = normLang(u.language);
      const link = unsubLink(u.id, lang);
      const vars = { firstName: u.firstName || '', unsubscribeLink: link };
      const subject = renderVars(params.subject, vars);
      const html = renderVars(params.html, vars) + unsubFooter(lang, link);
      if (params.dryRun) { sent++; continue; }
      try {
        await sendEmail({ to: u.email, subject, html });
        sent++;
      } catch (e: any) {
        logger.error(`[marketing-broadcast] ${u.email} failed: ${e?.message || e}`);
      }
    }
    logger.info(`[marketing-broadcast] total=${users.length} sent=${sent} dryRun=${!!params.dryRun}`);
    return { total: users.length, sent, dryRun: !!params.dryRun };
  },

  /** Send a single preview email to an arbitrary address. */
  async sendTest(params: { subject: string; html: string; to: string; language?: string }): Promise<void> {
    const lang = normLang(params.language);
    const sampleLink = `${APP_URL}/${lang.toLowerCase()}/unsubscribe/sample`;
    const vars = { firstName: 'Nombre', unsubscribeLink: sampleLink };
    const subject = `[PRUEBA] ${renderVars(params.subject, vars)}`;
    const html = renderVars(params.html, vars) + unsubFooter(lang, sampleLink);
    await sendEmail({ to: params.to, subject, html });
  },

  /** Set a user's opt-out from an unsubscribe token. */
  async unsubscribe(token: string): Promise<{ ok: boolean }> {
    const decoded = jwt.verify(token, JWT_SECRET) as { purpose?: string; uid?: string };
    if (decoded.purpose !== 'unsub' || !decoded.uid) throw new Error('Invalid unsubscribe token');
    await prisma.user.update({ where: { id: decoded.uid }, data: { marketingOptIn: false } });
    return { ok: true };
  },
};

export default MarketingService;
