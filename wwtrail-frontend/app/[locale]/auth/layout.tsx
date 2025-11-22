import { Toaster } from 'sonner';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      {/* ❌ NO incluir Navbar aquí - ya está en app/layout.tsx */}
      {/* ❌ NO incluir AuthProvider aquí - ya está en app/layout.tsx */}
      {children}
      {/* El Toaster ya está en app/layout.tsx, pero si quieres uno específico para auth puedes dejarlo */}
    </div>
  );
}
