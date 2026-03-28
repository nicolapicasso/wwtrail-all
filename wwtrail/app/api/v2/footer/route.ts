import { NextRequest } from 'next/server';
import { FooterService } from '@/lib/services/footer.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET() {
  try {
    const footer = await FooterService.get();
    return apiSuccess(footer);
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const footer = await FooterService.update(data);
    return apiSuccess(footer);
  } catch (error) { return apiError(error); }
}
