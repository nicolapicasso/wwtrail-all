import { NextRequest } from 'next/server';
import { apiSuccess, apiError, ApiError } from '@/lib/auth';
import { OutreachService } from '@/lib/services/outreach.service';

// Daily outreach job. Call it once a day from an external scheduler
// (e.g. cron-job.org). Protected by CRON_SECRET, provided as either:
//   - header  x-cron-secret: <secret>
//   - header  Authorization: Bearer <secret>
//   - query   ?secret=<secret>
async function run(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new ApiError('CRON_SECRET is not configured', 500);

  const provided =
    request.headers.get('x-cron-secret') ||
    (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '') ||
    new URL(request.url).searchParams.get('secret') ||
    '';

  if (provided !== secret) throw new ApiError('Unauthorized', 401);

  // ?dryRun=true → report what WOULD be sent without sending anything.
  const dryRun = ['1', 'true', 'yes'].includes(
    (new URL(request.url).searchParams.get('dryRun') || '').toLowerCase()
  );
  const result = await OutreachService.runDaily({ dryRun });
  return apiSuccess({ ok: true, ...result });
}

export async function GET(request: NextRequest) {
  try { return await run(request); } catch (e) { return apiError(e); }
}
export async function POST(request: NextRequest) {
  try { return await run(request); } catch (e) { return apiError(e); }
}
