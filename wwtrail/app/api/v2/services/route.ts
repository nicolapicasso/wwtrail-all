import { NextRequest } from 'next/server';
import { ServiceService } from '@/lib/services/service.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: any = {};
    for (const [key, value] of searchParams.entries()) params[key] = value;
    const result = await ServiceService.getAll(params);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const service = await ServiceService.create(data, user.id, user.role);
    return apiSuccess(service, 201);
  } catch (error) {
    return apiError(error);
  }
}
