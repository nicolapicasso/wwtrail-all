import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { verifyRefreshToken, generateTokens, apiSuccess, apiError, ApiError } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      throw new ApiError('Refresh token required', 400);
    }

    // Verify token signature
    const decoded = verifyRefreshToken(refreshToken);

    // Check it exists in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new ApiError('Invalid refresh token', 401);
    }

    if (new Date() > storedToken.expiresAt) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new ApiError('Refresh token expired', 401);
    }

    if (!storedToken.user.isActive) {
      throw new ApiError('Account is inactive', 403);
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(storedToken.user);

    // Delete old refresh token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    return apiSuccess({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return apiError(error);
  }
}
