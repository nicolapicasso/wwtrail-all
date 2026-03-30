import { NextRequest } from 'next/server';
import { AdminService } from '@/lib/services/admin.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

const adminService = new AdminService();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const { id } = await params;
    const user = await adminService.getUserById(id);
    return apiSuccess(user);
  } catch (error) { return apiError(error); }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const { id } = await params;
    const data = await request.json();
    const user = await adminService.updateUser(id, data);
    return apiSuccess(user);
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const { id } = await params;
    const data = await request.json();
    const user = await adminService.updateUserById(id, data);
    return apiSuccess(user);
  } catch (error) { return apiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireRole(request, 'ADMIN');
    const { id } = await params;
    await adminService.deleteUser(id, admin.id);
    return apiSuccess({ message: 'User deleted' });
  } catch (error) { return apiError(error); }
}
