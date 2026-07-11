import { NextRequest } from 'next/server';
import { UserService } from '@/lib/services/user.service';
import { apiSuccess, apiError, ApiError } from '@/lib/auth';

const userService = new UserService();

// GET /api/v2/users/profile/[username] - Public profile by username (no auth)
export async function GET(
  _request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const profile = await userService.getPublicProfileByUsername(params.username);
    return apiSuccess(profile);
  } catch (error: any) {
    if (error?.message === 'User not found') {
      return apiError(new ApiError('User not found', 404));
    }
    if (error?.message === 'This profile is private') {
      return apiError(new ApiError('This profile is private', 403));
    }
    return apiError(error);
  }
}
