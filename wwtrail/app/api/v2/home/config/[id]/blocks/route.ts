import { NextRequest } from 'next/server';
import { HomeConfigurationService } from '@/lib/services/homeConfiguration.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const { id } = await params;
    const data = await request.json();
    const block = await HomeConfigurationService.createBlock(id, data);
    return apiSuccess(block, 201);
  } catch (error) { return apiError(error); }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const { id } = await params;
    const config = await HomeConfigurationService.getById(id);
    return apiSuccess(config?.blocks || []);
  } catch (error) { return apiError(error); }
}
