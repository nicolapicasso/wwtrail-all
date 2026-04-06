import { NextRequest } from 'next/server';
import { PromotionService } from '@/lib/services/promotion.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const promotion = await PromotionService.getByIdOrSlug(params.id);
    return apiSuccess(promotion);
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const { id } = await params;
    const promotion = await PromotionService.update(id, data);
    return apiSuccess(promotion);
  } catch (error) { return apiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    await PromotionService.delete(params.id);
    return apiSuccess({ message: 'Promotion deleted' });
  } catch (error) { return apiError(error); }
}
