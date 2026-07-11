'use client';

import { useMemo } from 'react';

interface StarsProps {
  count?: number;
}

export function Stars({ count = 50 }: StarsProps) {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 50}%`, // Only in top half
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3,
    }));
  }, [count]);

  return (
    <div className="stars absolute top-0 left-0 right-0 h-[180px]">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
