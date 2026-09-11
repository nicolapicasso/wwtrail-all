import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { SEOService } from '@/lib/services/seo.service';

/**
 * POST /api/v2/seo/faq-cleanup  (admin only)
 * Sweep every stored FAQ and remove any phrasing that presents WWTRAIL as the
 * official event site or tells users to register on WWTRAIL, replacing it with
 * a pointer to the event's official website. No AI calls.
 */
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const result = await SEOService.cleanupAllFaqs();
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}
