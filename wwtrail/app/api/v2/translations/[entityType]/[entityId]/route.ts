import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/v2/translations/:entityType/:entityId
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entityType: string; entityId: string }> }
) {
  try {
    await requireAuth(request);
    const { entityType, entityId } = await params;

    // Map entity type to translation model
    const translationModels: Record<string, any> = {
      event: prisma.eventTranslation,
      competition: prisma.competitionTranslation,
      specialSeries: prisma.specialSeriesTranslation,
    };

    const model = translationModels[entityType];
    if (!model) {
      return apiSuccess([]);
    }

    // Build where clause based on entity type
    const foreignKey = `${entityType}Id`;
    const translations = await model.findMany({
      where: { [foreignKey]: entityId },
      orderBy: { language: 'asc' },
    });

    return apiSuccess(translations);
  } catch (error) {
    return apiError(error);
  }
}
