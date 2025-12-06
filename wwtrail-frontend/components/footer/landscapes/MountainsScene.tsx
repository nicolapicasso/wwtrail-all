'use client';

import { Stars } from './Stars';

interface MountainsSceneProps {
  isNight: boolean;
}

export function MountainsScene({ isNight }: MountainsSceneProps) {
  if (isNight) {
    return (
      <div className="mountains-night absolute inset-0 overflow-hidden">
        {/* Night sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700" />

        {/* Stars */}
        <Stars count={55} />

        {/* Moon */}
        <div className="moon absolute top-[30px] right-[14%] w-10 h-10 bg-amber-100 rounded-full shadow-[0_0_25px_rgba(254,243,199,0.4)]">
          <div className="absolute top-[3px] left-[-7px] w-9 h-9 bg-slate-900 rounded-full" />
        </div>

        {/* Mountains - silhouettes with atmospheric perspective */}
        <div
          className="absolute bottom-0 left-0 w-full h-[180px] bg-slate-700/60"
          style={{ clipPath: 'polygon(0% 100%, 0% 55%, 8% 42%, 16% 52%, 26% 28%, 36% 48%, 46% 22%, 56% 42%, 66% 18%, 76% 38%, 86% 12%, 100% 32%, 100% 100%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[145px] bg-slate-800/80"
          style={{ clipPath: 'polygon(0% 100%, 0% 58%, 12% 42%, 24% 55%, 36% 32%, 50% 48%, 62% 28%, 76% 44%, 88% 24%, 100% 38%, 100% 100%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[110px] bg-slate-900"
          style={{ clipPath: 'polygon(0% 100%, 0% 52%, 14% 38%, 30% 50%, 44% 32%, 54% 46%, 70% 28%, 84% 42%, 100% 30%, 100% 100%)' }}
        />
      </div>
    );
  }

  return (
    <div className="mountains-day absolute inset-0 overflow-hidden">
      {/* Photographic golden hour sky - complex gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            #5b7a99 0%,
            #7d9cb5 15%,
            #b8a89a 30%,
            #d4b896 45%,
            #e8c9a0 55%,
            #f0d4a8 65%,
            #f5ddb5 75%,
            #fae5c3 85%,
            #fff0d4 100%
          )`,
        }}
      />

      {/* Sun glow - soft and diffused near horizon */}
      <div
        className="absolute bottom-[100px] right-[20%] w-[120px] h-[120px] rounded-full opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(255,235,200,0.8) 0%, rgba(255,220,180,0.4) 40%, transparent 70%)',
        }}
      />

      {/* Atmospheric haze layer */}
      <div
        className="absolute bottom-[80px] left-0 w-full h-[100px] opacity-40"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(200,180,160,0.5) 100%)',
        }}
      />

      {/* Mountains - dark silhouettes with atmospheric perspective */}
      {/* Far mountains - lighter, hazier */}
      <div
        className="absolute bottom-0 left-0 w-full h-[200px]"
        style={{
          background: 'linear-gradient(to bottom, #8a9aaa 0%, #7a8a9a 100%)',
          clipPath: 'polygon(0% 100%, 0% 50%, 5% 40%, 12% 48%, 20% 32%, 28% 45%, 38% 25%, 48% 42%, 58% 20%, 68% 38%, 78% 15%, 88% 35%, 95% 22%, 100% 30%, 100% 100%)',
        }}
      />

      {/* Mid mountains - medium tone */}
      <div
        className="absolute bottom-0 left-0 w-full h-[160px]"
        style={{
          background: 'linear-gradient(to bottom, #5a6a7a 0%, #4a5a6a 100%)',
          clipPath: 'polygon(0% 100%, 0% 55%, 10% 42%, 22% 52%, 35% 35%, 48% 48%, 60% 30%, 72% 45%, 85% 28%, 100% 40%, 100% 100%)',
        }}
      />

      {/* Near mountains - darkest silhouette */}
      <div
        className="absolute bottom-0 left-0 w-full h-[120px]"
        style={{
          background: 'linear-gradient(to bottom, #3a4550 0%, #2a3540 100%)',
          clipPath: 'polygon(0% 100%, 0% 48%, 12% 35%, 28% 48%, 42% 30%, 55% 45%, 68% 28%, 82% 42%, 100% 32%, 100% 100%)',
        }}
      />

      {/* Treeline silhouette - darkest foreground */}
      <div
        className="absolute bottom-0 left-0 w-full h-[70px] bg-[#1a2530]"
        style={{
          clipPath: 'polygon(0% 100%, 0% 55%, 2% 35%, 4% 55%, 6% 28%, 8% 52%, 10% 38%, 12% 58%, 14% 32%, 16% 52%, 18% 25%, 20% 48%, 22% 38%, 24% 55%, 26% 30%, 28% 52%, 30% 35%, 32% 55%, 34% 40%, 36% 52%, 38% 28%, 40% 48%, 42% 35%, 44% 55%, 46% 30%, 48% 52%, 50% 38%, 52% 55%, 54% 32%, 56% 52%, 58% 25%, 60% 48%, 62% 38%, 64% 55%, 66% 30%, 68% 52%, 70% 35%, 72% 55%, 74% 40%, 76% 52%, 78% 28%, 80% 48%, 82% 35%, 84% 55%, 86% 30%, 88% 52%, 90% 38%, 92% 55%, 94% 32%, 96% 52%, 98% 28%, 100% 42%, 100% 100%)',
        }}
      />
    </div>
  );
}
