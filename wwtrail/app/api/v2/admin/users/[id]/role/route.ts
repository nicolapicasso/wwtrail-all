import { NextRequest } from 'next/server';
import { AdminService } from '@/lib/services/admin.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

const adminService = new AdminService();

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireRole(request, 'ADMIN');
    const { id } = await params;
    const { role } = await request.json();
    const user = await adminService.updateUserRole(id, role, admin.id);
    return apiSuccess(user);
  } catch (error) { return apiError(error); }
}
