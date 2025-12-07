'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { footerService, FooterContent } from '@/lib/api/footer.service';
import { LandscapeBackground } from '@/components/footer/landscapes';

// Routes where footer should NOT be shown
const FOOTER_EXCLUDED_ROUTES = ['/organizer', '/dashboard', '/directory'];

export default function Footer() {
  const locale = useLocale();
  const pathname = usePathname();
  const [content, setContent] = useState<FooterContent>({
    leftColumn: null,
    centerColumn: null,
    rightColumn: null,
  });
  const [loading, setLoading] = useState(true);

  // Check if current route should hide the footer
  const shouldHideFooter = FOOTER_EXCLUDED_ROUTES.some(route => pathname?.includes(route));

  useEffect(() => {
    // Skip loading footer data if we're on excluded routes
    if (shouldHideFooter) {
      setLoading(false);
      return;
    }

    const loadFooter = async () => {
      try {
        const data = await footerService.getPublicFooter(locale.toUpperCase());
        setContent(data);
      } catch (error) {
        console.error('Error loading footer:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFooter();
  }, [locale, shouldHideFooter]);

  // Don't render on excluded routes
  if (shouldHideFooter) {
    return null;
  }

  // Don't render anything while loading
  if (loading) {
    return null;
  }

  // Check if there's column content to display
  const hasContent = content.leftColumn || content.centerColumn || content.rightColumn;

  return (
    <div className="footer-wrapper relative h-[360px]">
      <footer className="absolute inset-0 overflow-hidden">
        {/* Landscape Background Layer */}
        <LandscapeBackground />

        {/* Semi-transparent overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />

        {/* Content Layer - only render if there's content */}
        {hasContent && (
          <div className="absolute inset-x-0 bottom-0 z-20">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Left Column (1/4) */}
                {content.leftColumn && (
                  <div
                    className="footer-column"
                    dangerouslySetInnerHTML={{ __html: content.leftColumn }}
                  />
                )}

                {/* Center Column (2/4) */}
                {content.centerColumn && (
                  <div
                    className="footer-column md:col-span-2"
                    dangerouslySetInnerHTML={{ __html: content.centerColumn }}
                  />
                )}

                {/* Right Column (1/4) */}
                {content.rightColumn && (
                  <div
                    className="footer-column"
                    dangerouslySetInnerHTML={{ __html: content.rightColumn }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </footer>

      <style jsx>{`
        :global(.footer-column) {
          color: white;
        }
        :global(.footer-column h1),
        :global(.footer-column h2),
        :global(.footer-column h3),
        :global(.footer-column h4),
        :global(.footer-column h5),
        :global(.footer-column h6) {
          color: white;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        :global(.footer-column p) {
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 0.5rem;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        :global(.footer-column a) {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          transition: color 0.2s;
        }
        :global(.footer-column a:hover) {
          color: white;
          text-decoration: underline;
        }
        :global(.footer-column ul) {
          list-style: none;
          padding: 0;
        }
        :global(.footer-column li) {
          margin-bottom: 0.5rem;
        }
        :global(.footer-column img) {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
}
