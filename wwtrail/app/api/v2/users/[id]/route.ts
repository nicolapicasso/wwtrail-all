import { NextRequest } from 'next/server';
import { UserService } from '@/lib/services/user.service';
import { requireAuth, apiSuccess, apiError, ApiError } from '@/lib/auth';

const userService = new UserService();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // getOwnProfile returns private fields (email, phone, role, etc.),
    // so only the owner or an admin may read it.
    const authUser = await requireAuth(request);
    if (authUser.id !== params.id && authUser.role !== 'ADMIN') {
      throw new ApiError('Forbidden', 403);
    }

    const user = await userService.getOwnProfile(params.id);
    return apiSuccess(user);
  } catch (error: any) {
    if (error?.message?.includes('not found')) {
      return apiError(new ApiError('User not found', 404));
    }
    return apiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await requireAuth(request);
    // Prevent IDOR: a user may only update their own profile (admins may update anyone).
    if (authUser.id !== params.id && authUser.role !== 'ADMIN') {
      throw new ApiError('Forbidden', 403);
    }

    const data = await request.json();
    const user = await userService.updateProfile(params.id, data);
    return apiSuccess(user);
  } catch (error) { return apiError(error); }
}
