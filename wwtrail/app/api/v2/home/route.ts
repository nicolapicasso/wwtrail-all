import { NextRequest } from 'next/server';
import { HomeConfigurationService } from '@/lib/services/homeConfiguration.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET() {
  try {
    const config = await HomeConfigurationService.getActive();
    return apiSuccess(config);
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const config = await HomeConfigurationService.createOrUpdate(data);
    return apiSuccess(config);
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const config = await HomeConfigurationService.createOrUpdate(data);
    return apiSuccess(config);
  } catch (error) { return apiError(error); }
}
