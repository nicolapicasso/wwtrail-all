import { NextRequest } from 'next/server';
import { AdminService } from '@/lib/services/admin.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'stats';

    if (action === 'comprehensive') {
      const stats = await AdminService.getComprehensiveStats();
      return apiSuccess(stats);
    }
    const stats = await AdminService.getStats();
    return apiSuccess(stats);
  } catch (error) { return apiError(error); }
}
