import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/v2/events/:id/available-organizers
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    const { id } = await params;

    // Get all published organizers that could be assigned to this event
    const organizers = await prisma.organizer.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, name: true, slug: true, country: true, logoUrl: true },
      orderBy: { name: 'asc' },
    });

    return apiSuccess(organizers);
  } catch (error) {
    return apiError(error);
  }
}
