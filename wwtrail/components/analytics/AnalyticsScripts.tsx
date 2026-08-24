'use client';

import { useEffect } from 'react';
import Script from 'next/script';

/**
 * Consent-gated analytics loader.
 *
 * Strategy: Google Tag Manager is the single entry point. It is loaded with
 * Google Consent Mode v2 in "default: denied" state, so GTM itself sets no
 * tracking cookies and every downstream tag (GA4, Ads, etc.) stays blocked
 * until the visitor grants consent in the cookie banner. When the banner
 * dispatches `cookie-consent-changed`, we push a `consent update` so GTM
 * unblocks the matching tags. Everything is driven off a full dataLayer.
 *
 * Brevo is 1st-party but still a tracker, so it is injected only once the
 * visitor has granted analytics (or marketing) consent.
 *
 * The IDs are public by nature (they ship in the page); nothing here is secret.
 */

interface Props {
  gtmContainerId?: string | null;
  gaMeasurementId?: string | null;
  brevoTrackerId?: string | null;
}

const CONSENT_COOKIE = 'cookie_consent';

type Consent = {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};

// Map our banner categories onto Google Consent Mode v2 signals.
function toConsentState(c: Consent): Record<string, 'granted' | 'denied'> {
  const g = (v: boolean) => (v ? 'granted' : 'denied');
  return {
    ad_storage: g(c.marketing),
    ad_user_data: g(c.marketing),
    ad_personalization: g(c.marketing),
    analytics_storage: g(c.analytics),
    functionality_storage: g(c.preferences),
    personalization_storage: g(c.preferences),
    security_storage: 'granted',
  };
}

// Inline script that MUST run before GTM: defines dataLayer + gtag and sets the
// Consent Mode defaults from any previously stored choice (returning visitors),
// otherwise denies everything (new visitors).
function consentInitScript(): string {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    (function(){
      var consent = { ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied', analytics_storage:'denied', functionality_storage:'denied', personalization_storage:'denied', security_storage:'granted' };
      try {
        var m = document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]*)/);
        if (m) {
          var c = JSON.parse(decodeURIComponent(m[1]));
          var g = function(v){ return v ? 'granted' : 'denied'; };
          consent.ad_storage = g(c.marketing);
          consent.ad_user_data = g(c.marketing);
          consent.ad_personalization = g(c.marketing);
          consent.analytics_storage = g(c.analytics);
          consent.functionality_storage = g(c.preferences);
          consent.personalization_storage = g(c.preferences);
        }
      } catch (e) {}
      gtag('consent', 'default', Object.assign({ wait_for_update: 500 }, consent));
      gtag('set', 'ads_data_redaction', true);
    })();
  `;
}

let brevoLoaded = false;

function loadBrevo(brevoTrackerId: string) {
  if (brevoLoaded || typeof window === 'undefined') return;
  brevoLoaded = true;
  const w = window as any;
  w.Brevo = w.Brevo || [];
  w.Brevo.push(['init', { client_key: brevoTrackerId }]);
  const s = document.createElement('script');
  s.src = 'https://cdn.brevo.com/js/sdk-loader.js';
  s.async = true;
  document.head.appendChild(s);
}

export function AnalyticsScripts({ gtmContainerId, gaMeasurementId, brevoTrackerId }: Props) {
  useEffect(() => {
    const apply = (c: Consent) => {
      const w = window as any;
      if (typeof w.gtag === 'function') {
        w.gtag('consent', 'update', toConsentState(c));
      }
      // dataLayer event so custom GTM triggers can react to consent grants.
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ event: 'cookie_consent_update', consent: c });

      if (brevoTrackerId && (c.analytics || c.marketing)) {
        loadBrevo(brevoTrackerId);
      }
    };

    // Apply any already-stored consent on mount (returning visitor).
    try {
      const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
      if (m) apply(JSON.parse(decodeURIComponent(m[1])));
    } catch { /* ignore */ }

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as Consent | undefined;
      if (detail) apply(detail);
    };
    window.addEventListener('cookie-consent-changed', onChange);
    return () => window.removeEventListener('cookie-consent-changed', onChange);
  }, [brevoTrackerId]);

  // Nothing configured → render nothing (no tracking at all).
  if (!gtmContainerId && !gaMeasurementId) return null;

  return (
    <>
      {/* 1) Consent Mode defaults — must run before any tag manager / gtag. */}
      <Script id="consent-mode-init" strategy="beforeInteractive">
        {consentInitScript()}
      </Script>

      {/* 2a) GTM as the single tag entry point (preferred). */}
      {gtmContainerId && (
        <Script id="gtm-loader" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmContainerId}');`}
        </Script>
      )}

      {/* 2b) Direct GA4 only when there is no GTM container to route through. */}
      {!gtmContainerId && gaMeasurementId && (
        <>
          <Script
            id="ga4-lib"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`gtag('js', new Date()); gtag('config', '${gaMeasurementId}');`}
          </Script>
        </>
      )}
    </>
  );
}

export default AnalyticsScripts;
