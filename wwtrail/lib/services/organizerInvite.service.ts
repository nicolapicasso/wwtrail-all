// lib/services/organizerInvite.service.ts
// Phase 1 of organizer outreach: invite the organizer of an event to manage it.
// Creates (or reuses) an ORGANIZER user, links them as EventManager, and emails
// a magic link — a short-lived signed JWT, so no DB schema change is needed —
// that lets them set their password and take control of their event.
// The email is localised to the event's country.

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import logger from '@/lib/utils/logger';
import { sendEmail } from './mailer';
import { OutreachTemplateService } from './outreachTemplate.service';

const JWT_SECRET = process.env.JWT_SECRET || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://wwtrail.com';
const INVITE_TTL = '30d';

type Lang = 'ES' | 'EN' | 'IT' | 'CA' | 'FR' | 'DE';

interface InvitePayload {
  purpose: 'organizer-invite';
  uid: string;
  eid: string;
}

/** Map an event country (ISO-2) to the language we email its organizer in. */
export function countryToLanguage(country?: string | null): Lang {
  switch ((country || '').toUpperCase()) {
    case 'ES': return 'ES';
    case 'AD': return 'CA'; // Andorra → Catalan
    case 'FR': return 'FR';
    case 'IT': return 'IT';
    case 'DE':
    case 'AT':
    case 'CH': return 'DE';
    default: return 'EN';
  }
}

export const OrganizerInviteService = {
  /** Create/reuse the organizer user, link as manager, and email a magic link. */
  async createInvite(eventId: string, adminId: string): Promise<{ sent: boolean; email: string | null; reason?: string }> {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true, name: true, email: true, country: true, userId: true,
      },
    });
    if (!event) throw new Error('Event not found');

    const email = (event.email || '').trim().toLowerCase();
    if (!email) return { sent: false, email: null, reason: 'no-organizer-email' };

    const lang = countryToLanguage(event.country);

    // Find or create the organizer user.
    let user = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true } });
    if (!user) {
      const randomPass = await bcrypt.hash(`${Math.random()}${Date.now()}`, 10);
      const username = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20) || `org${Date.now()}`;
      user = await prisma.user.create({
        data: {
          email,
          username: `${username}-${Math.random().toString(36).slice(2, 6)}`,
          password: randomPass,
          role: 'ORGANIZER',
          isActive: true,
          language: lang as any,
        },
        select: { id: true, role: true },
      });
    }

    // Link as EventManager unless they already own the event.
    if (event.userId !== user.id) {
      await prisma.eventManager.upsert({
        where: { eventId_userId: { eventId, userId: user.id } },
        update: {},
        create: { eventId, userId: user.id, assignedById: adminId },
      });
    }

    // Magic link (short-lived signed JWT — no DB token needed).
    const token = jwt.sign(
      { purpose: 'organizer-invite', uid: user.id, eid: eventId } as InvitePayload,
      JWT_SECRET,
      { expiresIn: INVITE_TTL }
    );
    const link = `${APP_URL}/${lang.toLowerCase()}/invite/${token}`;

    const { subject, html } = await OutreachTemplateService.getRendered('WELCOME', lang, {
      eventName: event.name,
      link,
    });
    await sendEmail({ to: email, subject, html });

    logger.info(`[organizer-invite] sent to ${email} for event ${eventId} (${lang})`);
    return { sent: true, email };
  },

  /** Validate an invite token and return who/what it is for. */
  async verifyInvite(token: string): Promise<{ userId: string; eventId: string; email: string; eventName: string }> {
    const decoded = jwt.verify(token, JWT_SECRET) as InvitePayload;
    if (decoded.purpose !== 'organizer-invite') throw new Error('Invalid invite token');
    const [user, event] = await Promise.all([
      prisma.user.findUnique({ where: { id: decoded.uid }, select: { email: true } }),
      prisma.event.findUnique({ where: { id: decoded.eid }, select: { name: true } }),
    ]);
    if (!user || !event) throw new Error('Invite target not found');
    return { userId: decoded.uid, eventId: decoded.eid, email: user.email, eventName: event.name };
  },

  /** Accept the invite: set the password and activate the account. */
  async acceptInvite(token: string, password: string): Promise<{ userId: string }> {
    const decoded = jwt.verify(token, JWT_SECRET) as InvitePayload;
    if (decoded.purpose !== 'organizer-invite') throw new Error('Invalid invite token');
    if (!password || password.length < 8) throw new Error('Password must be at least 8 characters');
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: decoded.uid },
      data: { password: hashed, isActive: true },
    });
    logger.info(`[organizer-invite] accepted by user ${decoded.uid}`);
    return { userId: decoded.uid };
  },
};

export default OrganizerInviteService;
