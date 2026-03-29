import { NextRequest } from 'next/server';
import { UserService } from '@/lib/services/user.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: any = {};
    for (const [key, value] of searchParams.entries()) params[key] = value;
    const result = await UserService.getPublicUsers(params);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}
