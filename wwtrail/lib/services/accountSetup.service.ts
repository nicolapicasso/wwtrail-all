// lib/services/accountSetup.service.ts
// Self-service account activation: a signed link that lets an imported user set
// their own password and activate their account. Decoupled from any event
// (unlike organizerInvite). Used by the bulk user importer's "invite" mode.

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import logger from '@/lib/utils/logger';
import { sendEmail } from './mailer';
import { emailShell } from './emailContent.defaults';

const JWT_SECRET = process.env.JWT_SECRET || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://wwtrail.com';
const TTL = '30d';

type Lang = 'ES' | 'EN' | 'IT' | 'CA' | 'FR' | 'DE';

interface SetupPayload {
  purpose: 'account-setup';
  uid: string;
}

const COPY: Record<Lang, { subject: string; heading: string; body: string; cta: string; foot: string }> = {
  ES: { subject: 'Activa tu cuenta en WWTRAIL', heading: '¡Te damos la bienvenida!', body: 'Se ha creado una cuenta para ti en WWTRAIL. Pulsa el botón para elegir tu contraseña y activarla.', cta: 'Crear mi contraseña', foot: 'Si no esperabas este correo, puedes ignorarlo.' },
  EN: { subject: 'Activate your WWTRAIL account', heading: 'Welcome!', body: 'An account has been created for you on WWTRAIL. Click the button to choose your password and activate it.', cta: 'Set my password', foot: 'If you were not expecting this email, you can ignore it.' },
  IT: { subject: 'Attiva il tuo account WWTRAIL', heading: 'Benvenuto!', body: 'È stato creato un account per te su WWTRAIL. Clicca il pulsante per scegliere la password e attivarlo.', cta: 'Imposta la password', foot: 'Se non aspettavi questa email, puoi ignorarla.' },
  CA: { subject: 'Activa el teu compte a WWTRAIL', heading: 'Benvingut/da!', body: 'S’ha creat un compte per a tu a WWTRAIL. Prem el botó per triar la contrasenya i activar-lo.', cta: 'Crear la contrasenya', foot: 'Si no esperaves aquest correu, pots ignorar-lo.' },
  FR: { subject: 'Activez votre compte WWTRAIL', heading: 'Bienvenue !', body: 'Un compte a été créé pour vous sur WWTRAIL. Cliquez sur le bouton pour choisir votre mot de passe et l’activer.', cta: 'Définir mon mot de passe', foot: 'Si vous n’attendiez pas cet e-mail, vous pouvez l’ignorer.' },
  DE: { subject: 'Aktiviere dein WWTRAIL-Konto', heading: 'Willkommen!', body: 'Für dich wurde ein Konto bei WWTRAIL erstellt. Klicke auf die Schaltfläche, um dein Passwort zu wählen und es zu aktivieren.', cta: 'Passwort festlegen', foot: 'Falls du diese E-Mail nicht erwartet hast, kannst du sie ignorieren.' },
};

export const AccountSetupService = {
  token(userId: string): string {
    return jwt.sign({ purpose: 'account-setup', uid: userId } as SetupPayload, JWT_SECRET, { expiresIn: TTL });
  },

  link(userId: string, lang: Lang): string {
    return `${APP_URL}/${lang.toLowerCase()}/set-password/${this.token(userId)}`;
  },

  /** Send the "set your password" invitation email. */
  async sendInvite(userId: string, email: string, lang: Lang): Promise<void> {
    const c = COPY[lang] || COPY.ES;
    const html = emailShell(c.heading, c.body, c.cta, this.link(userId, lang), c.foot);
    await sendEmail({ to: email, subject: c.subject, html });
  },

  /** Validate a set-password token and return the target account. */
  async verify(token: string): Promise<{ userId: string; email: string }> {
    const decoded = jwt.verify(token, JWT_SECRET) as SetupPayload;
    if (decoded.purpose !== 'account-setup') throw new Error('Invalid token');
    const user = await prisma.user.findUnique({ where: { id: decoded.uid }, select: { email: true } });
    if (!user) throw new Error('Account not found');
    return { userId: decoded.uid, email: user.email };
  },

  /** Set the password and activate the account. */
  async accept(token: string, password: string): Promise<{ userId: string }> {
    const decoded = jwt.verify(token, JWT_SECRET) as SetupPayload;
    if (decoded.purpose !== 'account-setup') throw new Error('Invalid token');
    if (!password || password.length < 8) throw new Error('Password must be at least 8 characters');
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id: decoded.uid }, data: { password: hashed, isActive: true } });
    logger.info(`[account-setup] accepted by user ${decoded.uid}`);
    return { userId: decoded.uid };
  },
};

export default AccountSetupService;
