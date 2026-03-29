import { NextRequest } from 'next/server';
import { PromotionService } from '@/lib/services/promotion.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || undefined;
    const promotion = await PromotionService.getByIdOrSlug(params.slug);
    return apiSuccess(promotion);
  } catch (error) { return apiError(error); }
}
