import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// Access and refresh tokens MUST NOT share a signing secret, otherwise a leaked
// access token could be replayed as a refresh token. Require a dedicated secret
// in production; only derive a distinct fallback for local development.
// Resolved lazily (on first use) so importing this module — e.g. during
// `next build` page-data collection — never throws.
function getRefreshSecret(): string {
  if (process.env.JWT_REFRESH_SECRET) return process.env.JWT_REFRESH_SECRET;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_REFRESH_SECRET must be set in production');
  }
  // Dev-only: derive a value that is guaranteed different from JWT_SECRET.
  return `${process.env.JWT_SECRET}-refresh`;
}

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
  // When present, the session is an ADMIN impersonating this user; holds the
  // real admin's id so impersonation can be ended and audited.
  impersonatedBy?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT tokens
export async function generateTokens(user: { id: string; email: string; role: UserRole }) {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, getRefreshSecret(), {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);

  // Store refresh token in DB
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
}

// Verify JWT access token
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

// Verify JWT refresh token
export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, getRefreshSecret()) as TokenPayload;
}

// Sign a standalone access token (used for impersonation). No refresh token is
// created — impersonation is access-only and ends when the token expires or the
// admin exits.
export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

// Read the raw (verified) access-token payload from a request, including the
// optional impersonatedBy claim. Returns null if missing/invalid.
export function readAccessTokenPayload(request: NextRequest): TokenPayload | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    return verifyToken(authHeader.substring(7));
  } catch {
    return null;
  }
}

// Extract authenticated user from request (for API routes)
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.substring(7);
  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, role: true, isActive: true },
    });
    if (!user || !user.isActive) return null;
    return { id: user.id, email: user.email, role: user.role };
  } catch {
    return null;
  }
}

// Require authenticated user (throws if not authenticated)
export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await getAuthUser(request);
  if (!user) {
    throw new ApiError('Unauthorized', 401);
  }
  return user;
}

// Require specific roles
export async function requireRole(request: NextRequest, ...roles: UserRole[]): Promise<AuthUser> {
  const user = await requireAuth(request);
  if (!roles.includes(user.role)) {
    throw new ApiError('Forbidden', 403);
  }
  return user;
}

// API Error class
export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

// Standard API response helpers
export function apiSuccess(data: any, status: number = 200) {
  return Response.json({ success: true, data }, { status });
}

export function apiError(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json(
      { success: false, error: error.message },
      { status: error.statusCode }
    );
  }
  console.error('Unhandled API error:', error);
  return Response.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}
