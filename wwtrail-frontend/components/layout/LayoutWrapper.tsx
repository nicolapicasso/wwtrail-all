'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

// Routes that should NOT show Navbar and Footer (backoffice routes)
const BACKOFFICE_ROUTES = ['/organizer', '/dashboard', '/admin'];

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

  // Public pages: show Navbar and Footer
  // The page-content div has bg-white and z-10 to slide over the sticky footer
  return (
    <>
      <Navbar />
      <div className="page-content relative z-10 bg-white min-h-screen">
        <main className="flex-1">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
