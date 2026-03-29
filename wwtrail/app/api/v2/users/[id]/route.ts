import { NextRequest } from 'next/server';
import { UserService } from '@/lib/services/user.service';
import { requireAuth, requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await UserService.getById(params.id);
    return apiSuccess(user);
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await requireAuth(request);
    const data = await request.json();
    const user = await UserService.update(params.id, data, authUser.id, authUser.role);
    return apiSuccess(user);
  } catch (error) { return apiError(error); }
}
