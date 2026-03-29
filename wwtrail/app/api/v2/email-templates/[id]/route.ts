import { NextRequest } from 'next/server';
import { EmailTemplateService } from '@/lib/services/email-template.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const template = await EmailTemplateService.getById(params.id);
    return apiSuccess(template);
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const template = await EmailTemplateService.update(params.id, data);
    return apiSuccess(template);
  } catch (error) { return apiError(error); }
}
