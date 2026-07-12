import { NextRequest } from 'next/server';
import { EditionService } from '@/lib/services/edition.service';
import { apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/editions/:id/stats
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stats = await EditionService.getStats(params.id);
    return apiSuccess(stats);
  } catch (error) {
    return apiError(error);
  }
}
