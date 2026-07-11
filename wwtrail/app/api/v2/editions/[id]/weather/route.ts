import { NextRequest } from 'next/server';
import { WeatherService } from '@/lib/services/weather.service';
import { apiSuccess, apiError, ApiError } from '@/lib/auth';

// GET /api/v2/editions/[id]/weather - Weather data for an edition (public)
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await WeatherService.getEditionWeather(params.id);
    return apiSuccess(data);
  } catch (error: any) {
    if (error && typeof error.statusCode === 'number') {
      return apiError(new ApiError(error.message, error.statusCode));
    }
    return apiError(error);
  }
}
