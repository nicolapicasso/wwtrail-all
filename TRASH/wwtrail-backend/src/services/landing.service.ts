// src/services/landing.service.ts
import prisma from '../config/database';
import logger from '../utils/logger';
import { Landing, Language, LandingTranslation } from '@prisma/client';
import { CreateLandingInput, UpdateLandingInput } from '../schemas/landing.schema';
import slugify from 'slugify';

interface GetLandingsOptions {
  page?: number;
  limit?: number;
  search?: string;
  language?: Language;
}

class LandingService {
  /**
   * Generate unique slug from title
   */
  private static generateSlug(title: string): string {
    return slugify(title, {
      lower: true,
      strict: true,
      locale: 'es',
    });
  }

  /**
   * Get all landings with pagination
   */
  static async getAllLandings(options: GetLandingsOptions = {}) {
    try {
      const { page = 1, limit = 20, search, language } = options;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (language) {
        where.language = language;
      }

      const [landings, total] = await Promise.all([
        prisma.landing.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            createdBy: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
            translations: true,
          },
        }),
        prisma.landing.count({ where }),
      ]);

      return {
        data: landings,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      logger.error('Error getting landings:', error);
      throw error;
    }
  }

  /**
   * Get landing by ID
   */
  static async getLandingById(id: string): Promise<Landing & { translations: LandingTranslation[] }> {
    try {
      const landing = await prisma.landing.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          translations: true,
        },
      });

      if (!landing) {
        throw new Error('Landing no encontrado');
      }

      return landing;
    } catch (error: any) {
      logger.error('Error getting landing by ID:', error);
      throw error;
    }
  }

  /**
   * Get landing by slug (with translations)
   */
  static async getLandingBySlug(slug: string, language?: Language) {
    try {
      const landing = await prisma.landing.findUnique({
        where: { slug },
        include: {
          translations: true,
        },
      });

      if (!landing) {
        throw new Error('Landing no encontrado');
      }

      // If language specified, try to return translation
      if (language && language !== landing.language) {
        const translation = landing.translations.find((t) => t.language === language);
        if (translation) {
          return {
            ...landing,
            title: translation.title,
            content: translation.content,
            metaTitle: translation.metaTitle,
            metaDescription: translation.metaDescription,
            translatedLanguage: language,
          };
        }
      }

      return landing;
    } catch (error: any) {
      logger.error('Error getting landing by slug:', error);
      throw error;
    }
  }

  /**
   * Create new landing
   */
  static async createLanding(data: CreateLandingInput, createdById: string): Promise<Landing> {
    try {
      // Generate slug from title if not provided
      const slug = data.slug || this.generateSlug(data.title);

      // Check if slug is unique
      const existingLanding = await prisma.landing.findUnique({
        where: { slug },
      });

      if (existingLanding) {
        throw new Error(`El slug "${slug}" ya existe. Por favor usa otro título o slug.`);
      }

      const landing = await prisma.landing.create({
        data: {
          title: data.title,
          slug,
          language: data.language || Language.ES,
          coverImage: data.coverImage || null,
          gallery: data.gallery || [],
          content: data.content,
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          createdById,
        },
        include: {
          translations: true,
        },
      });

      logger.info(`Landing created: ${landing.id} - ${landing.title}`);
      return landing;
    } catch (error: any) {
      logger.error('Error creating landing:', error);
      throw error;
    }
  }

  /**
   * Update landing
   */
  static async updateLanding(id: string, data: UpdateLandingInput): Promise<Landing> {
    try {
      // Check if landing exists
      await this.getLandingById(id);

      // If slug is being updated, check uniqueness
      if (data.slug) {
        const existingLanding = await prisma.landing.findFirst({
          where: {
            slug: data.slug,
            NOT: { id },
          },
        });

        if (existingLanding) {
          throw new Error(`El slug "${data.slug}" ya está en uso.`);
        }
      }

      const updated = await prisma.landing.update({
        where: { id },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.slug && { slug: data.slug }),
          ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
          ...(data.gallery && { gallery: data.gallery }),
          ...(data.content && { content: data.content }),
          ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
          ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription }),
        },
        include: {
          translations: true,
        },
      });

      logger.info(`Landing updated: ${updated.id} - ${updated.title}`);
      return updated;
    } catch (error: any) {
      logger.error('Error updating landing:', error);
      throw error;
    }
  }

  /**
   * Delete landing
   */
  static async deleteLanding(id: string): Promise<void> {
    try {
      await this.getLandingById(id); // Check if exists

      await prisma.landing.delete({
        where: { id },
      });

      logger.info(`Landing deleted: ${id}`);
    } catch (error: any) {
      logger.error('Error deleting landing:', error);
      throw error;
    }
  }
}

export default LandingService;
