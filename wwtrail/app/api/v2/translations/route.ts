import { NextRequest } from 'next/server';
import { TranslationService } from '@/lib/services/translation.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const result = await TranslationService.autoTranslate(data);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}
