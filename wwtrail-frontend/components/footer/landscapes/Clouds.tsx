'use client';

import { useMemo } from 'react';

interface CloudsProps {
  count?: number;
}

export function Clouds({ count = 3 }: CloudsProps) {
  const clouds = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      width: 45 + Math.random() * 50, // 45-95px
      height: 14 + Math.random() * 14, // 14-28px
      top: 18 + Math.random() * 40, // 18-58px from top
      duration: 45 + Math.random() * 25, // 45-70s to cross screen
      delay: -(Math.random() * 40), // Start at random position
    }));
  }, [count]);

  return (
    <>
      <style jsx>{`
        @keyframes cloud-drift {
          0% {
            left: -100px;
          }
          100% {
            left: 100%;
          }
        }
        .cloud {
          animation-name: cloud-drift;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="cloud absolute bg-white/90 rounded-[50px]"
          style={{
            width: `${cloud.width}px`,
            height: `${cloud.height}px`,
            top: `${cloud.top}px`,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
          }}
        />
      ))}
    </>
  );
}
