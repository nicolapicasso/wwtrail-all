import { NextRequest } from 'next/server';
import { ServiceCategoryService } from '@/lib/services/serviceCategory.service';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';

// GET /api/v2/service-categories/:id
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const category = await ServiceCategoryService.getById(params.id);
    return apiSuccess(category);
  } catch (error: any) {
    if (error?.message?.includes('not found')) return apiError(new ApiError('Categoría no encontrada', 404));
    return apiError(error);
  }
}

// PUT /api/v2/service-categories/:id (ADMIN)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const category = await ServiceCategoryService.update(params.id, data);
    return apiSuccess(category);
  } catch (error: any) {
    if (error?.message?.includes('not found')) return apiError(new ApiError('Categoría no encontrada', 404));
    return apiError(error);
  }
}

// DELETE /api/v2/service-categories/:id (ADMIN)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    await ServiceCategoryService.delete(params.id);
    return apiSuccess({ deleted: true });
  } catch (error: any) {
    if (error?.message?.includes('not found')) return apiError(new ApiError('Categoría no encontrada', 404));
    // e.g. "Cannot delete category with N associated services"
    if (error?.message?.includes('Cannot delete')) return apiError(new ApiError(error.message, 400));
    return apiError(error);
  }
}
