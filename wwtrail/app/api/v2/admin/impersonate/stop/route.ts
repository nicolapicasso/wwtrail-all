import { NextRequest } from 'next/server';
import { readAccessTokenPayload, signAccessToken, apiSuccess, apiError, ApiError } from '@/lib/auth';
import prisma from '@/lib/db';
import logger from '@/lib/utils/logger';

// POST /api/v2/admin/impersonate/stop - End impersonation and return to the
// original admin. Trusts the signed impersonatedBy claim of the current token.
export async function POST(request: NextRequest) {
  try {
    const payload = readAccessTokenPayload(request);
    if (!payload?.impersonatedBy) {
      throw new ApiError('No hay sesión de suplantación activa', 400);
    }

    const admin = await prisma.user.findUnique({
      where: { id: payload.impersonatedBy },
      select: { id: true, email: true, role: true, isActive: true },
    });
    if (!admin || !admin.isActive || admin.role !== 'ADMIN') {
      throw new ApiError('Administrador original no válido', 403);
    }

    const accessToken = signAccessToken({ id: admin.id, email: admin.email, role: admin.role });
    logger.info(`Impersonation ended; restored ADMIN ${admin.id}`);

    return apiSuccess({ accessToken });
  } catch (error) {
    return apiError(error);
  }
}
