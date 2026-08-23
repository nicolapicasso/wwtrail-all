import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';
import prisma from '@/lib/db';

// PUT /api/v2/users/me/marketing  (auth) — user manages their own marketing consent
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { optIn } = await request.json();
    const value = !!optIn;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        marketingOptIn: value,
        ...(value ? { marketingOptInAt: new Date() } : {}),
      },
    });
    return apiSuccess({ marketingOptIn: value });
  } catch (error) {
    return apiError(error);
  }
}
