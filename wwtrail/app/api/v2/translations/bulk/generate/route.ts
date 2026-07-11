import { NextRequest } from 'next/server';
import { TranslationService } from '@/lib/services/translation.service';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';

const SUPPORTED = ['event', 'competition', 'post', 'service', 'promotion', 'specialSeries'] as const;
type SupportedType = (typeof SUPPORTED)[number];

// POST /api/v2/translations/bulk/generate - Bulk translate pending entities of a type (admin)
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const { entityType } = await request.json();

    if (!SUPPORTED.includes(entityType)) {
      throw new ApiError(`Tipo de entidad no soportado: ${entityType}`, 400);
    }

    const result = await TranslationService.bulkTranslateType(entityType as SupportedType);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}
