// lib/services/marketingDigest.service.ts
// Weekly "new competitions in your country" digest for opted-in end users.
// Gated by SiteConfig.marketingDigestEnabled; only emails users with
// marketingOptIn=true and a country; skips users whose country has no new
// competitions; idempotent per ISO week via email_logs.

import prisma from '@/lib/db';
import logger from '@/lib/utils/logger';
import { sendEmail } from './mailer';
import { SiteConfigService } from './siteConfig.service';
import { unsubscribeBlock } from './marketing.service';
import { emailShell } from './emailContent.defaults';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://wwtrail.com';
const DAY = 24 * 60 * 60 * 1000;

type Lang = 'ES' | 'EN' | 'IT' | 'CA' | 'FR' | 'DE';
const LANGS: Lang[] = ['ES', 'EN', 'IT', 'CA', 'FR', 'DE'];
const normLang = (l?: string | null): Lang => {
  const up = (l || '').toUpperCase();
  return (LANGS.includes(up as Lang) ? up : 'ES') as Lang;
};

const WORDS: Record<Lang, { subject: string; heading: string; greet: string; intro: string; cta: string }> = {
  ES: { subject: 'Nuevas competiciones cerca de ti', heading: 'Novedades de trail en tu zona', greet: 'Hola', intro: 'Estas competiciones se han añadido recientemente cerca de ti:', cta: 'Descubrir más en WWTRAIL' },
  EN: { subject: 'New races near you', heading: 'New trail races in your area', greet: 'Hi', intro: 'These competitions were recently added near you:', cta: 'Discover more on WWTRAIL' },
  IT: { subject: 'Nuove gare vicino a te', heading: 'Novità trail nella tua zona', greet: 'Ciao', intro: 'Queste competizioni sono state aggiunte di recente vicino a te:', cta: 'Scopri di più su WWTRAIL' },
  CA: { subject: 'Noves competicions a prop teu', heading: 'Novetats de trail a la teva zona', greet: 'Hola', intro: 'Aquestes competicions s’han afegit recentment a prop teu:', cta: 'Descobreix-ne més a WWTRAIL' },
  FR: { subject: 'Nouvelles courses près de chez vous', heading: 'Nouveautés trail dans votre région', greet: 'Bonjour', intro: 'Ces compétitions ont été ajoutées récemment près de chez vous :', cta: 'Découvrir plus sur WWTRAIL' },
  DE: { subject: 'Neue Rennen in deiner Nähe', heading: 'Neue Trail-Rennen in deiner Region', greet: 'Hallo', intro: 'Diese Wettkämpfe wurden kürzlich in deiner Nähe hinzugefügt:', cta: 'Mehr auf WWTRAIL entdecken' },
};

function isoWeekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((date.getTime() - firstThursday.getTime()) / DAY - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** New (recently created), upcoming, published competitions in a country. */
async function newCompetitionsInCountry(country: string, since: Date, lang: Lang, now: Date) {
  const comps = await prisma.competition.findMany({
    where: {
      createdAt: { gte: since },
      status: 'PUBLISHED',
      event: { country: country.toUpperCase().slice(0, 2) },
    },
    select: {
      name: true, slug: true,
      event: { select: { slug: true, name: true } },
      editions: { where: { startDate: { gte: now } }, orderBy: { startDate: 'asc' }, take: 1, select: { startDate: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });
  return comps
    .filter((c) => c.event?.slug)
    .map((c) => {
      const date = c.editions?.[0]?.startDate
        ? new Date(c.editions[0].startDate).toLocaleDateString(`${lang.toLowerCase()}-${country.toUpperCase()}`, { day: 'numeric', month: 'long', year: 'numeric' })
        : '';
      const url = `${APP_URL}/${lang.toLowerCase()}/events/${c.event.slug}/${c.slug}`;
      return `<tr><td style="padding:8px 0;border-bottom:1px solid #eef0f3">
        <a href="${url}" style="color:#0E612F;font-weight:700;text-decoration:none;font-size:15px">${c.name}</a>
        <div style="color:#8b95a0;font-size:13px">${c.event.name}${date ? ' · ' + date : ''}</div>
      </td></tr>`;
    });
}

export const MarketingDigestService = {
  async runWeekly(opts: { dryRun?: boolean } = {}): Promise<{ dryRun: boolean; enabled: boolean; sent: number; skippedNoNews: number }> {
    const dryRun = !!opts.dryRun;
    const enabled = await SiteConfigService.getMarketingDigestEnabled();
    if (!enabled && !dryRun) return { dryRun, enabled: false, sent: 0, skippedNoNews: 0 };

    const now = new Date();
    const since = new Date(now.getTime() - 7 * DAY);
    const weekKey = isoWeekKey(now);

    const users = await prisma.user.findMany({
      where: { marketingOptIn: true, isActive: true, role: 'ATHLETE', country: { not: null } },
      select: { id: true, email: true, firstName: true, language: true, country: true },
    });

    // Cache new-competition lists per (country, lang) to avoid repeat queries.
    const cache = new Map<string, string[]>();
    let sent = 0, skippedNoNews = 0;

    for (const u of users) {
      const country = (u.country || '').toUpperCase().slice(0, 2);
      if (!country) continue;
      const lang = normLang(u.language);
      const cacheKey = `${country}:${lang}`;
      if (!cache.has(cacheKey)) cache.set(cacheKey, await newCompetitionsInCountry(country, since, lang, now));
      const rows = cache.get(cacheKey)!;
      if (rows.length === 0) { skippedNoNews++; continue; }

      // Idempotent per ISO week.
      const emailType = `DIGEST_${weekKey}`;
      const already = await prisma.emailLog.findUnique({
        where: { entityType_entityId_emailType: { entityType: 'user', entityId: u.id, emailType } },
        select: { id: true },
      });
      if (already) continue;

      if (dryRun) { sent++; continue; }

      const w = WORDS[lang];
      const { footer } = unsubscribeBlock(u.id, lang);
      const body = `${w.greet}${u.firstName ? ' ' + u.firstName : ''},<br><br>${w.intro}
        <table style="width:100%;border-collapse:collapse;margin-top:12px">${rows.join('')}</table>`;
      const html = emailShell(w.heading, body, w.cta, `${APP_URL}/${lang.toLowerCase()}/calendar`, '') + footer;

      try {
        await sendEmail({ to: u.email, subject: w.subject, html });
        await prisma.emailLog.create({ data: { entityType: 'user', entityId: u.id, emailType, recipient: u.email } });
        sent++;
      } catch (e: any) {
        logger.error(`[digest] ${u.email} failed: ${e?.message || e}`);
      }
    }

    logger.info(`[digest] run dryRun=${dryRun} enabled=${enabled} sent=${sent} skippedNoNews=${skippedNoNews}`);
    return { dryRun, enabled, sent, skippedNoNews };
  },
};

export default MarketingDigestService;
