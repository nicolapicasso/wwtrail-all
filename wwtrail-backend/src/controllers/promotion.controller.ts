import { Request, Response, NextFunction } from 'express';
import { PromotionService } from '../services/promotion.service';
import { EmailService } from '../services/email.service';
import logger from '../utils/logger';

/**
 * PromotionController - Maneja todas las peticiones HTTP relacionadas con promociones
 * (Cupones y Contenido Exclusivo)
 */
export class PromotionController {
  /**
   * POST /api/v1/promotions
   * Crear una nueva promoción
   * @auth Required (ADMIN)
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const userId = req.user!.id;

      const promotion = await PromotionService.create({
        ...data,
        createdById: userId,
      });

      res.status(201).json({
        status: 'success',
        message: 'Promotion created successfully',
        data: promotion,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/promotions
   * Obtener todas las promociones con filtros opcionales
   * @auth No requerida (pero solo muestra PUBLISHED si no es admin)
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;
      const isAdmin = req.user?.role === 'ADMIN';

      // Si no es admin, solo mostrar publicados
      // Si es admin y no especifica status, mostrar todos
      const queryFilters: any = {
        ...filters,
      };

      // Solo aplicar filtro de status si:
      // - No es admin (forzar PUBLISHED)
      // - Es admin Y especificó un status explícitamente
      if (!isAdmin) {
        queryFilters.status = 'PUBLISHED';
      } else if (filters.status) {
        queryFilters.status = filters.status;
      }

      const result = await PromotionService.getAll(queryFilters);

      res.json({
        status: 'success',
        promotions: result.promotions,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/promotions/:idOrSlug
   * Obtener una promoción por ID o slug
   * @auth No requerida para ver, pero contenido exclusivo requiere login
   */
  static async getByIdOrSlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { idOrSlug } = req.params;
      const userId = req.user?.id;
      const isAdmin = req.user?.role === 'ADMIN';

      console.log('🔍 getByIdOrSlug:', { idOrSlug, userId, isAdmin, hasUser: !!req.user });

      const promotion = await PromotionService.getByIdOrSlug(idOrSlug, userId);

      console.log('📦 Promotion from service:', promotion ? { id: promotion.id, status: promotion.status, type: promotion.type } : 'null');

      if (!promotion) {
        return res.status(404).json({
          status: 'error',
          message: 'Promotion not found',
        });
      }

      // Si no es admin y no está publicado, no mostrar
      if (!isAdmin && promotion.status !== 'PUBLISHED') {
        console.log('❌ Not admin and not published');
        return res.status(404).json({
          status: 'error',
          message: 'Promotion not found',
        });
      }

      // Si es contenido exclusivo y no está logueado, ocultar el contenido
      if (promotion.type === 'EXCLUSIVE_CONTENT' && !userId) {
        const { exclusiveContent, ...publicData } = promotion;
        console.log('🔒 Exclusive content without login - hiding content');
        return res.json({
          status: 'success',
          data: {
            ...publicData,
            requiresLogin: true,
          },
        });
      }

      console.log('✅ Returning full promotion');
      res.json({
        status: 'success',
        data: promotion,
      });
    } catch (error) {
      console.error('❌ Error in getByIdOrSlug:', error);
      next(error);
    }
  }

  /**
   * PATCH /api/v1/promotions/:id
   * Actualizar una promoción
   * @auth Required (ADMIN)
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;

      const promotion = await PromotionService.update(id, data);

      res.json({
        status: 'success',
        message: 'Promotion updated successfully',
        data: promotion,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/promotions/:id
   * Eliminar una promoción
   * @auth Required (ADMIN)
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await PromotionService.delete(id);

      res.json({
        status: 'success',
        message: 'Promotion deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/promotions/:id/redeem
   * Canjear un cupón (solo para promociones tipo COUPON)
   * @auth No requerida
   */
  static async redeemCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { userName, userEmail } = req.body;

      if (!userName || !userEmail) {
        return res.status(400).json({
          status: 'error',
          message: 'userName and userEmail are required',
        });
      }

      const redemption = await PromotionService.redeemCoupon(id, {
        userName,
        userEmail,
      });

      // Enviar email con el código del cupón
      try {
        await EmailService.sendCouponEmail({
          to: userEmail,
          userName,
          couponCode: redemption.couponCode.code,
          promotionTitle: redemption.promotion.title,
          promotionDescription: redemption.promotion.description,
          brandUrl: redemption.promotion.brandUrl || undefined,
        });
      } catch (emailError) {
        logger.error('Error sending coupon email:', emailError);
        // No fallar la petición si el email falla, pero loguearlo
      }

      res.json({
        status: 'success',
        message: 'Coupon redeemed successfully. Check your email!',
        data: {
          id: redemption.id,
          code: redemption.couponCode.code,
          promotion: {
            title: redemption.promotion.title,
            description: redemption.promotion.description,
            brandUrl: redemption.promotion.brandUrl,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/promotions/:id/codes
   * Agregar más códigos de cupón a una promoción existente
   * @auth Required (ADMIN)
   */
  static async addCouponCodes(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { codes } = req.body;

      if (!Array.isArray(codes) || codes.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'codes must be a non-empty array',
        });
      }

      const result = await PromotionService.addCouponCodes(id, codes);

      res.json({
        status: 'success',
        message: `${result.added} coupon codes added successfully`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/promotions/analytics/coupons
   * Obtener analítica de cupones (todos o uno específico)
   * @auth Required (ADMIN)
   */
  static async getCouponAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { promotionId } = req.query;

      const analytics = await PromotionService.getCouponAnalytics(
        promotionId as string | undefined
      );

      res.json({
        status: 'success',
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }
}
