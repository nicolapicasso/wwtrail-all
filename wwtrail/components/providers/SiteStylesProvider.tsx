'use client';

import { useEffect, useState } from 'react';

interface SiteStyles {
  fontPrimary: string;
  fontSecondary: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorBackground: string;
  colorText: string;
  colorSuccess: string;
  colorDanger: string;
  borderRadius: string;
  shadowStyle: string;
  faviconUrl?: string | null;
}

const SHADOW_MAP: Record<string, string> = {
  none: 'none',
  subtle: '0 1px 3px rgba(0,0,0,0.12)',
  medium: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
  strong: '0 10px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)',
};

export function SiteStylesProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadStyles() {
      try {
        const res = await fetch('/api/v2/site-config');
        const json = await res.json();
        const styles: SiteStyles = json.data || json;

        if (!styles.colorPrimary) return;

        const root = document.documentElement;
        root.style.setProperty('--site-color-primary', styles.colorPrimary);
        root.style.setProperty('--site-color-secondary', styles.colorSecondary);
        root.style.setProperty('--site-color-accent', styles.colorAccent);
        root.style.setProperty('--site-color-bg', styles.colorBackground);
        root.style.setProperty('--site-color-text', styles.colorText);
        root.style.setProperty('--site-color-success', styles.colorSuccess);
        root.style.setProperty('--site-color-danger', styles.colorDanger);
        root.style.setProperty('--site-border-radius', `${styles.borderRadius}px`);
        root.style.setProperty('--site-shadow', SHADOW_MAP[styles.shadowStyle] || 'none');
        root.style.setProperty('--site-font-primary', styles.fontPrimary);
        root.style.setProperty('--site-font-secondary', styles.fontSecondary);

        // Apply favicon dynamically
        if (styles.faviconUrl) {
          const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement
            || document.createElement('link');
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          link.href = styles.faviconUrl;
          document.head.appendChild(link);
        }
      } catch {
        // Silently fail - will use defaults from CSS/Tailwind
      } finally {
        setLoaded(true);
      }
    }

    loadStyles();
  }, []);

  return <>{children}</>;
}
