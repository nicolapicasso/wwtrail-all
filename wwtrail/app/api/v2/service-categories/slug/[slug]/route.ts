import { NextRequest } from 'next/server';
import { ServiceCategoryService } from '@/lib/services/serviceCategory.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const category = await ServiceCategoryService.getBySlug(params.slug);
    return apiSuccess(category);
  } catch (error) {
    return apiError(error);
  }
}
