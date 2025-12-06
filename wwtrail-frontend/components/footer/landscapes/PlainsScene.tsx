'use client';

import { Stars } from './Stars';
import { Fireflies } from './Fireflies';
import { NoiseTexture } from './NoiseTexture';

interface PlainsSceneProps {
  isNight: boolean;
}

export function PlainsScene({ isNight }: PlainsSceneProps) {
  if (isNight) {
    return (
      <div className="plains-night absolute inset-0 overflow-hidden">
        {/* Night sky gradient - deep blue prairie night */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              #0a1018 0%,
              #101820 25%,
              #182028 50%,
              #202830 75%,
              #283038 100%
            )`,
          }}
        />

        {/* Stars */}
        <Stars count={60} />

        {/* Moon - centered */}
        <div className="moon absolute top-[40px] left-1/2 -translate-x-1/2 w-10 h-10 bg-amber-100 rounded-full shadow-[0_0_25px_rgba(254,243,199,0.4)]">
          <div className="absolute top-[3px] left-[-7px] w-9 h-9 bg-[#0a1018] rounded-full" />
        </div>

        {/* Rolling hills silhouettes */}
        <div
          className="absolute bottom-0 left-0 w-full h-[140px] bg-[#181e25]"
          style={{ clipPath: 'polygon(0% 100%, 0% 65%, 15% 52%, 35% 62%, 55% 48%, 75% 58%, 100% 50%, 100% 100%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[105px] bg-[#10151a]"
          style={{ clipPath: 'polygon(0% 100%, 0% 55%, 25% 45%, 50% 55%, 75% 42%, 100% 50%, 100% 100%)' }}
        />

        {/* Dark foreground */}
        <div
          className="absolute bottom-0 left-0 w-full h-[70px] bg-[#080c10]"
          style={{ clipPath: 'polygon(0% 100%, 0% 42%, 100% 48%, 100% 100%)' }}
        />

        {/* Fireflies */}
        <Fireflies count={12} />

        <NoiseTexture opacity={0.08} />
      </div>
    );
  }

  return (
    <div className="plains-day absolute inset-0 overflow-hidden">
      {/* Watercolor prairie sky - soft golden/lavender tones */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            #b8c5d2 0%,
            #c8d2dc 12%,
            #d8dce2 25%,
            #e2ddd8 40%,
            #e5d8cc 52%,
            #e8d2c0 64%,
            #e5c8b2 76%,
            #e0bca5 88%,
            #d8b098 100%
          )`,
        }}
      />

      {/* Sun glow - setting, centered */}
      <div
        className="absolute bottom-[100px] left-1/2 -translate-x-1/2 w-[140px] h-[70px] opacity-50"
        style={{
          background: 'radial-gradient(ellipse at center bottom, rgba(250,225,180,0.9) 0%, rgba(240,200,150,0.4) 50%, transparent 80%)',
          filter: 'blur(10px)',
        }}
      />

      {/* Atmospheric haze */}
      <div
        className="absolute bottom-[70px] left-0 w-full h-[90px] opacity-35"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(210,195,180,0.5) 100%)',
        }}
      />

      {/* Rolling hills - watercolor layers */}
      {/* Far hills - hazy */}
      <div
        className="absolute bottom-0 left-0 w-full h-[150px]"
        style={{
          background: 'linear-gradient(to bottom, #b8b0a5 0%, #a8a095 50%, #989085 100%)',
          clipPath: 'polygon(0% 100%, 0% 60%, 12% 50%, 30% 58%, 50% 45%, 70% 55%, 88% 48%, 100% 52%, 100% 100%)',
        }}
      />

      {/* Mid hills */}
      <div
        className="absolute bottom-0 left-0 w-full h-[115px]"
        style={{
          background: 'linear-gradient(to bottom, #8a8578 0%, #7a7568 50%, #6a6558 100%)',
          clipPath: 'polygon(0% 100%, 0% 52%, 18% 42%, 40% 55%, 62% 40%, 82% 52%, 100% 45%, 100% 100%)',
        }}
      />

      {/* Prairie foreground - warm earth tones */}
      <div
        className="absolute bottom-0 left-0 w-full h-[80px]"
        style={{
          background: 'linear-gradient(to bottom, #6a5d50 0%, #5a4d40 50%, #4a3d30 100%)',
          clipPath: 'polygon(0% 100%, 0% 40%, 100% 45%, 100% 100%)',
        }}
      />

      {/* Subtle grass texture */}
      <div
        className="absolute bottom-0 left-0 w-full h-[45px] opacity-25"
        style={{
          background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 4px, #3a2d20 4px, #3a2d20 5px)',
          clipPath: 'polygon(0% 100%, 0% 0%, 2% 45%, 4% 0%, 6% 40%, 8% 0%, 10% 48%, 12% 0%, 14% 42%, 16% 0%, 18% 50%, 20% 0%, 22% 45%, 24% 0%, 26% 40%, 28% 0%, 30% 48%, 32% 0%, 34% 42%, 36% 0%, 38% 50%, 40% 0%, 42% 45%, 44% 0%, 46% 40%, 48% 0%, 50% 48%, 52% 0%, 54% 42%, 56% 0%, 58% 50%, 60% 0%, 62% 45%, 64% 0%, 66% 40%, 68% 0%, 70% 48%, 72% 0%, 74% 42%, 76% 0%, 78% 50%, 80% 0%, 82% 45%, 84% 0%, 86% 40%, 88% 0%, 90% 48%, 92% 0%, 94% 42%, 96% 0%, 98% 50%, 100% 0%, 100% 100%)',
        }}
      />

      {/* Noise texture overlay */}
      <NoiseTexture opacity={0.12} />
    </div>
  );
}
