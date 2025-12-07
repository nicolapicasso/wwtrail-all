'use client';

import { useMemo } from 'react';

interface TumbleweedProps {
  count?: number;
}

export function Tumbleweed({ count = 2 }: TumbleweedProps) {
  const tumbleweeds = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: 12 + Math.random() * 8, // 12-20px
      bottom: 35 + Math.random() * 30, // 35-65px from bottom
      delay: i * 15 + Math.random() * 10, // Stagger the start
      duration: 20 + Math.random() * 15, // 20-35s to cross screen
    }));
  }, [count]);

  return (
    <>
      <style jsx>{`
        @keyframes roll-across {
          0% {
            left: -30px;
            transform: rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            left: 100%;
            transform: rotate(720deg);
            opacity: 0;
          }
        }
        .tumbleweed {
          animation-name: roll-across;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
      {tumbleweeds.map((tw) => (
        <div
          key={tw.id}
          className="tumbleweed absolute rounded-full"
          style={{
            width: `${tw.size}px`,
            height: `${tw.size}px`,
            bottom: `${tw.bottom}px`,
            animationDuration: `${tw.duration}s`,
            animationDelay: `${tw.delay}s`,
            background: 'radial-gradient(circle at 30% 30%, #a8763e 0%, #8b5a2b 40%, #654321 100%)',
            boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.1)',
          }}
        />
      ))}
    </>
  );
}
