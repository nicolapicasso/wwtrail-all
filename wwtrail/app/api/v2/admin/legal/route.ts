import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';
import { LegalService } from '@/lib/services/legal.service';

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || 'privacy';
    const language = searchParams.get('language') || 'ES';
    return apiSuccess(await LegalService.getPage(slug, language));
  } catch (e) { return apiError(e); }
}

export async function PUT(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const { slug, language, title, content } = await request.json();
    if (!slug || !language) throw new ApiError('slug and language required', 400);
    await LegalService.upsertPage(slug, language, title || '', content || '');
    return apiSuccess(await LegalService.getPage(slug, language));
  } catch (e) { return apiError(e); }
}
