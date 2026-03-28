import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, generateTokens, apiSuccess, apiError, ApiError } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  language: z.enum(['ES', 'EN', 'IT', 'CA', 'FR', 'DE']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new ApiError('Email already registered', 400);
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUsername) {
      throw new ApiError('Username already taken', 400);
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        language: data.language || 'ES',
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        language: true,
        createdAt: true,
      },
    });

    const { accessToken, refreshToken } = await generateTokens(user);

    return apiSuccess({ user, accessToken, refreshToken }, 201);
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
