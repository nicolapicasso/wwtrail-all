import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';
import { MarketingService } from '@/lib/services/marketing.service';

// POST /api/v2/admin/marketing/import  (ADMIN) — bulk import consented users
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const { rows } = await request.json();
    if (!Array.isArray(rows) || rows.length === 0) throw new ApiError('rows[] required', 400);
    if (rows.length > 20000) throw new ApiError('Too many rows (max 20000)', 400);
    const result = await MarketingService.importConsentedUsers(rows);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}
