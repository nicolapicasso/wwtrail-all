// lib/services/outreach.service.ts
// Daily outreach engine: reminders to organizers before each edition (T-60,
// T-30) and a post-event Magazine press request. Driven by a daily cron that
// hits /api/cron/outreach. Idempotent via the email_logs table, and window-
// based (only editions whose date falls in the relevant range are considered),
// so the job stays small and self-heals if a run is missed.

import prisma from '@/lib/db';
import logger from '@/lib/utils/logger';
import { sendEmail } from './mailer';
import { countryToLanguage } from './organizerInvite.service';
import OrganizerInviteService from './organizerInvite.service';

type Lang = 'ES' | 'EN' | 'IT' | 'CA' | 'FR' | 'DE';
type EmailType = 'REMINDER_60' | 'REMINDER_30' | 'MAGAZINE';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://wwtrail.com';
const DAY = 24 * 60 * 60 * 1000;

function shell(heading: string, body: string, ctaLabel: string, ctaLink: string, foot: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f4f5f7;font-family:Helvetica,Arial,sans-serif;color:#1b2023">
  <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e4e7eb">
    <div style="background:#0E612F;padding:20px 28px"><span style="color:#fff;font-weight:800;font-size:18px;letter-spacing:.02em">WWTRAIL</span></div>
    <div style="padding:28px">
      <h1 style="margin:0 0 12px;font-size:20px;color:#0f1315">${heading}</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#3a4147">${body}</p>
      <a href="${ctaLink}" style="display:inline-block;background:#B66916;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 22px;border-radius:8px">${ctaLabel}</a>
      <p style="margin:24px 0 0;font-size:12px;color:#8b95a0">${foot}</p>
    </div>
  </div></body></html>`;
}

function reminderContent(lang: Lang, event: string, comp: string, days: number, link: string) {
  const T: Record<Lang, any> = {
    ES: { s: `Faltan ${days} días para ${comp} — actualiza tus datos`, h: `${comp} se acerca`, b: `Tu prueba <strong>${comp}</strong> de <strong>${event}</strong> se celebra dentro de unos <strong>${days} días</strong>. Entra en WWTRAIL para revisar y actualizar la información (fecha, distancias, inscripción, imágenes…).`, c: `Actualizar mi evento`, f: `Recibes este aviso como organizador en WWTRAIL.` },
    EN: { s: `${days} days to ${comp} — update your details`, h: `${comp} is coming up`, b: `Your race <strong>${comp}</strong> of <strong>${event}</strong> takes place in about <strong>${days} days</strong>. Sign in to WWTRAIL to review and update its info (date, distances, registration, images…).`, c: `Update my event`, f: `You receive this as an organizer on WWTRAIL.` },
    IT: { s: `Mancano ${days} giorni a ${comp} — aggiorna i dati`, h: `${comp} si avvicina`, b: `La tua gara <strong>${comp}</strong> di <strong>${event}</strong> si terrà tra circa <strong>${days} giorni</strong>. Accedi a WWTRAIL per rivedere e aggiornare le informazioni.`, c: `Aggiorna il mio evento`, f: `Ricevi questo avviso come organizzatore su WWTRAIL.` },
    CA: { s: `Falten ${days} dies per a ${comp} — actualitza les dades`, h: `${comp} s'acosta`, b: `La teva prova <strong>${comp}</strong> de <strong>${event}</strong> se celebra d'aquí a uns <strong>${days} dies</strong>. Entra a WWTRAIL per revisar i actualitzar la informació.`, c: `Actualitzar el meu esdeveniment`, f: `Reps aquest avís com a organitzador a WWTRAIL.` },
    FR: { s: `${days} jours avant ${comp} — mettez à jour vos infos`, h: `${comp} approche`, b: `Votre course <strong>${comp}</strong> de <strong>${event}</strong> a lieu dans environ <strong>${days} jours</strong>. Connectez-vous à WWTRAIL pour vérifier et mettre à jour les informations.`, c: `Mettre à jour mon événement`, f: `Vous recevez ceci en tant qu'organisateur sur WWTRAIL.` },
    DE: { s: `Noch ${days} Tage bis ${comp} — Daten aktualisieren`, h: `${comp} steht bevor`, b: `Dein Rennen <strong>${comp}</strong> von <strong>${event}</strong> findet in etwa <strong>${days} Tagen</strong> statt. Melde dich bei WWTRAIL an, um die Infos zu prüfen und zu aktualisieren.`, c: `Meine Veranstaltung aktualisieren`, f: `Du erhältst dies als Veranstalter auf WWTRAIL.` },
  };
  const c = T[lang];
  return { subject: c.s, html: shell(c.h, c.b, c.c, link, c.f) };
}

function magazineContent(lang: Lang, event: string, comp: string, link: string) {
  const T: Record<Lang, any> = {
    ES: { s: `Comparte con el Magazine de WWTRAIL: fotos, resultados y crónica de ${comp}`, h: `¿Cómo fue ${comp}?`, b: `Desde el <strong>Magazine de WWTRAIL</strong> nos encantaría publicar tu edición de <strong>${comp}</strong> (${event}). Envíanos <strong>lo que tengas</strong>: galería de fotos, resultados y una pequeña crónica.`, c: `Enviar material al Magazine`, f: `Puedes responder a este correo con el material o usar el enlace.` },
    EN: { s: `Share with WWTRAIL Magazine: photos, results and report of ${comp}`, h: `How did ${comp} go?`, b: `The <strong>WWTRAIL Magazine</strong> would love to feature your <strong>${comp}</strong> (${event}). Send us <strong>whatever you have</strong>: a photo gallery, results and a short report.`, c: `Send material to the Magazine`, f: `You can reply to this email with the material or use the link.` },
    IT: { s: `Condividi con il Magazine di WWTRAIL: foto, risultati e cronaca di ${comp}`, h: `Com'è andata ${comp}?`, b: `Il <strong>Magazine di WWTRAIL</strong> vorrebbe raccontare la tua <strong>${comp}</strong> (${event}). Inviaci <strong>quello che hai</strong>: galleria foto, risultati e una breve cronaca.`, c: `Invia materiale al Magazine`, f: `Puoi rispondere a questa email con il materiale o usare il link.` },
    CA: { s: `Comparteix amb el Magazine de WWTRAIL: fotos, resultats i crònica de ${comp}`, h: `Com va anar ${comp}?`, b: `Des del <strong>Magazine de WWTRAIL</strong> ens encantaria publicar la teva <strong>${comp}</strong> (${event}). Envia'ns <strong>el que tinguis</strong>: galeria de fotos, resultats i una petita crònica.`, c: `Enviar material al Magazine`, f: `Pots respondre aquest correu amb el material o fer servir l'enllaç.` },
    FR: { s: `Partagez avec le Magazine WWTRAIL : photos, résultats et compte-rendu de ${comp}`, h: `Comment s'est passé ${comp} ?`, b: `Le <strong>Magazine WWTRAIL</strong> aimerait mettre en avant votre <strong>${comp}</strong> (${event}). Envoyez-nous <strong>ce que vous avez</strong> : galerie photo, résultats et un court compte-rendu.`, c: `Envoyer au Magazine`, f: `Vous pouvez répondre à cet e-mail avec le matériel ou utiliser le lien.` },
    DE: { s: `Teile mit dem WWTRAIL-Magazine: Fotos, Ergebnisse und Bericht von ${comp}`, h: `Wie lief ${comp}?`, b: `Das <strong>WWTRAIL-Magazine</strong> würde deine <strong>${comp}</strong> (${event}) gerne vorstellen. Schick uns <strong>was du hast</strong>: Fotogalerie, Ergebnisse und einen kurzen Bericht.`, c: `Material ans Magazine senden`, f: `Du kannst auf diese E-Mail mit dem Material antworten oder den Link nutzen.` },
  };
  const c = T[lang];
  return { subject: c.s, html: shell(c.h, c.b, c.c, link, c.f) };
}

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
  build: (lang: Lang, event: string, comp: string, link: string) => { subject: string; html: string }
): Promise<number> {
  let sent = 0;
  for (const ed of editions) {
    const email = (ed.competition?.event?.email || '').trim().toLowerCase();
    if (!email) continue;
    if (await alreadySent(ed.id, emailType)) continue;
    const lang = countryToLanguage(ed.competition?.event?.country);
    const link = `${APP_URL}/${lang.toLowerCase()}/organizer/events`;
    const { subject, html } = build(lang, ed.competition?.event?.name || '', ed.competition?.name || '', link);
    try {
      await sendEmail({ to: email, subject, html });
      await logSent(ed.id, emailType, email);
      sent++;
    } catch (e: any) {
      logger.error(`[outreach] ${emailType} to ${email} failed: ${e?.message || e}`);
    }
  }
  return sent;
}

export const OutreachService = {
  async runDaily(): Promise<{ reminder60: number; reminder30: number; magazine: number }> {
    const now = new Date();
    const in30 = new Date(now.getTime() + 30 * DAY);
    const in60 = new Date(now.getTime() + 60 * DAY);
    const ago14 = new Date(now.getTime() - 14 * DAY);

    // T-60: editions between +30 and +60 days out (first time they enter the ≤60d window)
    const w60 = await editionsInWindow(in30, in60);
    const reminder60 = await processWindow(w60, 'REMINDER_60', (l, e, c, link) => reminderContent(l, e, c, 60, link));

    // T-30: editions between now and +30 days out
    const w30 = await editionsInWindow(now, in30);
    const reminder30 = await processWindow(w30, 'REMINDER_30', (l, e, c, link) => reminderContent(l, e, c, 30, link));

    // Magazine: editions that took place in the last 14 days
    const wMag = await editionsInWindow(ago14, now);
    const magazine = await processWindow(wMag, 'MAGAZINE', (l, e, c, link) => magazineContent(l, e, c, link));

    logger.info(`[outreach] daily run: reminder60=${reminder60} reminder30=${reminder30} magazine=${magazine}`);
    return { reminder60, reminder30, magazine };
  },

  /**
   * Send the onboarding/welcome invite once when an event is created. Best-effort
   * and idempotent (logged as WELCOME on the event). Never throws to the caller.
   */
  async sendWelcome(eventId: string, adminId: string): Promise<void> {
    try {
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
