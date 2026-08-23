import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';
import { OutreachTemplateService } from '@/lib/services/outreachTemplate.service';

// GET /api/v2/admin/outreach-templates?type=WELCOME&language=ES  (ADMIN)
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'WELCOME';
    const language = searchParams.get('language') || 'ES';
    const data = await OutreachTemplateService.getForEdit(type, language);
    return apiSuccess(data);
  } catch (error) {
    return apiError(error);
  }
}

// PUT /api/v2/admin/outreach-templates  (ADMIN) — save an override
export async function PUT(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const { type, language, subject, htmlBody } = await request.json();
    if (!type || !language || !subject || !htmlBody) {
      throw new ApiError('type, language, subject and htmlBody are required', 400);
    }
    await OutreachTemplateService.upsert(type, language, subject, htmlBody);
    const data = await OutreachTemplateService.getForEdit(type, language);
    return apiSuccess(data);
  } catch (error) {
    return apiError(error);
  }
}

// DELETE /api/v2/admin/outreach-templates?type=&language=  (ADMIN) — reset to default
export async function DELETE(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || '';
    const language = searchParams.get('language') || '';
    await OutreachTemplateService.reset(type, language);
    const data = await OutreachTemplateService.getForEdit(type, language);
    return apiSuccess(data);
  } catch (error) {
    return apiError(error);
  }
}
