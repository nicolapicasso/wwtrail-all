import { NextRequest } from 'next/server';
import { apiSuccess, apiError, ApiError } from '@/lib/auth';
import { MarketingDigestService } from '@/lib/services/marketingDigest.service';

// Weekly "new competitions by country" digest. Schedule once a week from
// cron-job.org. Protected by CRON_SECRET (x-cron-secret / Bearer / ?secret=).
// ?dryRun=true previews counts without sending.
async function run(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new ApiError('CRON_SECRET is not configured', 500);
  const provided =
    request.headers.get('x-cron-secret') ||
    (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '') ||
    new URL(request.url).searchParams.get('secret') || '';
  if (provided !== secret) throw new ApiError('Unauthorized', 401);

  const dryRun = ['1', 'true', 'yes'].includes(
    (new URL(request.url).searchParams.get('dryRun') || '').toLowerCase()
  );
  const result = await MarketingDigestService.runWeekly({ dryRun });
  return apiSuccess({ ok: true, ...result });
}
export async function GET(request: NextRequest) { try { return await run(request); } catch (e) { return apiError(e); } }
export async function POST(request: NextRequest) { try { return await run(request); } catch (e) { return apiError(e); } }
