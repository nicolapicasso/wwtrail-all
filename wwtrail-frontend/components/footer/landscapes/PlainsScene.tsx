'use client';

import { Stars } from './Stars';
import { Fireflies } from './Fireflies';
import { NoiseTexture } from './NoiseTexture';
import { TimeOfDay } from './LandscapeBackground';

interface PlainsSceneProps {
  timeOfDay: TimeOfDay;
}

export function PlainsScene({ timeOfDay }: PlainsSceneProps) {
  if (timeOfDay === 'night') {
    return (
      <div className="plains-night absolute inset-0 overflow-hidden">
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
        <Stars count={60} />
        <div className="moon absolute top-[40px] left-1/2 -translate-x-1/2 w-10 h-10 bg-amber-100 rounded-full shadow-[0_0_25px_rgba(254,243,199,0.4)]">
          <div className="absolute top-[3px] left-[-7px] w-9 h-9 bg-[#0a1018] rounded-full" />
        </div>
        <div
          className="absolute bottom-0 left-0 w-full h-[140px] bg-[#181e25]"
          style={{ clipPath: 'polygon(0% 100%, 0% 65%, 15% 52%, 35% 62%, 55% 48%, 75% 58%, 100% 50%, 100% 100%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[105px] bg-[#10151a]"
          style={{ clipPath: 'polygon(0% 100%, 0% 55%, 25% 45%, 50% 55%, 75% 42%, 100% 50%, 100% 100%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[70px] bg-[#080c10]"
          style={{ clipPath: 'polygon(0% 100%, 0% 42%, 100% 48%, 100% 100%)' }}
        />
        <Fireflies count={12} />
        <NoiseTexture opacity={0.08} />
      </div>
    );
  }

  if (timeOfDay === 'sunrise') {
    return (
      <div className="plains-sunrise absolute inset-0 overflow-hidden">
        {/* Sunrise sky - cool to warm */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              #4a5060 0%,
              #6a7080 12%,
              #8a90a0 24%,
              #a8a0a8 36%,
              #c0a8a0 48%,
              #d0a898 58%,
              #dca088 68%,
              #e89878 78%,
              #f09068 88%,
              #f58858 100%
            )`,
          }}
        />

        {/* Rising sun - centered low on horizon */}
        <div
          className="absolute bottom-[85px] left-1/2 -translate-x-1/2 w-[130px] h-[70px] opacity-75"
          style={{
            background: 'radial-gradient(ellipse at center bottom, rgba(255,200,140,1) 0%, rgba(255,170,100,0.5) 50%, transparent 80%)',
            filter: 'blur(10px)',
          }}
        />

        {/* Morning mist over fields */}
        <div
          className="absolute bottom-[60px] left-0 w-full h-[100px] opacity-50"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(180,185,190,0.6) 50%, rgba(160,165,170,0.4) 100%)',
          }}
        />

        {/* Rolling hills - cool morning light */}
        <div
          className="absolute bottom-0 left-0 w-full h-[150px]"
          style={{
            background: 'linear-gradient(to bottom, #909088 0%, #808078 50%, #707068 100%)',
            clipPath: 'polygon(0% 100%, 0% 60%, 12% 50%, 30% 58%, 50% 45%, 70% 55%, 88% 48%, 100% 52%, 100% 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[115px]"
          style={{
            background: 'linear-gradient(to bottom, #606058 0%, #505048 50%, #404038 100%)',
            clipPath: 'polygon(0% 100%, 0% 52%, 18% 45%, 40% 55%, 62% 40%, 82% 52%, 100% 45%, 100% 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[80px]"
          style={{
            background: 'linear-gradient(to bottom, #3a3830 0%, #2a2820 50%, #1a1810 100%)',
            clipPath: 'polygon(0% 100%, 0% 40%, 100% 45%, 100% 100%)',
          }}
        />

        {/* Subtle grass texture */}
        <div
          className="absolute bottom-0 left-0 w-full h-[45px] opacity-25"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 4px, #1a1810 4px, #1a1810 5px)',
            clipPath: 'polygon(0% 100%, 0% 0%, 2% 45%, 4% 0%, 6% 40%, 8% 0%, 10% 48%, 12% 0%, 14% 42%, 16% 0%, 18% 50%, 20% 0%, 22% 45%, 24% 0%, 26% 40%, 28% 0%, 30% 48%, 32% 0%, 34% 42%, 36% 0%, 38% 50%, 40% 0%, 42% 45%, 44% 0%, 46% 40%, 48% 0%, 50% 48%, 52% 0%, 54% 42%, 56% 0%, 58% 50%, 60% 0%, 62% 45%, 64% 0%, 66% 40%, 68% 0%, 70% 48%, 72% 0%, 74% 42%, 76% 0%, 78% 50%, 80% 0%, 82% 45%, 84% 0%, 86% 40%, 88% 0%, 90% 48%, 92% 0%, 94% 42%, 96% 0%, 98% 50%, 100% 0%, 100% 100%)',
          }}
        />

        <NoiseTexture opacity={0.12} />
      </div>
    );
  }

  if (timeOfDay === 'sunset') {
    return (
      <div className="plains-sunset absolute inset-0 overflow-hidden">
        {/* Sunset sky - golden to purple */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              #3a3858 0%,
              #5a4568 10%,
              #7a5078 20%,
              #9a5880 30%,
              #b86078 40%,
              #d07068 50%,
              #e08058 60%,
              #e89048 70%,
              #f0a038 80%,
              #f5b028 90%,
              #f8c018 100%
            )`,
          }}
        />

        {/* Setting sun - centered on horizon */}
        <div
          className="absolute bottom-[90px] left-1/2 -translate-x-1/2 w-[160px] h-[85px] opacity-85"
          style={{
            background: 'radial-gradient(ellipse at center bottom, rgba(255,220,130,1) 0%, rgba(255,180,80,0.5) 50%, transparent 80%)',
            filter: 'blur(12px)',
          }}
        />

        {/* Golden haze */}
        <div
          className="absolute bottom-[50px] left-0 w-full h-[110px] opacity-45"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(200,150,100,0.5) 100%)',
          }}
        />

        {/* Rolling hills - warm sunset tones */}
        <div
          className="absolute bottom-0 left-0 w-full h-[150px]"
          style={{
            background: 'linear-gradient(to bottom, #6a5550 0%, #5a4540 50%, #4a3530 100%)',
            clipPath: 'polygon(0% 100%, 0% 60%, 12% 50%, 30% 58%, 50% 45%, 70% 55%, 88% 48%, 100% 52%, 100% 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[115px]"
          style={{
            background: 'linear-gradient(to bottom, #3a2825 0%, #2a1a18 50%, #1a0a08 100%)',
            clipPath: 'polygon(0% 100%, 0% 52%, 18% 45%, 40% 55%, 62% 40%, 82% 52%, 100% 45%, 100% 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[80px] bg-[#0a0505]"
          style={{ clipPath: 'polygon(0% 100%, 0% 40%, 100% 45%, 100% 100%)' }}
        />

        {/* Grass texture - dark silhouette */}
        <div
          className="absolute bottom-0 left-0 w-full h-[45px] opacity-30"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 4px, #050202 4px, #050202 5px)',
            clipPath: 'polygon(0% 100%, 0% 0%, 2% 45%, 4% 0%, 6% 40%, 8% 0%, 10% 48%, 12% 0%, 14% 42%, 16% 0%, 18% 50%, 20% 0%, 22% 45%, 24% 0%, 26% 40%, 28% 0%, 30% 48%, 32% 0%, 34% 42%, 36% 0%, 38% 50%, 40% 0%, 42% 45%, 44% 0%, 46% 40%, 48% 0%, 50% 48%, 52% 0%, 54% 42%, 56% 0%, 58% 50%, 60% 0%, 62% 45%, 64% 0%, 66% 40%, 68% 0%, 70% 48%, 72% 0%, 74% 42%, 76% 0%, 78% 50%, 80% 0%, 82% 45%, 84% 0%, 86% 40%, 88% 0%, 90% 48%, 92% 0%, 94% 42%, 96% 0%, 98% 50%, 100% 0%, 100% 100%)',
          }}
        />

        <NoiseTexture opacity={0.12} />
      </div>
    );
  }

  // Day
  return (
    <div className="plains-day absolute inset-0 overflow-hidden">
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

      <div
        className="absolute bottom-[100px] left-1/2 -translate-x-1/2 w-[140px] h-[70px] opacity-50"
        style={{
          background: 'radial-gradient(ellipse at center bottom, rgba(250,225,180,0.9) 0%, rgba(240,200,150,0.4) 50%, transparent 80%)',
          filter: 'blur(10px)',
        }}
      />

      <div
        className="absolute bottom-[70px] left-0 w-full h-[90px] opacity-35"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(210,195,180,0.5) 100%)',
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-full h-[150px]"
        style={{
          background: 'linear-gradient(to bottom, #b8b0a5 0%, #a8a095 50%, #989085 100%)',
          clipPath: 'polygon(0% 100%, 0% 60%, 12% 50%, 30% 58%, 50% 45%, 70% 55%, 88% 48%, 100% 52%, 100% 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-[115px]"
        style={{
          background: 'linear-gradient(to bottom, #8a8578 0%, #7a7568 50%, #6a6558 100%)',
          clipPath: 'polygon(0% 100%, 0% 52%, 18% 45%, 40% 55%, 62% 40%, 82% 52%, 100% 45%, 100% 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-[80px]"
        style={{
          background: 'linear-gradient(to bottom, #6a5d50 0%, #5a4d40 50%, #4a3d30 100%)',
          clipPath: 'polygon(0% 100%, 0% 40%, 100% 45%, 100% 100%)',
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-full h-[45px] opacity-25"
        style={{
          background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 4px, #3a2d20 4px, #3a2d20 5px)',
          clipPath: 'polygon(0% 100%, 0% 0%, 2% 45%, 4% 0%, 6% 40%, 8% 0%, 10% 48%, 12% 0%, 14% 42%, 16% 0%, 18% 50%, 20% 0%, 22% 45%, 24% 0%, 26% 40%, 28% 0%, 30% 48%, 32% 0%, 34% 42%, 36% 0%, 38% 50%, 40% 0%, 42% 45%, 44% 0%, 46% 40%, 48% 0%, 50% 48%, 52% 0%, 54% 42%, 56% 0%, 58% 50%, 60% 0%, 62% 45%, 64% 0%, 66% 40%, 68% 0%, 70% 48%, 72% 0%, 74% 42%, 76% 0%, 78% 50%, 80% 0%, 82% 45%, 84% 0%, 86% 40%, 88% 0%, 90% 48%, 92% 0%, 94% 42%, 96% 0%, 98% 50%, 100% 0%, 100% 100%)',
        }}
      />

      <NoiseTexture opacity={0.12} />
    </div>
  );
}
