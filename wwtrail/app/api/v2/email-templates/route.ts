import { NextRequest } from 'next/server';
import { EmailTemplateService } from '@/lib/services/email-template.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const result = await EmailTemplateService.getAll();
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const template = await EmailTemplateService.create(data);
    return apiSuccess(template, 201);
  } catch (error) { return apiError(error); }
}
