'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { footerService, FooterContent } from '@/lib/api/footer.service';

export default function Footer() {
  const locale = useLocale();
  const [content, setContent] = useState<FooterContent>({
    leftColumn: null,
    centerColumn: null,
    rightColumn: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [locale]);

  // Don't render anything while loading
  if (loading) {
    return null;
  }

  // Don't render if all columns are empty
  const hasContent = content.leftColumn || content.centerColumn || content.rightColumn;
  if (!hasContent) {
    return null;
  }

  return (
    <footer className="bg-black text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
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
        }
        :global(.footer-column p) {
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 0.5rem;
        }
        :global(.footer-column a) {
          color: rgba(255, 255, 255, 0.8);
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
    </footer>
  );
}
