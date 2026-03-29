import { NextRequest } from 'next/server';
import { AdminService } from '@/lib/services/admin.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

const adminService = new AdminService();

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const { searchParams } = new URL(request.url);
    const filters: Record<string, any> = {};
    for (const [key, value] of searchParams.entries()) {
      filters[key] = value;
    }
    if (filters.page) filters.page = Number(filters.page);
    if (filters.limit) filters.limit = Number(filters.limit);

    const result = await adminService.getPendingContent();
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}
