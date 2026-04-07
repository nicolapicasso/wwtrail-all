import { NextRequest } from 'next/server';
import { CatalogService } from '@/lib/services/catalog.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// Map URL-style type names to CatalogService keys
const typeMap: Record<string, 'competitionType' | 'terrainType' | 'specialSeries'> = {
  'competition-types': 'competitionType',
  'competitionType': 'competitionType',
  'terrain-types': 'terrainType',
  'terrainType': 'terrainType',
  'special-series': 'specialSeries',
  'specialSeries': 'specialSeries',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawType = searchParams.get('type') || 'competition-types';
    const catalogType = typeMap[rawType] || 'competitionType';
    const activeOnly = searchParams.get('isActive') === 'true';
    const result = await CatalogService.getAll(catalogType, activeOnly);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const result = await CatalogService.create(data);
    return apiSuccess(result, 201);
  } catch (error) { return apiError(error); }
}
