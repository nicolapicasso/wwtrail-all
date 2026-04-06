import { NextRequest } from 'next/server';
import { SEOService } from '@/lib/services/seo.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/seo?entityType=...&entityId=...&language=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const slug = searchParams.get('slug');
    const language = searchParams.get('language') || 'ES';

    if (entityType && (entityId || slug)) {
      const seo = await SEOService.getSEO(entityType, entityId || slug!, language as any);
      return apiSuccess(seo);
    }

    return apiSuccess(null);
  } catch (error) { return apiError(error); }
}

// POST /api/v2/seo - generate SEO
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const result = await SEOService.generateAndSave(data);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

// PUT /api/v2/seo - update SEO by id
export async function PUT(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const { id, ...updateData } = data;
    if (!id) return apiError(new Error('id required'));
    const result = await SEOService.updateSEO(id, updateData);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

// DELETE /api/v2/seo - delete SEO by id
export async function DELETE(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return apiError(new Error('id required'));
    await SEOService.deleteSEO(id);
    return apiSuccess({ message: 'SEO deleted' });
  } catch (error) { return apiError(error); }
}
