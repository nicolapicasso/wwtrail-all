import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';
import prisma from '@/lib/db';
import { CompetitionService } from '@/lib/services/competition.service';

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

    // Usar el servicio (igual que el importador): genera slug único, asigna
    // organizerId, conecta specialSeries (many-to-many) e ignora campos que no
    // son columnas (p.ej. specialSeriesIds). El prisma.create directo fallaba
    // con Internal Server Error por esos campos y por faltar slug/organizerId.
    const competition = await CompetitionService.create(id, data, user.id);

    return apiSuccess(competition, 201);
  } catch (error) {
    return apiError(error);
  }
}
