// app/[locale]/users/page.tsx
'use client';

import { Users } from 'lucide-react';
import { UserList } from '@/components/UserList';

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-content px-6 py-10 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-3">
            <Users className="h-8 w-8 text-green-brand" />
            <h1 className="text-[34px] font-black tracking-[-0.02em] text-ink-2">Comunidad</h1>
          </div>
          <p className="text-[15px] text-text-muted">
            Descubre a otros corredores de trail y sus logros
          </p>
        </div>

        {/* User List */}
        <UserList showFilters={true} viewMode="grid" />
      </div>
    </div>
  );
}
