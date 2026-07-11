import { NextRequest } from 'next/server';
import { PromotionService } from '@/lib/services/promotion.service';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const promotion = await PromotionService.getByIdOrSlug(params.id);
    return apiSuccess(promotion);
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const { id } = await params;

    // Ownership check: an organizer may only edit their own promotions.
    if (user.role !== 'ADMIN') {
      const existing = await prisma.promotion.findUnique({
        where: { id },
        select: { createdById: true },
      });
      if (!existing) throw new ApiError('Promotion not found', 404);
      if (existing.createdById !== user.id) {
        throw new ApiError('Forbidden', 403);
      }
    }

    const data = await request.json();
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
