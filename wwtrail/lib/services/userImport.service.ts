// lib/services/userImport.service.ts
// Unified bulk user importer used by the backoffice "Importar usuarios" tabs
// (marketing audience, portal accounts, insiders). Takes already field-mapped
// rows plus import options and creates/updates users accordingly.

import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import logger from '@/lib/utils/logger';
import { sendEmail } from './mailer';
import { emailShell } from './emailContent.defaults';
import { AccountSetupService } from './accountSetup.service';

type Lang = 'ES' | 'EN' | 'IT' | 'CA' | 'FR' | 'DE';
const LANGS: Lang[] = ['ES', 'EN', 'IT', 'CA', 'FR', 'DE'];
const normLang = (l?: string | null): Lang => {
  const up = (l || '').toUpperCase();
  return (LANGS.includes(up as Lang) ? up : 'ES') as Lang;
};

// account mode:
//  none        → create with an unusable random password, no email (heredado)
//  provisional → create with a generated temp password, email the credentials
//  invite      → create inactive-until-set, email a set-password link
export type AccountMode = 'none' | 'provisional' | 'invite';

export interface ImportRow {
  email: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  language?: string;
  city?: string;
  phone?: string;
  bio?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
}

export interface ImportOptions {
  accountMode: AccountMode;
  asInsider: boolean;
  marketingOptIn: boolean;
}

export interface ImportResult {
  created: number;
  updated: number;
  skipped: number;
  emailed: number;
  errors: { email: string; reason: string }[];
}

const PROFILE_FIELDS: (keyof ImportRow)[] = [
  'firstName', 'lastName', 'city', 'phone', 'bio',
  'instagramUrl', 'facebookUrl', 'twitterUrl', 'youtubeUrl',
];

// Human-friendly temporary password: e.g. "Trail-7k2m9q".
function genTempPassword(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let s = '';
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `Trail-${s}`;
}

const CRED_COPY: Record<Lang, { subject: string; heading: string; body: (p: string) => string; cta: string; foot: string }> = {
  ES: { subject: 'Tu cuenta en WWTRAIL', heading: '¡Te damos la bienvenida!', body: (p) => `Se ha creado una cuenta para ti en WWTRAIL. Tu contraseña provisional es <b>${p}</b>. Inicia sesión y cámbiala cuanto antes.`, cta: 'Iniciar sesión', foot: 'Por seguridad, cambia tu contraseña tras el primer acceso.' },
  EN: { subject: 'Your WWTRAIL account', heading: 'Welcome!', body: (p) => `An account has been created for you on WWTRAIL. Your temporary password is <b>${p}</b>. Log in and change it as soon as possible.`, cta: 'Log in', foot: 'For your security, change your password after the first login.' },
  IT: { subject: 'Il tuo account WWTRAIL', heading: 'Benvenuto!', body: (p) => `È stato creato un account per te su WWTRAIL. La tua password provvisoria è <b>${p}</b>. Accedi e cambiala il prima possibile.`, cta: 'Accedi', foot: 'Per sicurezza, cambia la password dopo il primo accesso.' },
  CA: { subject: 'El teu compte a WWTRAIL', heading: 'Benvingut/da!', body: (p) => `S’ha creat un compte per a tu a WWTRAIL. La teva contrasenya provisional és <b>${p}</b>. Inicia sessió i canvia-la com abans millor.`, cta: 'Iniciar sessió', foot: 'Per seguretat, canvia la contrasenya després del primer accés.' },
  FR: { subject: 'Votre compte WWTRAIL', heading: 'Bienvenue !', body: (p) => `Un compte a été créé pour vous sur WWTRAIL. Votre mot de passe provisoire est <b>${p}</b>. Connectez-vous et changez-le dès que possible.`, cta: 'Se connecter', foot: 'Pour votre sécurité, changez votre mot de passe après la première connexion.' },
  DE: { subject: 'Dein WWTRAIL-Konto', heading: 'Willkommen!', body: (p) => `Für dich wurde ein Konto bei WWTRAIL erstellt. Dein vorläufiges Passwort lautet <b>${p}</b>. Melde dich an und ändere es so bald wie möglich.`, cta: 'Anmelden', foot: 'Ändere aus Sicherheitsgründen dein Passwort nach der ersten Anmeldung.' },
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://wwtrail.com';

async function sendCredentials(email: string, tempPass: string, lang: Lang): Promise<void> {
  const c = CRED_COPY[lang] || CRED_COPY.ES;
  const html = emailShell(c.heading, c.body(tempPass), c.cta, `${APP_URL}/${lang.toLowerCase()}/auth/login`, c.foot);
  await sendEmail({ to: email, subject: c.subject, html });
}

export const UserImportService = {
  async importUsers(rows: ImportRow[], opts: ImportOptions): Promise<ImportResult> {
    const res: ImportResult = { created: 0, updated: 0, skipped: 0, emailed: 0, errors: [] };

    for (const raw of rows) {
      const email = (raw.email || '').trim().toLowerCase();
      if (!email || !email.includes('@')) { res.skipped++; continue; }
      const lang = normLang(raw.language);
      const country = raw.country ? raw.country.trim().toUpperCase().slice(0, 2) : undefined;

      try {
        const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });

        if (existing) {
          // Update flags + fill any provided profile fields. Never touch the
          // password or email credentials to an already-existing account.
          const data: any = {};
          if (opts.marketingOptIn) { data.marketingOptIn = true; data.marketingOptInAt = new Date(); }
          if (opts.asInsider) data.isInsider = true;
          if (country) data.country = country;
          if (raw.language) data.language = lang as any;
          for (const f of PROFILE_FIELDS) {
            const v = (raw[f] || '').toString().trim();
            if (v) data[f] = v;
          }
          if (Object.keys(data).length > 0) {
            await prisma.user.update({ where: { id: existing.id }, data });
          }
          res.updated++;
          continue;
        }

        // New account.
        let plaintext: string | null = null;
        let hashed: string;
        if (opts.accountMode === 'provisional') {
          plaintext = genTempPassword();
          hashed = await bcrypt.hash(plaintext, 10);
        } else {
          // none / invite → set an unguessable password (invite users replace it).
          hashed = await bcrypt.hash(`${Math.random()}${Date.now()}${email}`, 10);
        }

        const base = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20) || 'user';
        const profile: any = {};
        for (const f of PROFILE_FIELDS) {
          const v = (raw[f] || '').toString().trim();
          if (v) profile[f] = v;
        }

        const user = await prisma.user.create({
          data: {
            email,
            username: `${base}-${Math.random().toString(36).slice(2, 6)}`,
            password: hashed,
            role: 'ATHLETE',
            // invite users activate on set-password; others are active now.
            isActive: opts.accountMode !== 'invite',
            country: country || null,
            language: lang as any,
            isInsider: opts.asInsider,
            marketingOptIn: opts.marketingOptIn,
            marketingOptInAt: opts.marketingOptIn ? new Date() : null,
            ...profile,
          },
        });
        res.created++;

        if (opts.accountMode === 'provisional' && plaintext) {
          try { await sendCredentials(email, plaintext, lang); res.emailed++; }
          catch (e: any) { res.errors.push({ email, reason: `cuenta creada, email falló: ${e?.message || e}` }); }
        } else if (opts.accountMode === 'invite') {
          try { await AccountSetupService.sendInvite(user.id, email, lang); res.emailed++; }
          catch (e: any) { res.errors.push({ email, reason: `cuenta creada, email falló: ${e?.message || e}` }); }
        }
      } catch (e: any) {
        logger.warn(`[user-import] ${email} failed: ${e?.message || e}`);
        res.errors.push({ email, reason: e?.message || 'error' });
        res.skipped++;
      }
    }

    logger.info(`[user-import] created=${res.created} updated=${res.updated} skipped=${res.skipped} emailed=${res.emailed} mode=${opts.accountMode} insider=${opts.asInsider} optIn=${opts.marketingOptIn}`);
    return res;
  },
};

export default UserImportService;
