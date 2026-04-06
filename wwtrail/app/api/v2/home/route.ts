import { NextRequest } from 'next/server';
import { HomeConfigurationService } from '@/lib/services/homeConfiguration.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET() {
  try {
    const config = await HomeConfigurationService.getActiveConfiguration();
    return apiSuccess(config);
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const config = await HomeConfigurationService.create(data);
    return apiSuccess(config);
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const { id, ...updateData } = data;
    if (id) {
      const config = await HomeConfigurationService.update(id, updateData);
      return apiSuccess(config);
    }
    // No id provided, try to update active config
    const active = await HomeConfigurationService.getActiveConfiguration();
    if (active) {
      const config = await HomeConfigurationService.update(active.id, updateData);
      return apiSuccess(config);
    }
    // No active config, create new
    const config = await HomeConfigurationService.create(data);
    return apiSuccess(config);
  } catch (error) { return apiError(error); }
}
