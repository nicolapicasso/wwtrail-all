import { NextRequest } from 'next/server';
import { ServiceCategoryService } from '@/lib/services/serviceCategory.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET() {
  try {
    const result = await ServiceCategoryService.getAll();
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const category = await ServiceCategoryService.create(data);
    return apiSuccess(category, 201);
  } catch (error) { return apiError(error); }
}
