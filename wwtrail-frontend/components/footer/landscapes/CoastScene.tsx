'use client';

import { Stars } from './Stars';

interface CoastSceneProps {
  isNight: boolean;
}

export function CoastScene({ isNight }: CoastSceneProps) {
  if (isNight) {
    return (
      <div className="coast-night absolute inset-0 overflow-hidden">
        {/* Night sky gradient - deep blue ocean night */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              #0a1520 0%,
              #102030 25%,
              #183040 50%,
              #204050 75%,
              #285060 100%
            )`,
          }}
        />

        {/* Stars */}
        <Stars count={45} />

        {/* Moon */}
        <div className="moon absolute top-[30px] right-[20%] w-10 h-10 bg-amber-100 rounded-full shadow-[0_0_25px_rgba(254,243,199,0.4)]">
          <div className="absolute top-[3px] left-[-7px] w-9 h-9 bg-[#0a1520] rounded-full" />
        </div>

        {/* Ocean - dark */}
        <div
          className="absolute bottom-0 left-0 w-full h-[150px]"
          style={{
            background: `linear-gradient(to bottom,
              #1a3040 0%,
              #152535 50%,
              #101a25 100%
            )`,
          }}
        >
          {/* Moon reflection on water */}
          <div
            className="absolute bottom-[50px] right-[18%] w-[80px] h-[100px] opacity-30"
            style={{
              background: 'linear-gradient(to bottom, rgba(254,243,199,0.4) 0%, rgba(254,243,199,0.1) 50%, transparent 100%)',
              filter: 'blur(8px)',
            }}
          />
        </div>

        {/* Rocky coastline silhouette */}
        <div
          className="absolute bottom-0 left-0 w-full h-[90px] bg-[#0a1018]"
          style={{
            clipPath: 'polygon(0% 100%, 0% 35%, 8% 40%, 15% 25%, 22% 38%, 30% 20%, 38% 35%, 45% 28%, 52% 40%, 60% 22%, 68% 38%, 75% 30%, 82% 42%, 90% 25%, 100% 35%, 100% 100%)',
          }}
        />
      </div>
    );
  }

  return (
    <div className="coast-day absolute inset-0 overflow-hidden">
      {/* Photographic coastal sunset - soft pinks and blues */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            #4a6580 0%,
            #6a85a0 15%,
            #8aa0b5 28%,
            #b0b8c5 40%,
            #d0c0c0 50%,
            #e0c0b0 58%,
            #e8baa5 66%,
            #f0b595 74%,
            #f5b088 82%,
            #f8ab80 90%,
            #faa878 100%
          )`,
        }}
      />

      {/* Sun glow - subtle reflection area */}
      <div
        className="absolute bottom-[100px] left-[40%] w-[150px] h-[80px] opacity-50"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,220,180,0.8) 0%, rgba(255,200,150,0.3) 50%, transparent 80%)',
        }}
      />

      {/* Ocean - calm, reflecting sky colors */}
      <div
        className="absolute bottom-0 left-0 w-full h-[150px]"
        style={{
          background: `linear-gradient(to bottom,
            #6a8095 0%,
            #5a7085 30%,
            #4a6075 60%,
            #3a5065 100%
          )`,
        }}
      >
        {/* Subtle light reflection on water */}
        <div
          className="absolute top-[10px] left-[35%] w-[200px] h-[60px] opacity-25"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,220,200,0.6) 0%, rgba(255,200,180,0.2) 100%)',
            filter: 'blur(10px)',
          }}
        />
      </div>

      {/* Rocky coastline/cliffs silhouette - darker foreground */}
      <div
        className="absolute bottom-0 left-0 w-full h-[100px]"
        style={{
          background: 'linear-gradient(to bottom, #3a4550 0%, #2a3540 100%)',
          clipPath: 'polygon(0% 100%, 0% 32%, 6% 38%, 12% 22%, 18% 35%, 25% 18%, 32% 32%, 40% 25%, 48% 38%, 55% 20%, 62% 35%, 70% 28%, 78% 40%, 85% 25%, 92% 38%, 100% 30%, 100% 100%)',
        }}
      />
    </div>
  );
}
