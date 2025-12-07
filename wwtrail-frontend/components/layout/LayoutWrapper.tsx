'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

// Routes that should NOT show Navbar and Footer (backoffice routes)
const BACKOFFICE_ROUTES = ['/organizer', '/dashboard', '/admin'];

// Footer height for reveal effect
const FOOTER_HEIGHT = 360;

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Check if current path is a backoffice route
  // pathname includes locale, e.g., /es/organizer/events
  const isBackofficeRoute = BACKOFFICE_ROUTES.some(route => {
    // Check if pathname contains the route after the locale prefix
    // e.g., /es/organizer, /en/dashboard, /organizer, /dashboard
    const segments = pathname.split('/').filter(Boolean);
    // First segment might be locale (es, en, etc.) or direct route
    return segments.includes(route.replace('/', '')) ||
           segments.some(seg => route.replace('/', '') === seg);
  });

  if (isBackofficeRoute) {
    // Backoffice: no Navbar, no Footer
    return <>{children}</>;
  }

  // Public pages: show Navbar and Footer with reveal effect
  // The content slides over the fixed footer when scrolling
  return (
    <>
      <Navbar />
      {/* Main content wrapper - sits above footer with negative margin for reveal */}
      <div
        className="page-content relative z-10"
        style={{ marginBottom: `-${FOOTER_HEIGHT}px` }}
      >
        {/* Content with white background - ends before spacer */}
        <div className="bg-white min-h-screen">
          <main className="flex-1">
            {children}
          </main>
        </div>
        {/* Transparent spacer - allows fixed footer behind to be revealed */}
        <div style={{ height: `${FOOTER_HEIGHT}px` }} />
      </div>
      {/* Footer - fixed behind content */}
      <Footer />
    </>
  );
}
