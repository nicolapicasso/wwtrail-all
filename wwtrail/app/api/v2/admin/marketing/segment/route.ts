import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { MarketingService } from '@/lib/services/marketing.service';

// GET /api/v2/admin/marketing/segment?country=&language=  (ADMIN) — audience count
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const { searchParams } = new URL(request.url);
    const count = await MarketingService.segmentCount({
      country: searchParams.get('country') || undefined,
      language: searchParams.get('language') || undefined,
    });
    return apiSuccess({ count });
  } catch (error) { return apiError(error); }
}
