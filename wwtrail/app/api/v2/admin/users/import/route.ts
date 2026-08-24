import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';
import { UserImportService, AccountMode } from '@/lib/services/userImport.service';

const MODES: AccountMode[] = ['none', 'provisional', 'invite'];

// POST /api/v2/admin/users/import
// Bulk import users. Body: { rows: MappedRow[], accountMode, asInsider, marketingOptIn }
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const body = await request.json();
    const rows = Array.isArray(body.rows) ? body.rows : [];
    if (rows.length === 0) throw new ApiError('No rows to import', 400);
    const accountMode: AccountMode = MODES.includes(body.accountMode) ? body.accountMode : 'none';
    const asInsider = !!body.asInsider;
    const marketingOptIn = !!body.marketingOptIn;
    const result = await UserImportService.importUsers(rows, { accountMode, asInsider, marketingOptIn });
    return apiSuccess(result);
  } catch (e) { return apiError(e); }
}
