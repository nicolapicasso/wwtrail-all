import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/auth';
import { LegalService } from '@/lib/services/legal.service';

// GET /api/v2/cookies  (public) — active cookie catalog for the consent banner
export async function GET(_request: NextRequest) {
  try {
    return apiSuccess(await LegalService.listCookies(true));
  } catch (e) { return apiError(e); }
}
