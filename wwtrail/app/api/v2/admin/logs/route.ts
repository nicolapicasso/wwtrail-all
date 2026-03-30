import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    // Activity logs not yet implemented - return empty array
    return apiSuccess({ data: [], pagination: { currentPage: 1, totalPages: 0, total: 0 } });
  } catch (error) { return apiError(error); }
}
