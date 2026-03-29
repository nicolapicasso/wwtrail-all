'use client';

import { useEffect, useState } from 'react';
import { Link, useRouter, usePathname } from '@/i18n/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Menu, X } from 'lucide-react';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { CollapsibleUserInfo } from '@/components/layout/CollapsibleUserInfo';

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protección de ruta
  useEffect(() => {
    if (!loading && (!user || (user.role !== 'ORGANIZER' && user.role !== 'ADMIN'))) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // No autorizado
  if (!user || (user.role !== 'ORGANIZER' && user.role !== 'ADMIN')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Desktop - Fixed position */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col border-r border-gray-200 bg-white z-30">
        <div className="flex h-full flex-col">
          {/* Logo - Fixed at top */}
          <div className="flex-shrink-0 border-b border-gray-200 p-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">WWTRAIL</h1>
                <p className="text-xs text-gray-500">
                  {user.role === 'ADMIN' ? 'Admin' : 'Organizador'}
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation - Scrollable middle section */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <DashboardNav />
          </nav>

          {/* User Info + Logout - Fixed at bottom */}
          <CollapsibleUserInfo
            username={user.username}
            email={user.email}
            isAdmin={user.role === 'ADMIN'}
            onLogout={logout}
          />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-gray-900/50"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">WWTRAIL</h1>
                    <p className="text-xs text-gray-500">
                      {user.role === 'ADMIN' ? 'Admin' : 'Organizador'}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-2 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation - Using unified DashboardNav */}
              <nav className="flex-1 p-4 overflow-y-auto">
                <DashboardNav />
              </nav>

              {/* User Info + Logout */}
              <CollapsibleUserInfo
                username={user.username}
                email={user.email}
                isAdmin={user.role === 'ADMIN'}
                onLogout={logout}
              />
            </div>
          </aside>
        </div>
      )}

      {/* Main Content - With left margin for fixed sidebar */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4 md:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-black" />
              <span className="font-bold text-gray-900">WWTRAIL</span>
            </div>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
