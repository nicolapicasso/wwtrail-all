import { NextRequest } from 'next/server';
import { UserService } from '@/lib/services/user.service';
import { requireAuth, requireRole, apiSuccess, apiError } from '@/lib/auth';

const userService = new UserService();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await userService.getOwnProfile(params.id);
    return apiSuccess(user);
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await requireAuth(request);
    const data = await request.json();
    const user = await userService.updateProfile(params.id, data);
    return apiSuccess(user);
  } catch (error) { return apiError(error); }
}
