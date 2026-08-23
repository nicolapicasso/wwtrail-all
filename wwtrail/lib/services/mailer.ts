// lib/services/mailer.ts
// Unified transactional email sender. Prefers Resend (via its REST API, no SDK
// dependency) when RESEND_API_KEY is set; otherwise falls back to the existing
// SMTP transport (nodemailer). This lets us adopt Resend incrementally without
// breaking anything that already sends mail.

import * as nodemailer from 'nodemailer';
import logger from '@/lib/utils/logger';

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  /** Overrides the default From. Use a verified Resend domain address. */
  from?: string;
  /** Where replies go — useful so the system can later read/automate answers. */
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  provider: 'resend' | 'smtp';
  id?: string;
}

const DEFAULT_FROM = process.env.EMAIL_FROM || 'WWTRAIL <noreply@wwtrail.com>';

async function sendViaResend(input: SendEmailInput): Promise<SendEmailResult> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: input.from || DEFAULT_FROM,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: input.replyTo,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Resend API error ${res.status}: ${body.slice(0, 300)}`);
  }
  const data: any = await res.json().catch(() => ({}));
  return { success: true, provider: 'resend', id: data?.id };
}

let _transporter: nodemailer.Transporter | null = null;
function getTransporter(): nodemailer.Transporter {
  if (!_transporter) {
    const createTransport =
      (nodemailer as any).createTransport || (nodemailer as any).default?.createTransport;
    _transporter = createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return _transporter!;
}

async function sendViaSmtp(input: SendEmailInput): Promise<SendEmailResult> {
  const info = await getTransporter().sendMail({
    from: input.from || DEFAULT_FROM,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  });
  return { success: true, provider: 'smtp', id: info?.messageId };
}

/**
 * Send a transactional email through the best available provider.
 * Throws on failure (callers decide whether to swallow or surface it).
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const useResend = !!process.env.RESEND_API_KEY;
  try {
    const result = useResend ? await sendViaResend(input) : await sendViaSmtp(input);
    logger.info(`[mailer] sent via ${result.provider} to ${input.to} (${input.subject})`);
    return result;
  } catch (err: any) {
    logger.error(`[mailer] send failed (${useResend ? 'resend' : 'smtp'}): ${err?.message || err}`);
    throw err;
  }
}
