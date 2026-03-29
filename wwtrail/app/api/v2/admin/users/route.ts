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
    if (filters.isActive !== undefined) filters.isActive = filters.isActive === 'true';

    const result = await adminService.getUsers(filters);
    return apiSuccess({ data: result.users, pagination: result.pagination });
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const result = await adminService.createUser(data);
    return apiSuccess(result, 201);
  } catch (error) { return apiError(error); }
}
