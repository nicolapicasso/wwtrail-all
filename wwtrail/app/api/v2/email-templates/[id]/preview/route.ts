import { NextRequest } from 'next/server';
import { EmailTemplateService } from '@/lib/services/email-template.service';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';

// POST /api/v2/email-templates/:id/preview - Render a template with sample data (ADMIN)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(request, 'ADMIN');
    const body = (await request.json().catch(() => ({}))) as any;
    // Client sends { sampleData: {...} }; tolerate a flat body too.
    const sampleData = (body?.sampleData ?? body ?? {}) as Record<string, string>;
    const preview = await EmailTemplateService.preview(params.id, sampleData);
    return apiSuccess(preview);
  } catch (error: any) {
    if (error?.message?.includes('not found')) {
      return apiError(new ApiError('Plantilla no encontrada', 404));
    }
    return apiError(error);
  }
}
