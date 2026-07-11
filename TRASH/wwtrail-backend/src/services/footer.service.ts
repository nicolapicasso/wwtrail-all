// src/services/footer.service.ts
import prisma from '../config/database';
import logger from '../utils/logger';
import { Footer, Language } from '@prisma/client';

interface UpdateFooterInput {
  leftColumnES?: string | null;
  leftColumnEN?: string | null;
  leftColumnIT?: string | null;
  leftColumnCA?: string | null;
  leftColumnFR?: string | null;
  leftColumnDE?: string | null;
  centerColumnES?: string | null;
  centerColumnEN?: string | null;
  centerColumnIT?: string | null;
  centerColumnCA?: string | null;
  centerColumnFR?: string | null;
  centerColumnDE?: string | null;
  rightColumnES?: string | null;
  rightColumnEN?: string | null;
  rightColumnIT?: string | null;
  rightColumnCA?: string | null;
  rightColumnFR?: string | null;
  rightColumnDE?: string | null;
}

class FooterService {
  /**
   * Get footer configuration (creates default if doesn't exist)
   */
  static async getFooter(): Promise<Footer> {
    try {
      let footer = await prisma.footer.findFirst();

      // If no footer exists, create default one
      if (!footer) {
        footer = await prisma.footer.create({
          data: {},
        });
        logger.info('Created default footer configuration');
      }

      return footer;
    } catch (error: any) {
      logger.error('Error getting footer:', error);
      throw error;
    }
  }

  /**
   * Get footer content for specific language
   */
  static async getFooterForLanguage(language: Language): Promise<{
    leftColumn: string | null;
    centerColumn: string | null;
    rightColumn: string | null;
  }> {
    try {
      const footer = await this.getFooter();

      const langUpper = language.toUpperCase() as keyof typeof languageMap;
      const languageMap = {
        ES: { left: footer.leftColumnES, center: footer.centerColumnES, right: footer.rightColumnES },
        EN: { left: footer.leftColumnEN, center: footer.centerColumnEN, right: footer.rightColumnEN },
        IT: { left: footer.leftColumnIT, center: footer.centerColumnIT, right: footer.rightColumnIT },
        CA: { left: footer.leftColumnCA, center: footer.centerColumnCA, right: footer.rightColumnCA },
        FR: { left: footer.leftColumnFR, center: footer.centerColumnFR, right: footer.rightColumnFR },
        DE: { left: footer.leftColumnDE, center: footer.centerColumnDE, right: footer.rightColumnDE },
      };

      const content = languageMap[langUpper] || languageMap.ES;

      return {
        leftColumn: content.left,
        centerColumn: content.center,
        rightColumn: content.right,
      };
    } catch (error: any) {
      logger.error('Error getting footer for language:', error);
      throw error;
    }
  }

  /**
   * Update footer configuration
   */
  static async updateFooter(data: UpdateFooterInput): Promise<Footer> {
    try {
      const footer = await this.getFooter();

      const updated = await prisma.footer.update({
        where: { id: footer.id },
        data,
      });

      logger.info('Footer updated successfully');
      return updated;
    } catch (error: any) {
      logger.error('Error updating footer:', error);
      throw error;
    }
  }
}

export default FooterService;
