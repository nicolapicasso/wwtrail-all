import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/v2/events/stats
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const isAdmin = user.role === 'ADMIN';

    const where = isAdmin ? {} : { createdById: user.id };

    const [total, published, draft, rejected] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.count({ where: { ...where, status: 'PUBLISHED' } }),
      prisma.event.count({ where: { ...where, status: 'DRAFT' } }),
      prisma.event.count({ where: { ...where, status: 'CANCELLED' } }),
    ]);

    return apiSuccess({ total, published, draft, rejected });
  } catch (error) {
    return apiError(error);
  }
}
