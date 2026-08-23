// lib/services/outreach.service.ts
// Daily outreach engine: reminders to organizers before each edition (T-60,
// T-30) and a post-event Magazine press request. Driven by a daily cron that
// hits /api/cron/outreach. Idempotent via the email_logs table, window-based,
// gated by the on/off switches in SiteConfig, and rendered from editable
// templates (OutreachEmailTemplate) with in-code defaults as fallback.

import prisma from '@/lib/db';
import logger from '@/lib/utils/logger';
import { sendEmail } from './mailer';
import { countryToLanguage } from './organizerInvite.service';
import OrganizerInviteService from './organizerInvite.service';
import { SiteConfigService } from './siteConfig.service';
import { OutreachTemplateService } from './outreachTemplate.service';

type EmailType = 'REMINDER_60' | 'REMINDER_30' | 'MAGAZINE';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://wwtrail.com';
const DAY = 24 * 60 * 60 * 1000;

async function alreadySent(entityId: string, emailType: EmailType | 'WELCOME'): Promise<boolean> {
  const found = await prisma.emailLog.findUnique({
    where: { entityType_entityId_emailType: { entityType: 'edition', entityId, emailType } },
    select: { id: true },
  });
  return !!found;
}

async function logSent(entityId: string, emailType: EmailType | 'WELCOME', recipient: string, entityType = 'edition') {
  await prisma.emailLog.create({ data: { entityType, entityId, emailType, recipient } });
}

/** Editions whose startDate falls in [from, to) with their event contact info. */
async function editionsInWindow(from: Date, to: Date) {
  return prisma.edition.findMany({
    where: { startDate: { gte: from, lt: to } },
    select: {
      id: true, slug: true, startDate: true,
      competition: { select: { name: true, event: { select: { name: true, email: true, country: true } } } },
    },
  });
}

async function processWindow(
  editions: Awaited<ReturnType<typeof editionsInWindow>>,
  emailType: EmailType,
  templateType: 'REMINDER' | 'MAGAZINE',
  days: number | null,
  opts: { dryRun: boolean; enabled: boolean }
): Promise<number> {
  let count = 0;
  for (const ed of editions) {
    const email = (ed.competition?.event?.email || '').trim().toLowerCase();
    if (!email) continue;
    if (await alreadySent(ed.id, emailType)) continue;
    count++;
    if (opts.dryRun || !opts.enabled) continue;
    const lang = countryToLanguage(ed.competition?.event?.country);
    const link = `${APP_URL}/${lang.toLowerCase()}/organizer/events`;
    const vars: Record<string, string | number> = {
      eventName: ed.competition?.event?.name || '',
      competitionName: ed.competition?.name || '',
      link,
      ...(days != null ? { days } : {}),
    };
    try {
      const { subject, html } = await OutreachTemplateService.getRendered(templateType, lang, vars);
      await sendEmail({ to: email, subject, html });
      await logSent(ed.id, emailType, email);
    } catch (e: any) {
      logger.error(`[outreach] ${emailType} to ${email} failed: ${e?.message || e}`);
    }
  }
  return count;
}

export const OutreachService = {
  async runDaily(opts: { dryRun?: boolean } = {}): Promise<{
    dryRun: boolean; enabled: boolean; reminder60: number; reminder30: number; magazine: number;
  }> {
    const dryRun = !!opts.dryRun;
    const flags = await SiteConfigService.getOutreachFlags();

    if (!flags.outreachEnabled && !dryRun) {
      return { dryRun, enabled: false, reminder60: 0, reminder30: 0, magazine: 0 };
    }

    const now = new Date();
    const in30 = new Date(now.getTime() + 30 * DAY);
    const in60 = new Date(now.getTime() + 60 * DAY);
    const ago14 = new Date(now.getTime() - 14 * DAY);
    const send = flags.outreachEnabled;

    const w60 = await editionsInWindow(in30, in60);
    const reminder60 = await processWindow(w60, 'REMINDER_60', 'REMINDER', 60, { dryRun, enabled: send && flags.reminder });

    const w30 = await editionsInWindow(now, in30);
    const reminder30 = await processWindow(w30, 'REMINDER_30', 'REMINDER', 30, { dryRun, enabled: send && flags.reminder });

    const wMag = await editionsInWindow(ago14, now);
    const magazine = await processWindow(wMag, 'MAGAZINE', 'MAGAZINE', null, { dryRun, enabled: send && flags.magazine });

    logger.info(`[outreach] run dryRun=${dryRun} enabled=${flags.outreachEnabled} reminder60=${reminder60} reminder30=${reminder30} magazine=${magazine}`);
    return { dryRun, enabled: flags.outreachEnabled, reminder60, reminder30, magazine };
  },

  /**
   * Send the onboarding/welcome invite once when an event is created. Best-effort
   * and idempotent (logged as WELCOME on the event). Never throws to the caller.
   */
  async sendWelcome(eventId: string, adminId: string): Promise<void> {
    try {
      const flags = await SiteConfigService.getOutreachFlags();
      if (!flags.outreachEnabled || !flags.welcome) return;
      const existing = await prisma.emailLog.findUnique({
        where: { entityType_entityId_emailType: { entityType: 'event', entityId: eventId, emailType: 'WELCOME' } },
        select: { id: true },
      });
      if (existing) return;
      const res = await OrganizerInviteService.createInvite(eventId, adminId);
      if (res.sent && res.email) {
        await logSent(eventId, 'WELCOME', res.email, 'event');
      }
    } catch (e: any) {
      logger.error(`[outreach] welcome for event ${eventId} failed: ${e?.message || e}`);
    }
  },
};

export default OutreachService;
