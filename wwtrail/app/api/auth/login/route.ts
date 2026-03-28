import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { comparePassword, generateTokens, apiSuccess, apiError, ApiError } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new ApiError('Account is inactive', 403);
    }

    const isValidPassword = await comparePassword(data.password, user.password);
    if (!isValidPassword) {
      throw new ApiError('Invalid credentials', 401);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const { accessToken, refreshToken } = await generateTokens(user);

    const { password, ...userWithoutPassword } = user;

    return apiSuccess({ user: userWithoutPassword, accessToken, refreshToken });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return apiError(error);
  }
}
