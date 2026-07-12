import { NextRequest } from 'next/server';
import { PromotionService } from '@/lib/services/promotion.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/promotions/analytics/coupons?promotionId= - Coupon analytics (ADMIN)
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const promotionId = new URL(request.url).searchParams.get('promotionId') || undefined;
    const analytics = await PromotionService.getCouponAnalytics(promotionId);
    return apiSuccess(analytics);
  } catch (error) {
    return apiError(error);
  }
}
