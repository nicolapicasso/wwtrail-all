import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { ThemePresetService } from '@/lib/services/themePreset.service';

// DELETE /api/v2/admin/theme-presets/[id] - Delete a saved preset
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(request, 'ADMIN');
    await ThemePresetService.delete(params.id);
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
