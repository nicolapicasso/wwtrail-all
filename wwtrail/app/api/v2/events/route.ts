import { NextRequest } from 'next/server';
import { EventService } from '@/lib/services/event.service';
import { getAuthUser, requireRole, apiSuccess, apiError } from '@/lib/auth';
import { OutreachService } from '@/lib/services/outreach.service';

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
    // Outreach: when an admin registers an event, invite its organizer to manage
    // it (best-effort, idempotent — never blocks event creation).
    if (user.role === 'ADMIN' && event?.id) {
      await OutreachService.sendWelcome(event.id, user.id);
    }
    return apiSuccess(event, 201);
  } catch (error) {
    return apiError(error);
  }
}
