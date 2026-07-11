import { NextRequest } from 'next/server';
import { TranslationService } from '@/lib/services/translation.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/translations/bulk/status - Translation stats per entity type (admin)
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const stats = await TranslationService.getStats();
    return apiSuccess(stats);
  } catch (error) {
    return apiError(error);
  }
}
