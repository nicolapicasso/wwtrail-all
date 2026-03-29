import { NextRequest } from 'next/server';
import { CompetitionService } from '@/lib/services/competition.service';
import { getAuthUser, requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: any = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    const user = await getAuthUser(request);
    const result = await CompetitionService.findAll(params);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const competition = await CompetitionService.create(data, user.id, user.role);
    return apiSuccess(competition, 201);
  } catch (error) {
    return apiError(error);
  }
}
