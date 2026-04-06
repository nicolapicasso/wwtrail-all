import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;

    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        competitionId: id,
      },
    });

    return apiSuccess({ isFavorite: !!favorite });
  } catch (error) {
    return apiError(error);
  }
}
