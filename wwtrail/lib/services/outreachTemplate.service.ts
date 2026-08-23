// lib/services/outreachTemplate.service.ts
// Resolves outreach email content: a backoffice override (OutreachEmailTemplate)
// takes precedence; otherwise the in-code defaults are used. Also powers the
// admin editor (read effective, save override, reset to default, preview).

import prisma from '@/lib/db';
import logger from '@/lib/utils/logger';
import {
  defaultTemplate,
  renderVars,
  TEMPLATE_VARIABLES,
  OUTREACH_TYPES,
  OUTREACH_LANGS,
  type OutreachTemplateType,
  type Lang,
} from './emailContent.defaults';

function normType(t: string): OutreachTemplateType {
  const up = (t || '').toUpperCase();
  return (OUTREACH_TYPES.includes(up as OutreachTemplateType) ? up : 'WELCOME') as OutreachTemplateType;
}
function normLang(l: string): Lang {
  const up = (l || '').toUpperCase();
  return (OUTREACH_LANGS.includes(up as Lang) ? up : 'EN') as Lang;
}

export const OutreachTemplateService = {
  /** Effective subject/htmlBody for a type+language (override or default). */
  async getEffective(type: string, language: string): Promise<{ subject: string; htmlBody: string; isCustom: boolean }> {
    const t = normType(type);
    const l = normLang(language);
    const row = await prisma.outreachEmailTemplate.findUnique({
      where: { type_language: { type: t, language: l } },
      select: { subject: true, htmlBody: true },
    });
    if (row) return { subject: row.subject, htmlBody: row.htmlBody, isCustom: true };
    return { ...defaultTemplate(t, l), isCustom: false };
  },

  /** Effective template rendered with real variables → ready to send. */
  async getRendered(
    type: string,
    language: string,
    vars: Record<string, string | number>
  ): Promise<{ subject: string; html: string }> {
    const eff = await this.getEffective(type, language);
    return { subject: renderVars(eff.subject, vars), html: renderVars(eff.htmlBody, vars) };
  },

  /** For the editor: effective content + metadata (variables, custom flag, default). */
  async getForEdit(type: string, language: string) {
    const t = normType(type);
    const l = normLang(language);
    const eff = await this.getEffective(t, l);
    return {
      type: t,
      language: l,
      subject: eff.subject,
      htmlBody: eff.htmlBody,
      isCustom: eff.isCustom,
      variables: TEMPLATE_VARIABLES[t],
      default: defaultTemplate(t, l),
    };
  },

  /** Save (create/update) an override. */
  async upsert(type: string, language: string, subject: string, htmlBody: string) {
    const t = normType(type);
    const l = normLang(language);
    const saved = await prisma.outreachEmailTemplate.upsert({
      where: { type_language: { type: t, language: l } },
      update: { subject, htmlBody },
      create: { type: t, language: l, subject, htmlBody },
    });
    logger.info(`[outreach-template] saved ${t}/${l}`);
    return saved;
  },

  /** Remove the override → revert to the in-code default. */
  async reset(type: string, language: string) {
    const t = normType(type);
    const l = normLang(language);
    await prisma.outreachEmailTemplate.deleteMany({ where: { type: t, language: l } });
    logger.info(`[outreach-template] reset ${t}/${l}`);
    return { reset: true };
  },
};

export default OutreachTemplateService;
