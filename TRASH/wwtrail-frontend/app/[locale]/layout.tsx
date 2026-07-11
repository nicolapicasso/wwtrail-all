import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { InsiderProvider } from "@/contexts/InsiderContext";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
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
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
              <Toaster position="top-right" />
            </InsiderProvider>
          </AuthProvider>
        </IntlProvider>
      </body>
    </html>
  );
}
