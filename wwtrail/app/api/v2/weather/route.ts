import { NextRequest } from 'next/server';
import { WeatherService } from '@/lib/services/weather.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const editionId = searchParams.get('editionId');
    if (!editionId) return apiError(new Error('editionId required'));
    const weather = await WeatherService.getByEdition(editionId);
    return apiSuccess(weather);
  } catch (error) { return apiError(error); }
}
