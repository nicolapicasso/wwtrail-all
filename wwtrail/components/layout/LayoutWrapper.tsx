'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

// Routes that should NOT show Navbar and Footer (backoffice routes)
const BACKOFFICE_ROUTES = ['/organizer', '/dashboard', '/admin'];

// Routes that should show Navbar but NOT Footer (full-screen pages)
const NO_FOOTER_ROUTES = ['/directory'];

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

  // Check if current path should not show footer (full-screen pages like /directory)
  const isNoFooterRoute = NO_FOOTER_ROUTES.some(route => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.includes(route.replace('/', '')) ||
           segments.some(seg => route.replace('/', '') === seg);
  });

  if (isBackofficeRoute) {
    // Backoffice: no Navbar, no Footer
    return <>{children}</>;
  }

  if (isNoFooterRoute) {
    // Full-screen pages: Navbar but no Footer (e.g., /directory)
    return (
      <>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </>
    );
  }

  // Public pages: Navbar + content + Footer in normal document flow
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
