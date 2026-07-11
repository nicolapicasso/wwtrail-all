import { NextRequest } from 'next/server';
import { requireRole, signAccessToken, apiSuccess, apiError, ApiError } from '@/lib/auth';
import prisma from '@/lib/db';
import logger from '@/lib/utils/logger';

// POST /api/v2/admin/impersonate - Start impersonating a user (ADMIN only).
// Returns an access token acting as the target user, tagged with impersonatedBy.
export async function POST(request: NextRequest) {
  try {
    const admin = await requireRole(request, 'ADMIN');
    const { userId } = await request.json();
    if (!userId) throw new ApiError('userId requerido', 400);
    if (userId === admin.id) throw new ApiError('No puedes suplantarte a ti mismo', 400);

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true, firstName: true, lastName: true, role: true, isActive: true },
    });
    if (!target || !target.isActive) throw new ApiError('Usuario no encontrado o inactivo', 404);

    const accessToken = signAccessToken({
      id: target.id,
      email: target.email,
      role: target.role,
      impersonatedBy: admin.id,
    });

    logger.info(`ADMIN ${admin.id} started impersonating user ${target.id}`);

    const name = `${target.firstName || ''} ${target.lastName || ''}`.trim() || target.username;
    return apiSuccess({
      accessToken,
      user: { id: target.id, email: target.email, username: target.username, role: target.role, name },
    });
  } catch (error) {
    return apiError(error);
  }
}
