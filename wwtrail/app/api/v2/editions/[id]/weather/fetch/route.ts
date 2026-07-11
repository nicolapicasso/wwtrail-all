import { NextRequest } from 'next/server';
import { WeatherService } from '@/lib/services/weather.service';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';

// POST /api/v2/editions/[id]/weather/fetch - Fetch & store historical weather (admin/organizer)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(request, 'ORGANIZER', 'ADMIN');
    const force = new URL(request.url).searchParams.get('force') === 'true';
    const data = await WeatherService.fetchWeatherForEdition(params.id, force);
    return apiSuccess(data);
  } catch (error: any) {
    if (error && typeof error.statusCode === 'number' && !(error instanceof ApiError)) {
      return apiError(new ApiError(error.message, error.statusCode));
    }
    return apiError(error);
  }
}
