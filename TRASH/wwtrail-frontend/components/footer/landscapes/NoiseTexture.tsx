'use client';

interface NoiseTextureProps {
  opacity?: number;
}

export function NoiseTexture({ opacity = 0.15 }: NoiseTextureProps) {
  return (
    <>
      {/* SVG noise filter definition */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="noise-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>

      {/* Noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          filter: 'url(#noise-filter)',
          opacity,
          mixBlendMode: 'overlay',
        }}
      />
    </>
  );
}
