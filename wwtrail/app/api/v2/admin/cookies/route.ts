import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';
import { LegalService } from '@/lib/services/legal.service';

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    return apiSuccess(await LegalService.listCookies(false));
  } catch (e) { return apiError(e); }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    if (!data.name || !data.purpose || !data.category) throw new ApiError('name, category and purpose required', 400);
    return apiSuccess(await LegalService.createCookie(data), 201);
  } catch (e) { return apiError(e); }
}
