'use client';

import { Stars } from './Stars';
import { NoiseTexture } from './NoiseTexture';
import { TimeOfDay } from './LandscapeBackground';

interface DesertSceneProps {
  timeOfDay: TimeOfDay;
}

export function DesertScene({ timeOfDay }: DesertSceneProps) {
  if (timeOfDay === 'night') {
    return (
      <div className="desert-night absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              #1a1525 0%,
              #252035 30%,
              #352845 60%,
              #453555 100%
            )`,
          }}
        />
        <Stars count={70} />
        <div className="moon absolute top-[30px] right-[18%] w-10 h-10 bg-amber-100 rounded-full shadow-[0_0_25px_rgba(254,243,199,0.4)]">
          <div className="absolute top-[3px] left-[-7px] w-9 h-9 bg-[#1a1525] rounded-full" />
        </div>
        <div
          className="absolute bottom-0 left-0 w-full h-[150px] bg-[#2a2040]"
          style={{
            clipPath: 'polygon(0% 100%, 0% 65%, 10% 65%, 12% 42%, 22% 42%, 25% 65%, 45% 65%, 48% 38%, 58% 38%, 60% 65%, 80% 65%, 85% 48%, 95% 48%, 98% 65%, 100% 65%, 100% 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[100px] bg-[#1a1530]"
          style={{ clipPath: 'polygon(0% 100%, 0% 50%, 30% 55%, 60% 45%, 100% 52%, 100% 100%)' }}
        />
        <NoiseTexture opacity={0.1} />
      </div>
    );
  }

  if (timeOfDay === 'sunrise') {
    return (
      <div className="desert-sunrise absolute inset-0 overflow-hidden">
        {/* Sunrise sky - cool to warm transition */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              #3a4555 0%,
              #5a6575 12%,
              #7a8595 24%,
              #9a95a0 36%,
              #b8a098 48%,
              #d0a890 58%,
              #e0a880 68%,
              #e8a070 78%,
              #f09860 88%,
              #f59050 100%
            )`,
          }}
        />

        {/* Rising sun - left side */}
        <div
          className="absolute bottom-[85px] left-[15%] w-[100px] h-[55px] opacity-75"
          style={{
            background: 'radial-gradient(ellipse at center bottom, rgba(255,200,130,1) 0%, rgba(255,170,100,0.5) 50%, transparent 80%)',
            filter: 'blur(8px)',
          }}
        />

        {/* Morning dust haze */}
        <div
          className="absolute bottom-[50px] left-0 w-full h-[100px] opacity-40"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(200,180,160,0.5) 100%)',
          }}
        />

        {/* Mesa formations - catching early light */}
        <div
          className="absolute bottom-0 left-0 w-full h-[170px]"
          style={{
            background: 'linear-gradient(to bottom, #a09590 0%, #908580 50%, #807570 100%)',
            clipPath: 'polygon(0% 100%, 0% 62%, 8% 62%, 10% 38%, 20% 38%, 23% 62%, 42% 62%, 46% 45%, 56% 45%, 58% 62%, 78% 62%, 82% 35%, 94% 35%, 96% 62%, 100% 62%, 100% 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[130px]"
          style={{
            background: 'linear-gradient(to bottom, #706560 0%, #605550 50%, #504540 100%)',
            clipPath: 'polygon(0% 100%, 0% 55%, 15% 55%, 18% 35%, 30% 35%, 32% 55%, 55% 55%, 60% 42%, 72% 42%, 75% 55%, 100% 55%, 100% 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[85px]"
          style={{
            background: 'linear-gradient(to bottom, #4a4035 0%, #3a3025 50%, #2a2015 100%)',
            clipPath: 'polygon(0% 100%, 0% 45%, 25% 50%, 50% 42%, 75% 48%, 100% 44%, 100% 100%)',
          }}
        />

        <NoiseTexture opacity={0.15} />
      </div>
    );
  }

  if (timeOfDay === 'sunset') {
    return (
      <div className="desert-sunset absolute inset-0 overflow-hidden">
        {/* Sunset sky - intense oranges and reds */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              #4a3555 0%,
              #6a4565 10%,
              #8a5570 20%,
              #a86070 30%,
              #c86868 40%,
              #e07858 50%,
              #e88848 60%,
              #f09838 70%,
              #f5a828 80%,
              #f8b818 90%,
              #fac808 100%
            )`,
          }}
        />

        {/* Intense sun glow */}
        <div
          className="absolute bottom-[80px] right-[20%] w-[140px] h-[80px] opacity-80"
          style={{
            background: 'radial-gradient(ellipse at center bottom, rgba(255,220,120,1) 0%, rgba(255,180,80,0.5) 50%, transparent 80%)',
            filter: 'blur(10px)',
          }}
        />

        {/* Warm dust haze */}
        <div
          className="absolute bottom-[50px] left-0 w-full h-[110px] opacity-45"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(180,120,80,0.5) 100%)',
          }}
        />

        {/* Mesa formations - silhouettes against sunset */}
        <div
          className="absolute bottom-0 left-0 w-full h-[170px]"
          style={{
            background: 'linear-gradient(to bottom, #6a5550 0%, #5a4540 50%, #4a3530 100%)',
            clipPath: 'polygon(0% 100%, 0% 62%, 8% 62%, 10% 38%, 20% 38%, 23% 62%, 42% 62%, 46% 45%, 56% 45%, 58% 62%, 78% 62%, 82% 35%, 94% 35%, 96% 62%, 100% 62%, 100% 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[130px]"
          style={{
            background: 'linear-gradient(to bottom, #3a2520 0%, #2a1a15 50%, #1a0a0a 100%)',
            clipPath: 'polygon(0% 100%, 0% 55%, 15% 55%, 18% 35%, 30% 35%, 32% 55%, 55% 55%, 60% 42%, 72% 42%, 75% 55%, 100% 55%, 100% 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[85px] bg-[#0a0505]"
          style={{ clipPath: 'polygon(0% 100%, 0% 45%, 25% 50%, 50% 42%, 75% 48%, 100% 44%, 100% 100%)' }}
        />

        <NoiseTexture opacity={0.15} />
      </div>
    );
  }

  // Day
  return (
    <div className="desert-day absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            #c8d5dc 0%,
            #d5dce0 15%,
            #e2ddd5 30%,
            #e8d5c5 45%,
            #e5c8b2 60%,
            #ddb8a0 75%,
            #d5a890 90%,
            #c89880 100%
          )`,
        }}
      />

      <div
        className="absolute bottom-[100px] left-[25%] w-[120px] h-[80px] opacity-45"
        style={{
          background: 'radial-gradient(ellipse, rgba(248,220,180,0.8) 0%, rgba(240,200,150,0.3) 60%, transparent 85%)',
          filter: 'blur(10px)',
        }}
      />

      <div
        className="absolute bottom-[60px] left-0 w-full h-[100px] opacity-30"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(210,180,150,0.5) 100%)',
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-full h-[170px]"
        style={{
          background: 'linear-gradient(to bottom, #c5b5a5 0%, #b5a595 50%, #a59585 100%)',
          clipPath: 'polygon(0% 100%, 0% 62%, 8% 62%, 10% 38%, 20% 38%, 23% 62%, 42% 62%, 46% 45%, 56% 45%, 58% 62%, 78% 62%, 82% 35%, 94% 35%, 96% 62%, 100% 62%, 100% 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-[130px]"
        style={{
          background: 'linear-gradient(to bottom, #a08878 0%, #907868 50%, #806858 100%)',
          clipPath: 'polygon(0% 100%, 0% 55%, 15% 55%, 18% 35%, 30% 35%, 32% 55%, 55% 55%, 60% 42%, 72% 42%, 75% 55%, 100% 55%, 100% 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-[85px]"
        style={{
          background: 'linear-gradient(to bottom, #785848 0%, #685040 50%, #584838 100%)',
          clipPath: 'polygon(0% 100%, 0% 45%, 25% 50%, 50% 42%, 75% 48%, 100% 44%, 100% 100%)',
        }}
      />

      <NoiseTexture opacity={0.15} />
    </div>
  );
}
