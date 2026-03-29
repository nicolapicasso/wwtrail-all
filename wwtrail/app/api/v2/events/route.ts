import { NextRequest } from 'next/server';
import { EventService } from '@/lib/services/event.service';
import { getAuthUser, requireRole, apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: any = {};

    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    const result = await EventService.findAll(params);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

// POST /api/v2/events
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const event = await EventService.create(data, user.id, user.role);
    return apiSuccess(event, 201);
  } catch (error) {
    return apiError(error);
  }
}
