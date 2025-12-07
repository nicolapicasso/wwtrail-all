import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { InsiderProvider } from "@/contexts/InsiderContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from 'sonner';
import { IntlProvider } from "@/components/providers/IntlProvider";
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WWTRAIL - Trail Running Competitions",
  description: "Discover and participate in trail running competitions worldwide",
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Load messages for the locale
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <IntlProvider locale={locale} messages={messages}>
          <AuthProvider>
            <InsiderProvider>
              <Navbar />
              <div className="flex flex-col min-h-screen bg-white -mb-[360px] relative z-10">
                <main className="flex-1">
                  {children}
                </main>
              </div>
              <Footer />
              <Toaster position="top-right" />
            </InsiderProvider>
          </AuthProvider>
        </IntlProvider>
      </body>
    </html>
  );
}
