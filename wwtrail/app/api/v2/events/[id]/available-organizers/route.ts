import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/v2/events/:id/available-organizers
// Returns USERS eligible to manage this event (role ORGANIZER or ADMIN, active),
// excluding the event creator and users already assigned as managers.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      select: {
        userId: true,
        managers: { select: { userId: true } },
      },
    });

    const excludedIds = new Set<string>();
    if (event?.userId) excludedIds.add(event.userId);
    event?.managers.forEach((m) => excludedIds.add(m.userId));

    const users = await prisma.user.findMany({
      where: {
        role: { in: ['ORGANIZER', 'ADMIN'] },
        isActive: true,
        id: { notIn: Array.from(excludedIds) },
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
      },
      orderBy: [{ firstName: 'asc' }, { username: 'asc' }],
    });

    return apiSuccess(users);
  } catch (error) {
    return apiError(error);
  }
}
