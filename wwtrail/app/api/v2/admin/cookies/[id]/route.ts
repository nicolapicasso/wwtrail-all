import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { LegalService } from '@/lib/services/legal.service';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const { id } = await params;
    const data = await request.json();
    return apiSuccess(await LegalService.updateCookie(id, data));
  } catch (e) { return apiError(e); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const { id } = await params;
    return apiSuccess(await LegalService.deleteCookie(id));
  } catch (e) { return apiError(e); }
}
