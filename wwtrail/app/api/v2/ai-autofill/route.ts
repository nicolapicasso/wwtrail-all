import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { autoFillEvent, autoFillCompetition, autoFillEdition } from '@/lib/services/ai-autofill.service';

// POST /api/v2/ai-autofill
// Body: { url, type: 'event' | 'competition' | 'edition', year?, context? }
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ORGANIZER', 'ADMIN');

    const { url, type, year, context } = await request.json();

    if (!url || typeof url !== 'string') {
      return apiSuccess({ error: 'URL es obligatoria' }, 400);
    }

    // Validar que sea una URL válida
    try {
      new URL(url);
    } catch {
      return apiSuccess({ error: 'URL no válida' }, 400);
    }

    if (type === 'competition') {
      const result = await autoFillCompetition(url);
      return apiSuccess(result);
    } else if (type === 'edition') {
      const y = parseInt(year, 10);
      if (!y || y < 1900 || y > 2100) {
        return apiSuccess({ error: 'Año no válido' }, 400);
      }
      const result = await autoFillEdition(url, { year: y, ...(context || {}) });
      return apiSuccess(result);
    } else {
      const result = await autoFillEvent(url);
      return apiSuccess(result);
    }
  } catch (error) {
    return apiError(error);
  }
}
