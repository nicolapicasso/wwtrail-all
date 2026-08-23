import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';
import { MarketingService } from '@/lib/services/marketing.service';

// POST /api/v2/admin/marketing/test  (ADMIN) — send one preview email
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const { subject, html, to, language } = await request.json();
    if (!subject || !html || !to) throw new ApiError('subject, html and to are required', 400);
    await MarketingService.sendTest({ subject, html, to, language });
    return apiSuccess({ sent: true, to });
  } catch (error) { return apiError(error); }
}
