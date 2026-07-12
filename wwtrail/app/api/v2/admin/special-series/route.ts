import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { SpecialSeriesService } from '@/lib/services/specialSeries.service';

/**
 * GET /api/v2/admin/special-series
 * List all special series (admin)
 */
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');

    const { searchParams } = new URL(request.url);
    const params: any = {};
    for (const [key, value] of searchParams.entries()) params[key] = value;

    const result = await SpecialSeriesService.getAll(params);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

/**
 * POST /api/v2/admin/special-series
 * Create a special series (admin)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(request, 'ADMIN');
    const data = await request.json();
    const series = await SpecialSeriesService.create({ ...data, createdById: user.id }, user.role);
    return apiSuccess(series, 201);
  } catch (error) {
    return apiError(error);
  }
}
