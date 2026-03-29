import { NextRequest } from 'next/server';
import { CompetitionService } from '@/lib/services/competition.service';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || undefined;
    const competition = await CompetitionService.findById(params.id);
    return apiSuccess(competition);
  } catch (error: any) {
    if (error?.message?.includes('not found')) {
      return apiError(new ApiError('Competition not found', 404));
    }
    return apiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const competition = await CompetitionService.update(params.id, data, user.id);
    return apiSuccess(competition);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const competition = await CompetitionService.update(params.id, data, user.id);
    return apiSuccess(competition);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(request, 'ADMIN');
    await CompetitionService.delete(params.id, user.id);
    return apiSuccess({ message: 'Competition deleted' });
  } catch (error) {
    return apiError(error);
  }
}
