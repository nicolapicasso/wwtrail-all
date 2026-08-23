import { NextRequest } from 'next/server';
import { apiSuccess, apiError, ApiError } from '@/lib/auth';
import { MarketingService } from '@/lib/services/marketing.service';

// GET/POST /api/v2/marketing/unsubscribe?token=...  (public)
async function run(request: NextRequest) {
  const token = new URL(request.url).searchParams.get('token')
    || (await request.json().catch(() => ({}))).token;
  if (!token) throw new ApiError('token required', 400);
  await MarketingService.unsubscribe(token);
  return apiSuccess({ ok: true });
}
export async function GET(request: NextRequest) { try { return await run(request); } catch (e) { return apiError(e); } }
export async function POST(request: NextRequest) { try { return await run(request); } catch (e) { return apiError(e); } }
