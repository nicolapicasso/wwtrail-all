import { NextRequest } from 'next/server';
import { LandingService } from '@/lib/services/landing.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: any = {};
    for (const [key, value] of searchParams.entries()) params[key] = value;
    const result = await LandingService.getAll(params);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(request, 'ADMIN');
    const data = await request.json();
    const landing = await LandingService.create(data, user.id);
    return apiSuccess(landing, 201);
  } catch (error) { return apiError(error); }
}
