import { NextRequest } from 'next/server';
import { ServiceService } from '@/lib/services/service.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lon = parseFloat(searchParams.get('lon') || '0');
    const radius = parseFloat(searchParams.get('radius') || '50');

    if (!lat && !lon) {
      return apiSuccess([]);
    }

    const services = await ServiceService.findNearby(lat, lon, radius);
    return apiSuccess(services);
  } catch (error) {
    return apiError(error);
  }
}
