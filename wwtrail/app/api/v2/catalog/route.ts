import { NextRequest } from 'next/server';
import { CatalogService } from '@/lib/services/catalog.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'competition-types';
    const result = await CatalogService.getAll(type);
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
