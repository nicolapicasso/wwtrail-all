import { NextRequest } from 'next/server';
import { EventService } from '@/lib/services/event.service';
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

    const events = await EventService.findNearby(lat, lon, radius);
    return apiSuccess(events);
  } catch (error) {
    return apiError(error);
  }
}
