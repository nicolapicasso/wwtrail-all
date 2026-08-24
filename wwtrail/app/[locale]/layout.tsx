import type { Metadata } from "next";
import { Archivo, Barlow_Semi_Condensed } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { InsiderProvider } from "@/contexts/InsiderContext";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { Toaster } from 'sonner';
import { IntlProvider } from "@/components/providers/IntlProvider";
import { SiteStylesProvider } from "@/components/providers/SiteStylesProvider";
import { CookieConsent } from '@/components/cookies/CookieConsent';
import { AnalyticsScripts } from '@/components/analytics/AnalyticsScripts';
import { SiteConfigService } from '@/lib/services/siteConfig.service';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';

// UI / headings font
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

// Sport-figure numerals font (used only for large stats)
const barlow = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

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

  // Public analytics IDs (consent-gated in the browser). Never blocks render.
  let analytics = { gtmContainerId: null as string | null, gaMeasurementId: null as string | null, brevoTrackerId: null as string | null };
  try {
    analytics = await SiteConfigService.getAnalyticsConfig();
  } catch { /* config table not ready — skip analytics */ }

  return (
    <html lang={locale} className={`${archivo.variable} ${barlow.variable}`}>
      <body className="font-sans">
        <AnalyticsScripts
          gtmContainerId={analytics.gtmContainerId}
          gaMeasurementId={analytics.gaMeasurementId}
          brevoTrackerId={analytics.brevoTrackerId}
        />
        <IntlProvider locale={locale} messages={messages}>
          <SiteStylesProvider>
          <AuthProvider>
            <InsiderProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
              <CookieConsent />
              <Toaster position="top-right" />
            </InsiderProvider>
          </AuthProvider>
          </SiteStylesProvider>
        </IntlProvider>
      </body>
    </html>
  );
}
