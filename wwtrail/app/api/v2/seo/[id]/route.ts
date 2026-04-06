import { NextRequest } from 'next/server';
import { SEOService } from '@/lib/services/seo.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const { id } = await params;
    const data = await request.json();
    const result = await SEOService.updateSEO(id, data);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const { id } = await params;
    await SEOService.deleteSEO(id);
    return apiSuccess({ message: 'SEO deleted' });
  } catch (error) { return apiError(error); }
}
