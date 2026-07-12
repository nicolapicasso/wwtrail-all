import { NextRequest } from 'next/server';
import { UserService } from '@/lib/services/user.service';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';

const userService = new UserService();

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const data = await request.json();
    const result = await userService.changePassword(user.id, data);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}
