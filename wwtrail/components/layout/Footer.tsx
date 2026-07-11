'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Instagram, Facebook, Youtube } from 'lucide-react';

// Routes where the footer should NOT be shown (segment match)
const FOOTER_EXCLUDED_ROUTES = ['organizer', 'dashboard', 'directory', 'admin'];

const LOGO_SRC =
  'https://wwtrail-uploads.fra1.digitaloceanspaces.com/uploads/others/logo_cabecera.webp';

type FooterLink = { label: string; href: string };

const EXPLORE: FooterLink[] = [
  { label: 'Eventos', href: '/events' },
  { label: 'Competiciones', href: '/competitions' },
  { label: 'Special Series', href: '/special-series' },
  { label: 'Servicios', href: '/services' },
  { label: 'Mapa', href: '/directory' },
];

const COMMUNITY: FooterLink[] = [
  { label: 'Organizadores', href: '/organizers' },
  { label: 'Directorio de usuarios', href: '/users' },
  { label: 'Insiders', href: '/users/insiders' },
  { label: 'Ventajas', href: '/promotions' },
  { label: 'Revista', href: '/magazine' },
];

const SOCIAL = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: Instagram },
  { label: 'Facebook', href: 'https://facebook.com', Icon: Facebook },
  { label: 'YouTube', href: 'https://youtube.com', Icon: Youtube },
];

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-[14px] text-white/75 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const segments = pathname?.split('/').filter(Boolean) || [];
  const shouldHide = FOOTER_EXCLUDED_ROUTES.some((r) => segments.includes(r));
  if (shouldHide) return null;

  const year = 2026; // build-time constant (Date.now() is unavailable at build)

  return (
    <footer className="w-full bg-ink text-white">
      <div className="mx-auto max-w-content px-6 py-14 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand block */}
          <div>
            <Link href="/" className="inline-flex items-center">
              <span className="relative block h-9 w-40">
                <Image src={LOGO_SRC} alt="WWTRAIL" fill className="object-contain object-left" />
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/60">
              Toda carrera de montaña del mundo, en un solo lugar. Descubre eventos,
              competiciones y circuitos de trail running.
            </p>
          </div>

          {/* Link columns */}
          <FooterColumn title="Explorar" links={EXPLORE} />
          <FooterColumn title="Comunidad" links={COMMUNITY} />

          {/* Social */}
          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">
              Síguenos
            </h4>
            <div className="flex gap-3">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-pill border border-white/15 text-white/75 transition-colors hover:border-green-bright hover:text-green-bright"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-2 px-6 py-5 text-[13px] text-white/50 sm:flex-row sm:px-8 lg:px-10">
          <span>© {year} WWTRAIL. Todos los derechos reservados.</span>
          <div className="flex gap-5">
            <Link href="/legal/privacy" className="hover:text-white/80">
              Privacidad
            </Link>
            <Link href="/legal/terms" className="hover:text-white/80">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
