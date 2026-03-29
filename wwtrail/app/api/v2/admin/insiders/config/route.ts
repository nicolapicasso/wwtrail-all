import { NextRequest } from 'next/server';
import { AdminService } from '@/lib/services/admin.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

const adminService = new AdminService();

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const config = await adminService.getInsiderConfig();
    return apiSuccess(config);
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const config = await adminService.updateInsiderConfig(data);
    return apiSuccess(config);
  } catch (error) { return apiError(error); }
}
