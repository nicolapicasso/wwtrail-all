import { NextRequest } from 'next/server';
import { UserService } from '@/lib/services/user.service';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';

const userService = new UserService();

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const result = await userService.getUserParticipations(user.id);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}
