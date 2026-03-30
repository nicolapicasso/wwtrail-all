import { NextRequest } from 'next/server';
import { UserService } from '@/lib/services/user.service';
import { apiSuccess, apiError } from '@/lib/auth';

const userService = new UserService();

export async function GET() {
  try {
    const data = await userService.getPublicInsiders();
    return apiSuccess(data);
  } catch (error) { return apiError(error); }
}
