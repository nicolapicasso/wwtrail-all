import { NextRequest } from 'next/server';
import { apiSuccess, apiError, ApiError } from '@/lib/auth';
import { AccountSetupService } from '@/lib/services/accountSetup.service';

// GET /api/v2/auth/set-password?token=...  (public) — validate + describe
export async function GET(request: NextRequest) {
  try {
    const token = new URL(request.url).searchParams.get('token');
    if (!token) throw new ApiError('Token is required', 400);
    const info = await AccountSetupService.verify(token);
    return apiSuccess({ email: info.email });
  } catch {
    return apiError(new ApiError('Invalid or expired link', 400));
  }
}

// POST /api/v2/auth/set-password  (public) — set password + activate
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    if (!token) throw new ApiError('Token is required', 400);
    if (!password || String(password).length < 8) {
      throw new ApiError('Password must be at least 8 characters', 400);
    }
    await AccountSetupService.accept(token, password);
    return apiSuccess({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
