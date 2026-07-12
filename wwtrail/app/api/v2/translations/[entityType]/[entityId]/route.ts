import { NextRequest } from 'next/server';
import { requireRole, requireAuth, apiSuccess, apiError, ApiError } from '@/lib/auth';
import prisma from '@/lib/db';
import { TranslationService } from '@/lib/services/translation.service';
import type { Language } from '@prisma/client';

const ALL_LANGS: Language[] = ['ES', 'EN', 'IT', 'CA', 'FR', 'DE'] as Language[];
// URL entityType -> autoTranslate entityType
const ENTITY_MAP: Record<string, 'event' | 'competition' | 'post' | 'service' | 'specialSeries'> = {
  event: 'event',
  competition: 'competition',
  post: 'post',
  service: 'service',
  'special-series': 'specialSeries',
  specialSeries: 'specialSeries',
};

// POST /api/v2/translations/:entityType/:entityId - Auto-translate an entity (ADMIN)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ entityType: string; entityId: string }> }
) {
  try {
    await requireRole(request, 'ORGANIZER', 'ADMIN');
    const { entityType, entityId } = await params;
    const mapped = ENTITY_MAP[entityType];
    if (!mapped) throw new ApiError(`Tipo no soportado: ${entityType}`, 400);

    const body = await request.json().catch(() => ({}));
    const targetLanguages: Language[] = Array.isArray(body?.targetLanguages) && body.targetLanguages.length
      ? body.targetLanguages
      : ALL_LANGS;

    const result = await TranslationService.autoTranslate({
      entityType: mapped,
      entityId,
      targetLanguages,
      overwrite: body?.overwrite ?? false,
    });
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

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
