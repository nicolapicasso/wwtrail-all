import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';
import { MarketingService } from '@/lib/services/marketing.service';

// POST /api/v2/admin/marketing/broadcast  (ADMIN) — send to a segment (or dryRun)
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const { subject, html, filters, dryRun } = await request.json();
    if (!subject || !html) throw new ApiError('subject and html are required', 400);
    const result = await MarketingService.broadcast({ subject, html, filters, dryRun: !!dryRun });
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}
