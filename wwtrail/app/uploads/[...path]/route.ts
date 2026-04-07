import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const filePath = segments.join('/');

  // Security: prevent directory traversal
  if (filePath.includes('..') || filePath.includes('\0')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const absolutePath = path.join(process.cwd(), 'public', 'uploads', filePath);

  // Ensure the resolved path is still under public/uploads
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!absolutePath.startsWith(uploadsDir)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const buffer = await readFile(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=2592000, immutable',
      },
    });
  } catch {
    return new NextResponse('Not Found', { status: 404 });
  }
}
