import { NextRequest } from 'next/server';
import { AdminService } from '@/lib/services/admin.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

const adminService = new AdminService();

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const stats = await adminService.getComprehensiveStats();
    return apiSuccess(stats.competitions);
  } catch (error) { return apiError(error); }
}
