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

function inviteEmail(lang: Lang, eventName: string, link: string): { subject: string; html: string } {
  const t: Record<Lang, { subject: string; heading: string; body: string; cta: string; foot: string }> = {
    ES: {
      subject: `Gestiona “${eventName}” en WWTRAIL`,
      heading: `Tu evento ya está en WWTRAIL`,
      body: `Hemos incorporado <strong>${eventName}</strong> a WWTRAIL. Te invitamos a acceder para revisar y mantener actualizada la información de tu evento y sus competiciones.`,
      cta: `Acceder y configurar mi contraseña`,
      foot: `Si no esperabas este correo, puedes ignorarlo. El enlace caduca en 30 días.`,
    },
    EN: {
      subject: `Manage “${eventName}” on WWTRAIL`,
      heading: `Your event is now on WWTRAIL`,
      body: `We've added <strong>${eventName}</strong> to WWTRAIL. You're invited to sign in and keep your event and its races up to date.`,
      cta: `Sign in and set my password`,
      foot: `If you weren't expecting this email you can ignore it. The link expires in 30 days.`,
    },
    IT: {
      subject: `Gestisci “${eventName}” su WWTRAIL`,
      heading: `Il tuo evento è ora su WWTRAIL`,
      body: `Abbiamo aggiunto <strong>${eventName}</strong> a WWTRAIL. Ti invitiamo ad accedere per mantenere aggiornate le informazioni del tuo evento e delle sue gare.`,
      cta: `Accedi e imposta la password`,
      foot: `Se non ti aspettavi questa email, ignorala pure. Il link scade tra 30 giorni.`,
    },
    CA: {
      subject: `Gestiona “${eventName}” a WWTRAIL`,
      heading: `El teu esdeveniment ja és a WWTRAIL`,
      body: `Hem incorporat <strong>${eventName}</strong> a WWTRAIL. Et convidem a accedir per mantenir actualitzada la informació del teu esdeveniment i les seves competicions.`,
      cta: `Accedir i configurar la contrasenya`,
      foot: `Si no esperaves aquest correu, pots ignorar-lo. L'enllaç caduca en 30 dies.`,
    },
    FR: {
      subject: `Gérez « ${eventName} » sur WWTRAIL`,
      heading: `Votre événement est désormais sur WWTRAIL`,
      body: `Nous avons ajouté <strong>${eventName}</strong> à WWTRAIL. Nous vous invitons à vous connecter pour tenir à jour les informations de votre événement et de ses courses.`,
      cta: `Se connecter et définir mon mot de passe`,
      foot: `Si vous n'attendiez pas cet e-mail, ignorez-le. Le lien expire dans 30 jours.`,
    },
    DE: {
      subject: `„${eventName}“ auf WWTRAIL verwalten`,
      heading: `Deine Veranstaltung ist jetzt auf WWTRAIL`,
      body: `Wir haben <strong>${eventName}</strong> zu WWTRAIL hinzugefügt. Wir laden dich ein, dich anzumelden und die Informationen deiner Veranstaltung und ihrer Wettkämpfe aktuell zu halten.`,
      cta: `Anmelden und Passwort festlegen`,
      foot: `Falls du diese E-Mail nicht erwartet hast, ignoriere sie einfach. Der Link läuft in 30 Tagen ab.`,
    },
  };
  const c = t[lang];
  const html = `<!doctype html><html><body style="margin:0;background:#f4f5f7;font-family:Helvetica,Arial,sans-serif;color:#1b2023">
  <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e4e7eb">
    <div style="background:#0E612F;padding:20px 28px"><span style="color:#fff;font-weight:800;font-size:18px;letter-spacing:.02em">WWTRAIL</span></div>
    <div style="padding:28px">
      <h1 style="margin:0 0 12px;font-size:20px;color:#0f1315">${c.heading}</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#3a4147">${c.body}</p>
      <a href="${link}" style="display:inline-block;background:#B66916;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 22px;border-radius:8px">${c.cta}</a>
      <p style="margin:24px 0 0;font-size:12px;color:#8b95a0">${c.foot}</p>
    </div>
  </div></body></html>`;
  return { subject: c.subject, html };
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

    const { subject, html } = inviteEmail(lang, event.name, link);
    await sendEmail({ to: email, subject, html, replyTo: process.env.ORGANIZER_REPLY_TO });

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
