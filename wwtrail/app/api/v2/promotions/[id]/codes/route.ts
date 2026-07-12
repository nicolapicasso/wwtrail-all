import { NextRequest } from 'next/server';
import { PromotionService } from '@/lib/services/promotion.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const { codes } = await request.json();
    const result = await PromotionService.addCouponCodes(params.id, codes);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}
