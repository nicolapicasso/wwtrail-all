import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth, apiSuccess, apiError, ApiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        language: true,
        avatar: true,
        bio: true,
        phone: true,
        country: true,
        city: true,
        gender: true,
        birthDate: true,
        isPublic: true,
        isInsider: true,
        instagramUrl: true,
        facebookUrl: true,
        twitterUrl: true,
        youtubeUrl: true,
        zancadasBalance: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    return apiSuccess(user);
  } catch (error) {
    return apiError(error);
  }
}
