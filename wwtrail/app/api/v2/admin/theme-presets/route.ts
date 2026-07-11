import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { ThemePresetService } from '@/lib/services/themePreset.service';

// GET /api/v2/admin/theme-presets - List presets (built-in + saved)
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const presets = await ThemePresetService.list();
    return apiSuccess(presets);
  } catch (error) {
    return apiError(error);
  }
}

// POST /api/v2/admin/theme-presets - Save the given theme values as a named preset
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const body = await request.json();
    const { name, ...values } = body;
    const preset = await ThemePresetService.create(name, values);
    return apiSuccess(preset);
  } catch (error) {
    return apiError(error);
  }
}
