import { NextRequest } from 'next/server';
import { PromotionService } from '@/lib/services/promotion.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const result = await PromotionService.redeemCoupon(params.id, data);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}
