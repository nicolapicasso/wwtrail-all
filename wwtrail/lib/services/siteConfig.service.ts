// lib/services/siteConfig.service.ts
import prisma from '@/lib/db';
import logger from '@/lib/utils/logger';

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
      const { openaiApiKey, ...publicConfig } = config;
      return {
        ...publicConfig,
        hasOpenaiKey: !!openaiApiKey,
      };
    }

    // For admin: mask the API key
    return {
      ...config,
      openaiApiKey: config.openaiApiKey
        ? `${config.openaiApiKey.substring(0, 7)}...${config.openaiApiKey.substring(config.openaiApiKey.length - 4)}`
        : null,
      hasOpenaiKey: !!config.openaiApiKey,
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
  }) {
    let config = await prisma.siteConfig.findFirst();

    // Don't overwrite API key if the masked version is sent back
    if (data.openaiApiKey && data.openaiApiKey.includes('...')) {
      delete data.openaiApiKey;
    }

    // If key is empty string, set to null
    if (data.openaiApiKey === '') {
      data.openaiApiKey = undefined;
    }

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
    const { openaiApiKey, ...publicConfig } = config;
    return {
      ...publicConfig,
      openaiApiKey: openaiApiKey
        ? `${openaiApiKey.substring(0, 7)}...${openaiApiKey.substring(openaiApiKey.length - 4)}`
        : null,
      hasOpenaiKey: !!openaiApiKey,
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
}
