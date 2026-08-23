import { NextRequest } from 'next/server';
import { apiSuccess, apiError, ApiError } from '@/lib/auth';
import { OrganizerInviteService } from '@/lib/services/organizerInvite.service';

// GET /api/v2/auth/accept-invite?token=...  (public) — validate + describe the invite
export async function GET(request: NextRequest) {
  try {
    const token = new URL(request.url).searchParams.get('token');
    if (!token) throw new ApiError('Token is required', 400);
    const info = await OrganizerInviteService.verifyInvite(token);
    return apiSuccess({ email: info.email, eventName: info.eventName });
  } catch {
    // Do not leak details for invalid/expired tokens.
    return apiError(new ApiError('Invalid or expired invitation', 400));
  }
}

// POST /api/v2/auth/accept-invite  (public) — set password + activate
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    if (!token) throw new ApiError('Token is required', 400);
    if (!password || String(password).length < 8) {
      throw new ApiError('Password must be at least 8 characters', 400);
    }
    await OrganizerInviteService.acceptInvite(token, password);
    return apiSuccess({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
