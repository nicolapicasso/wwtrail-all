// lib/impersonation.ts — client helpers for admin "view as user X".
'use client';

import Cookies from 'js-cookie';
import { apiClientV2 } from '@/lib/api/client';

const IMP_COOKIE = 'imp'; // display name of the impersonated user (drives the banner)

export function getImpersonatedName(): string | null {
  return Cookies.get(IMP_COOKIE) || null;
}

// Start impersonating: swap the access token to one acting as the target user
// and reload into the dashboard.
export async function startImpersonation(userId: string): Promise<void> {
  const res = await apiClientV2.post('/admin/impersonate', { userId });
  const data = res.data?.data || res.data;
  Cookies.set('accessToken', data.accessToken, { expires: 7 });
  Cookies.set(IMP_COOKIE, data.user?.name || data.user?.username || 'usuario', { expires: 7 });
  window.location.href = '/dashboard';
}

// Stop impersonating: restore the original admin token and reload.
export async function stopImpersonation(): Promise<void> {
  try {
    const res = await apiClientV2.post('/admin/impersonate/stop');
    const data = res.data?.data || res.data;
    if (data?.accessToken) {
      Cookies.set('accessToken', data.accessToken, { expires: 7 });
    }
  } finally {
    Cookies.remove(IMP_COOKIE);
    window.location.href = '/dashboard';
  }
}
