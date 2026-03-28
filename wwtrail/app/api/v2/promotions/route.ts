import { NextRequest } from 'next/server';
import { PromotionService } from '@/lib/services/promotion.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: any = {};
    for (const [key, value] of searchParams.entries()) params[key] = value;
    const result = await PromotionService.getAll(params);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const promotion = await PromotionService.create(data, user.id);
    return apiSuccess(promotion, 201);
  } catch (error) { return apiError(error); }
}
