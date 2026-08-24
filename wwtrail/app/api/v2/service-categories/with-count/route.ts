import { ServiceCategoryService } from '@/lib/services/serviceCategory.service';
import { apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/service-categories/with-count
// Service categories including how many services each one has.
export async function GET() {
  try {
    const result = await ServiceCategoryService.getCategoriesWithCount();
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}
