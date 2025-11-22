// src/services/promotion.service.ts
import prisma from '../config/database';
import { cache, CACHE_TTL, CACHE_TTL_LONG } from '../config/redis';
import logger from '../utils/logger';
import { generateUniqueSlug } from '../utils/slugify';
import { PromotionType, PostStatus, Language } from '@prisma/client';

interface CreatePromotionInput {
  type: PromotionType;
  title: string;
  description: string;
  coverImage?: string;
  gallery?: string[];
  brandUrl?: string;
  categoryId?: string;
  language: Language;
  isGlobal: boolean;
  countries?: string[]; // Array de códigos ISO de países
  exclusiveContent?: string; // Solo para EXCLUSIVE_CONTENT
  couponCodes?: string[]; // Solo para COUPON
  createdById: string;
  featured?: boolean;
}

interface UpdatePromotionInput {
  title?: string;
  description?: string;
  coverImage?: string;
  gallery?: string[];
  brandUrl?: string;
  categoryId?: string;
  language?: Language;
  isGlobal?: boolean;
  countries?: string[];
  exclusiveContent?: string;
  featured?: boolean;
  status?: PostStatus;
}

interface PromotionFilters {
  page?: number | string;
  limit?: number | string;
  search?: string;
  type?: PromotionType;
  categoryId?: string;
  language?: Language;
  country?: string; // Filtrar por país específico
  isGlobal?: boolean;
  featured?: boolean;
  status?: PostStatus;
  sortBy?: 'title' | 'createdAt' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

interface RedeemCouponInput {
  userName: string;
  userEmail: string;
}

export class PromotionService {

  /**
   * Crear una nueva promoción
   */
  static async create(data: CreatePromotionInput) {
    try {
      const slug = await generateUniqueSlug(data.title, 'promotion');

      // Validar que si es COUPON tenga códigos
      if (data.type === 'COUPON' && (!data.couponCodes || data.couponCodes.length === 0)) {
        throw new Error('COUPON promotions must have at least one coupon code');
      }

      // Validar que si es EXCLUSIVE_CONTENT tenga contenido exclusivo
      if (data.type === 'EXCLUSIVE_CONTENT' && !data.exclusiveContent) {
        throw new Error('EXCLUSIVE_CONTENT promotions must have exclusive content');
      }

      const promotion = await prisma.promotion.create({
        data: {
          type: data.type,
          title: data.title,
          slug,
          description: data.description,
          coverImage: data.coverImage,
          gallery: data.gallery || [],
          brandUrl: data.brandUrl,
          categoryId: data.categoryId,
          language: data.language,
          isGlobal: data.isGlobal,
          exclusiveContent: data.exclusiveContent,
          createdById: data.createdById,
          featured: data.featured || false,
          status: 'DRAFT',
          // Crear países si no es global
          countries: !data.isGlobal && data.countries ? {
            create: data.countries.map(countryCode => ({ countryCode }))
          } : undefined,
          // Crear códigos de cupón si es COUPON
          couponCodes: data.type === 'COUPON' && data.couponCodes ? {
            create: data.couponCodes.map(code => ({ code }))
          } : undefined,
        },
        include: {
          category: true,
          countries: true,
          couponCodes: true,
          createdBy: {
            select: {
              id: true,
              username: true,
              email: true,
            }
          }
        }
      });

      // Invalidar cache
      await cache.delPattern('promotions:*');

      logger.info(`Promotion created: ${promotion.id}`);
      return promotion;

    } catch (error) {
      logger.error('Error creating promotion:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las promociones (con filtros)
   */
  static async getAll(filters: PromotionFilters = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        type,
        categoryId,
        language,
        country,
        isGlobal,
        featured,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = filters;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const cacheKey = `promotions:list:${JSON.stringify(filters)}`;
      // TEMPORALMENTE DESHABILITADO - cache corrupto
      // const cached = await cache.get(cacheKey);
      // if (cached) {
      //   return cached;
      // }

      const where: any = {};

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      if (type) where.type = type;
      if (categoryId) where.categoryId = categoryId;
      if (language) where.language = language;
      if (typeof isGlobal === 'boolean') where.isGlobal = isGlobal;
      if (typeof featured === 'boolean') where.featured = featured;
      if (status) where.status = status;

      // Filtrar por país: debe ser global O tener el país en la lista
      if (country && !isGlobal) {
        where.OR = [
          { isGlobal: true },
          { countries: { some: { countryCode: country } } }
        ];
      }

      const [promotions, total] = await Promise.all([
        prisma.promotion.findMany({
          where,
          skip,
          take,
          orderBy: { [sortBy]: sortOrder },
          include: {
            category: true,
            countries: true,
            couponCodes: {
              select: {
                id: true,
                isUsed: true,
              }
            },
            createdBy: {
              select: {
                id: true,
                username: true,
              }
            }
          }
        }),
        prisma.promotion.count({ where })
      ]);

      // Agregar estadísticas de cupones
      const enrichedPromotions = promotions.map(promo => {
        if (promo.type === 'COUPON') {
          const totalCodes = promo.couponCodes.length;
          const usedCodes = promo.couponCodes.filter(c => c.isUsed).length;
          const availableCodes = totalCodes - usedCodes;

          return {
            ...promo,
            couponStats: {
              total: totalCodes,
              used: usedCodes,
              available: availableCodes,
            },
            couponCodes: undefined, // No exponer los códigos en el listado
          };
        }
        return promo;
      });

      const result = {
        promotions: enrichedPromotions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      };

      // TEMPORALMENTE DESHABILITADO - cache corrupto
      // await cache.set(cacheKey, JSON.stringify(result), CACHE_TTL);
      return result;

    } catch (error) {
      logger.error('Error fetching promotions:', error);
      throw error;
    }
  }

  /**
   * Obtener una promoción por ID o slug
   */
  static async getByIdOrSlug(identifier: string, userId?: string) {
    try {
      const cacheKey = `promotion:${identifier}`;
      // TEMPORALMENTE DESHABILITADO - cache corrupto
      // const cached = await cache.get(cacheKey);
      // if (cached) {
      //   return cached;
      // }

      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

      const promotion = await prisma.promotion.findUnique({
        where: isUUID ? { id: identifier } : { slug: identifier },
        include: {
          category: true,
          countries: true,
          couponCodes: {
            select: {
              id: true,
              isUsed: true,
            }
          },
          createdBy: {
            select: {
              id: true,
              username: true,
            }
          }
        }
      });

      if (!promotion) {
        return null;
      }

      // Incrementar viewCount
      await prisma.promotion.update({
        where: { id: promotion.id },
        data: { viewCount: { increment: 1 } }
      });

      // Si es COUPON, agregar estadísticas pero no exponer códigos
      if (promotion.type === 'COUPON') {
        const totalCodes = promotion.couponCodes.length;
        const usedCodes = promotion.couponCodes.filter((c: any) => c.isUsed).length;
        const availableCodes = totalCodes - usedCodes;

        const result = {
          ...promotion,
          couponStats: {
            total: totalCodes,
            used: usedCodes,
            available: availableCodes,
          },
          couponCodes: undefined, // No exponer códigos individuales
        };

        // TEMPORALMENTE DESHABILITADO - cache corrupto
        // await cache.set(cacheKey, JSON.stringify(result), CACHE_TTL);
        return result;
      }

      // TEMPORALMENTE DESHABILITADO - cache corrupto
      // await cache.set(cacheKey, JSON.stringify(promotion), CACHE_TTL);
      return promotion;

    } catch (error) {
      logger.error('Error fetching promotion:', error);
      throw error;
    }
  }

  /**
   * Actualizar una promoción
   */
  static async update(id: string, data: UpdatePromotionInput) {
    try {
      const updateData: any = { ...data };

      // Manejar países
      if (data.countries !== undefined) {
        // Eliminar países existentes y crear nuevos
        await prisma.promotionCountry.deleteMany({
          where: { promotionId: id }
        });

        if (!data.isGlobal && data.countries.length > 0) {
          updateData.countries = {
            create: data.countries.map(countryCode => ({ countryCode }))
          };
        }
      }

      delete updateData.countries; // Ya manejado arriba

      const promotion = await prisma.promotion.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
          countries: true,
          couponCodes: {
            select: {
              id: true,
              isUsed: true,
            }
          },
          createdBy: {
            select: {
              id: true,
              username: true,
            }
          }
        }
      });

      // Invalidar cache
      await cache.del(`promotion:${id}`);
      await cache.del(`promotion:${promotion.slug}`);
      await cache.delPattern('promotions:*');

      logger.info(`Promotion updated: ${id}`);
      return promotion;

    } catch (error) {
      logger.error('Error updating promotion:', error);
      throw error;
    }
  }

  /**
   * Eliminar una promoción
   */
  static async delete(id: string) {
    try {
      const promotion = await prisma.promotion.findUnique({
        where: { id }
      });

      if (!promotion) {
        throw new Error('Promotion not found');
      }

      await prisma.promotion.delete({
        where: { id }
      });

      // Invalidar cache
      await cache.del(`promotion:${id}`);
      await cache.del(`promotion:${promotion.slug}`);
      await cache.delPattern('promotions:*');

      logger.info(`Promotion deleted: ${id}`);

    } catch (error) {
      logger.error('Error deleting promotion:', error);
      throw error;
    }
  }

  /**
   * Canjear un cupón (solo para promociones tipo COUPON)
   */
  static async redeemCoupon(promotionId: string, data: RedeemCouponInput) {
    try {
      const promotion = await prisma.promotion.findUnique({
        where: { id: promotionId },
        include: {
          couponCodes: {
            where: { isUsed: false },
            take: 1
          }
        }
      });

      if (!promotion) {
        throw new Error('Promotion not found');
      }

      if (promotion.type !== 'COUPON') {
        throw new Error('This promotion is not a coupon');
      }

      if (promotion.status !== 'PUBLISHED') {
        throw new Error('This promotion is not active');
      }

      // Verificar si hay cupones disponibles
      if (promotion.couponCodes.length === 0) {
        throw new Error('No coupons available');
      }

      const couponCode = promotion.couponCodes[0];

      // Crear el registro de canje y marcar el código como usado
      const redemption = await prisma.$transaction(async (tx) => {
        // Marcar código como usado
        await tx.couponCode.update({
          where: { id: couponCode.id },
          data: {
            isUsed: true,
            usedAt: new Date(),
            usedBy: data.userEmail,
          }
        });

        // Crear registro de canje
        const newRedemption = await tx.couponRedemption.create({
          data: {
            promotionId,
            couponCodeId: couponCode.id,
            userName: data.userName,
            userEmail: data.userEmail,
          },
          include: {
            couponCode: true,
            promotion: true,
          }
        });

        return newRedemption;
      });

      // Invalidar cache
      await cache.del(`promotion:${promotionId}`);
      await cache.del(`promotion:${promotion.slug}`);
      await cache.delPattern('promotions:*');

      logger.info(`Coupon redeemed: ${couponCode.code} by ${data.userEmail}`);
      return redemption;

    } catch (error) {
      logger.error('Error redeeming coupon:', error);
      throw error;
    }
  }

  /**
   * Agregar más códigos de cupón a una promoción existente
   */
  static async addCouponCodes(promotionId: string, codes: string[]) {
    try {
      const promotion = await prisma.promotion.findUnique({
        where: { id: promotionId }
      });

      if (!promotion) {
        throw new Error('Promotion not found');
      }

      if (promotion.type !== 'COUPON') {
        throw new Error('This promotion is not a coupon');
      }

      // Crear los nuevos códigos
      const newCodes = await prisma.couponCode.createMany({
        data: codes.map(code => ({
          promotionId,
          code,
        })),
        skipDuplicates: true, // Evitar errores si hay códigos duplicados
      });

      // Invalidar cache
      await cache.del(`promotion:${promotionId}`);
      await cache.del(`promotion:${promotion.slug}`);
      await cache.delPattern('promotions:*');

      logger.info(`Added ${newCodes.count} coupon codes to promotion: ${promotionId}`);
      return { added: newCodes.count };

    } catch (error) {
      logger.error('Error adding coupon codes:', error);
      throw error;
    }
  }

  /**
   * Obtener analítica de cupones
   */
  static async getCouponAnalytics(promotionId?: string) {
    try {
      const cacheKey = promotionId ? `analytics:coupon:${promotionId}` : 'analytics:coupons:all';
      const cached = await cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      const where: any = { type: 'COUPON' };
      if (promotionId) where.id = promotionId;

      const promotions = await prisma.promotion.findMany({
        where,
        include: {
          couponCodes: {
            select: {
              id: true,
              isUsed: true,
              usedAt: true,
            }
          },
          redemptions: {
            select: {
              id: true,
              userEmail: true,
              createdAt: true,
            }
          }
        }
      });

      const analytics = promotions.map(promo => {
        const totalCodes = promo.couponCodes.length;
        const usedCodes = promo.couponCodes.filter(c => c.isUsed).length;
        const availableCodes = totalCodes - usedCodes;
        const redemptions = promo.redemptions.length;

        return {
          id: promo.id,
          title: promo.title,
          slug: promo.slug,
          totalCodes,
          usedCodes,
          availableCodes,
          redemptions,
          viewCount: promo.viewCount,
          status: promo.status,
          createdAt: promo.createdAt,
        };
      });

      await cache.set(cacheKey, JSON.stringify(analytics), CACHE_TTL);
      return analytics;

    } catch (error) {
      logger.error('Error fetching coupon analytics:', error);
      throw error;
    }
  }
}
