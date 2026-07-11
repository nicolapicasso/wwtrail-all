import { NextRequest } from 'next/server';
import { EditionService } from '@/lib/services/edition.service';
import { apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/editions/calendar - Editions in a date range with inherited data (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const num = (key: string): number | undefined => {
      const v = searchParams.get(key);
      if (v == null || v === '') return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };

    const terrainRaw = searchParams.get('terrainTypeIds');
    const terrainTypeIds = terrainRaw ? terrainRaw.split(',').filter(Boolean) : undefined;

    const editions = await EditionService.findForCalendar({
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      country: searchParams.get('country') || undefined,
      competitionType: searchParams.get('competitionType') || undefined,
      specialSeriesId: searchParams.get('specialSeriesId') || undefined,
      terrainTypeIds,
      minDistance: num('minDistance'),
      maxDistance: num('maxDistance'),
      minElevation: num('minElevation'),
      maxElevation: num('maxElevation'),
      search: searchParams.get('search') || undefined,
      limit: num('limit'),
    });

    return apiSuccess({ data: editions, total: editions.length });
  } catch (error) {
    return apiError(error);
  }
}
