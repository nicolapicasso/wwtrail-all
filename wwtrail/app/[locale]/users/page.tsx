// app/[locale]/users/page.tsx
'use client';

import { Users } from 'lucide-react';
import { UserList } from '@/components/UserList';

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Comunidad</h1>
          </div>
          <p className="text-gray-600">
            Descubre a otros corredores de trail y sus logros
          </p>
        </div>

        {/* User List */}
        <UserList showFilters={true} viewMode="grid" />
      </div>
    </div>
  );
}
