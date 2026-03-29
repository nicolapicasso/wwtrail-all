import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword } from '@/lib/auth';

/**
 * One-time setup endpoint to create the initial admin user.
 * Only works if no admin user exists in the database.
 * Protected by a SETUP_SECRET environment variable.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password, firstName, lastName, setupSecret } = body;

    // Verify setup secret
    const expectedSecret = process.env.SETUP_SECRET || process.env.JWT_SECRET;
    if (!setupSecret || setupSecret !== expectedSecret) {
      return Response.json(
        { error: 'Invalid setup secret' },
        { status: 403 }
      );
    }

    // Check if an admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      return Response.json(
        { error: 'An admin user already exists. This endpoint is for initial setup only.' },
        { status: 409 }
      );
    }

    // Validate required fields
    if (!email || !username || !password) {
      return Response.json(
        { error: 'email, username, and password are required' },
        { status: 400 }
      );
    }

    // Create admin user
    const hashedPassword = await hashPassword(password);
    const admin = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName: firstName || 'Admin',
        lastName: lastName || '',
        role: 'ADMIN',
        isActive: true,
        language: 'ES',
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return Response.json({
      success: true,
      message: 'Admin user created successfully. You can now log in.',
      admin,
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return Response.json(
      { error: error.message || 'Setup failed' },
      { status: 500 }
    );
  }
}

/**
 * GET - Check if setup is needed
 */
export async function GET() {
  try {
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' },
    });

    const userCount = await prisma.user.count();

    return Response.json({
      setupNeeded: adminCount === 0,
      adminExists: adminCount > 0,
      totalUsers: userCount,
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Failed to check setup status' },
      { status: 500 }
    );
  }
}
