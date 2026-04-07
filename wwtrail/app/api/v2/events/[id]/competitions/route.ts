import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/v2/events/:id/competitions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const competitions = await prisma.competition.findMany({
      where: { eventId: id },
      include: {
        terrainType: { select: { id: true, name: true, slug: true } },
        _count: { select: { editions: true } },
      },
      orderBy: [{ name: 'asc' }],
    });

    return apiSuccess(competitions);
  } catch (error) {
    return apiError(error);
  }
}

// POST /api/v2/events/:id/competitions
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const data = await request.json();

    const competition = await prisma.competition.create({
      data: {
        ...data,
        eventId: id,
        slug: data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      },
    });

    return apiSuccess(competition, 201);
  } catch (error) {
    return apiError(error);
  }
}
