'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { CollapsibleUserInfo } from '@/components/layout/CollapsibleUserInfo';
import { Trophy, LogOut, Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated, isOrganizer, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Verificar autenticación
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard');
    } else if (!isOrganizer && !isAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isOrganizer, isAdmin, router]);

  if (!isAuthenticated || (!isOrganizer && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-primary-600"></div>
          <p className="mt-2 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
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
                  {isAdmin ? 'Admin' : 'Organizador'}
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
            username={user?.username}
            email={user?.email}
            isAdmin={isAdmin}
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
                      {isAdmin ? 'Admin' : 'Organizador'}
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

              {/* Navigation */}
              <nav className="flex-1 p-4 overflow-y-auto">
                <DashboardNav />
              </nav>

              {/* User Info + Logout */}
              <CollapsibleUserInfo
                username={user?.username}
                email={user?.email}
                isAdmin={isAdmin}
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
