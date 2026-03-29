import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { refreshToken } = body;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    return apiSuccess({ message: 'Logged out successfully' });
  } catch (error) {
    return apiError(error);
  }
}
