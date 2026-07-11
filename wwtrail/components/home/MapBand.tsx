// components/home/MapBand.tsx
// Fixed "explore the map" band for the redesigned home.

import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

// A few decorative pin positions (percentages).
const PINS = [
  { top: '28%', left: '22%' },
  { top: '54%', left: '38%', bright: true },
  { top: '40%', left: '62%' },
  { top: '66%', left: '78%' },
  { top: '22%', left: '80%', bright: true },
];

export function MapBand() {
  return (
    <section className="w-full px-6 py-12 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-content">
        <div
          className="relative flex min-h-[320px] items-center overflow-hidden rounded-xl px-8 py-10 sm:px-12"
          style={{ background: 'radial-gradient(circle at 45% 40%, #16505a, #0c222b)' }}
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(rgba(79,209,144,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(79,209,144,.12) 1px, transparent 1px)',
              backgroundSize: '46px 46px',
            }}
            aria-hidden
          />

          {/* Decorative pins */}
          {PINS.map((p, i) => (
            <span
              key={i}
              className="absolute h-3 w-3 rounded-pill ring-4"
              style={{
                top: p.top,
                left: p.left,
                backgroundColor: p.bright ? '#f0a05a' : '#2ea36a',
                boxShadow: '0 2px 8px rgba(0,0,0,.4)',
                // ring color via boxShadow-like halo
                // @ts-ignore -- inline ringColor
                ['--tw-ring-color' as any]: 'rgba(46,163,106,.25)',
              }}
              aria-hidden
            />
          ))}

          {/* Text + CTA */}
          <div className="relative z-10 max-w-lg">
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/10 px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-white/80">
              <MapPin className="h-3.5 w-3.5" /> Mapa mundial
            </span>
            <h2 className="mt-4 text-[28px] font-black leading-tight tracking-[-0.02em] text-white sm:text-[32px]">
              Explora las carreras en el mapa
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">
              Filtra por país, distancia, desnivel y tipo de terreno, y encuentra tu
              próxima montaña geográficamente.
            </p>
            <Link
              href="/directory"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-surface px-6 py-3 text-[15px] font-bold text-ink-2 transition-opacity hover:opacity-90"
            >
              Abrir mapa <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MapBand;
