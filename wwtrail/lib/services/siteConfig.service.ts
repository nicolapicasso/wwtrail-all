// lib/services/siteConfig.service.ts
import prisma from '@/lib/db';
import logger from '@/lib/utils/logger';
import { encryptSecret, decryptSecret } from '@/lib/utils/settingsCrypto';

const maskKey = (k: string) =>
  k.length > 11 ? `${k.substring(0, 7)}...${k.substring(k.length - 4)}` : '••••';

// Fields that are safe to return to the client (no secrets)
const PUBLIC_SELECT = {
  id: true,
  siteName: true,
  logoUrl: true,
  faviconUrl: true,
  fontPrimary: true,
  fontSecondary: true,
  colorPrimary: true,
  colorSecondary: true,
  colorAccent: true,
  colorBackground: true,
  colorText: true,
  colorSuccess: true,
  colorDanger: true,
  borderRadius: true,
  shadowStyle: true,
  updatedAt: true,
};

export class SiteConfigService {
  /**
   * Get the site configuration (creates default if none exists)
   * For admin: includes masked API key info
   * For public: excludes all secrets
   */
  static async get(includeSecrets = false) {
    let config = await prisma.siteConfig.findFirst();

    if (!config) {
      config = await prisma.siteConfig.create({ data: {} });
      logger.info('Created default SiteConfig');
    }

    if (!includeSecrets) {
      // Return without secrets
      const { openaiApiKey, resendApiKey, ...publicConfig } = config;
      return {
        ...publicConfig,
        hasOpenaiKey: !!openaiApiKey,
        hasResendKey: !!resendApiKey,
      };
    }

    // For admin: mask the API keys (resend is stored encrypted → decrypt to mask)
    const resendPlain = decryptSecret(config.resendApiKey);
    return {
      ...config,
      openaiApiKey: config.openaiApiKey ? maskKey(config.openaiApiKey) : null,
      resendApiKey: resendPlain ? maskKey(resendPlain) : null,
      hasOpenaiKey: !!config.openaiApiKey,
      hasResendKey: !!config.resendApiKey,
    };
  }

  /**
   * Get public styles only (for CSS variables, no auth required)
   */
  static async getPublicStyles() {
    let config = await prisma.siteConfig.findFirst({
      select: PUBLIC_SELECT,
    });

    if (!config) {
      config = await (await prisma.siteConfig.create({ data: {} })) as any;
    }

    return config;
  }

  /**
   * Update site configuration (admin only)
   */
  static async update(data: {
    siteName?: string;
    logoUrl?: string;
    faviconUrl?: string;
    fontPrimary?: string;
    fontSecondary?: string;
    colorPrimary?: string;
    colorSecondary?: string;
    colorAccent?: string;
    colorBackground?: string;
    colorText?: string;
    colorSuccess?: string;
    colorDanger?: string;
    borderRadius?: string;
    shadowStyle?: string;
    openaiApiKey?: string;
    resendApiKey?: string;
    emailFrom?: string;
    organizerReplyTo?: string;
    outreachEnabled?: boolean;
    emailWelcomeEnabled?: boolean;
    emailReminderEnabled?: boolean;
    emailMagazineEnabled?: boolean;
  }) {
    let config = await prisma.siteConfig.findFirst();

    // Don't overwrite API key if the masked version is sent back
    if (data.openaiApiKey && data.openaiApiKey.includes('...')) {
      delete data.openaiApiKey;
    }
    if (data.openaiApiKey === '') {
      data.openaiApiKey = undefined;
    }

    // Resend key: ignore masked echo, clear on empty, encrypt a real new value.
    if (data.resendApiKey && data.resendApiKey.includes('...')) {
      delete data.resendApiKey;
    } else if (data.resendApiKey === '') {
      data.resendApiKey = undefined;
    } else if (data.resendApiKey) {
      data.resendApiKey = encryptSecret(data.resendApiKey.trim());
    }
    if (data.emailFrom === '') data.emailFrom = undefined;
    if (data.organizerReplyTo === '') data.organizerReplyTo = undefined;

    if (!config) {
      config = await prisma.siteConfig.create({ data });
    } else {
      config = await prisma.siteConfig.update({
        where: { id: config.id },
        data,
      });
    }

    logger.info('SiteConfig updated');

    // Return masked version
    const { openaiApiKey, resendApiKey, ...publicConfig } = config;
    const resendPlain = decryptSecret(resendApiKey);
    return {
      ...publicConfig,
      openaiApiKey: openaiApiKey ? maskKey(openaiApiKey) : null,
      resendApiKey: resendPlain ? maskKey(resendPlain) : null,
      hasOpenaiKey: !!openaiApiKey,
      hasResendKey: !!resendApiKey,
    };
  }

  /**
   * Get OpenAI API key (raw, for internal service use only)
   */
  static async getOpenAIKey(): Promise<string | null> {
    const config = await prisma.siteConfig.findFirst({
      select: { openaiApiKey: true },
    });
    return config?.openaiApiKey || process.env.OPENAI_API_KEY || null;
  }

  /**
   * Effective email/Resend config for server use: DB (backoffice) first,
   * environment variables as fallback. resendApiKey is decrypted here.
   */
  static async getEmailConfig(): Promise<{
    resendApiKey: string | null;
    emailFrom: string | null;
    organizerReplyTo: string | null;
  }> {
    const config = await prisma.siteConfig.findFirst({
      select: { resendApiKey: true, emailFrom: true, organizerReplyTo: true },
    });
    return {
      resendApiKey: decryptSecret(config?.resendApiKey) || process.env.RESEND_API_KEY || null,
      emailFrom: config?.emailFrom || process.env.EMAIL_FROM || null,
      organizerReplyTo: config?.organizerReplyTo || process.env.ORGANIZER_REPLY_TO || null,
    };
  }

  /** Outreach on/off switches (default OFF so nothing sends until enabled). */
  static async getOutreachFlags(): Promise<{
    outreachEnabled: boolean; welcome: boolean; reminder: boolean; magazine: boolean;
  }> {
    const c = await prisma.siteConfig.findFirst({
      select: {
        outreachEnabled: true, emailWelcomeEnabled: true,
        emailReminderEnabled: true, emailMagazineEnabled: true,
      },
    });
    return {
      outreachEnabled: c?.outreachEnabled ?? false,
      welcome: c?.emailWelcomeEnabled ?? false,
      reminder: c?.emailReminderEnabled ?? false,
      magazine: c?.emailMagazineEnabled ?? false,
    };
  }
}
