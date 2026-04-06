import { NextRequest } from 'next/server';
import { SEOService } from '@/lib/services/seo.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const result = await SEOService.regenerateSEO(data);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}
