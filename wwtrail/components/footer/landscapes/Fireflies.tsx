'use client';

import { useMemo } from 'react';

interface FirefliesProps {
  count?: number;
}

export function Fireflies({ count = 12 }: FirefliesProps) {
  const fireflies = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      bottom: `${80 + Math.random() * 60}px`,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 3,
    }));
  }, [count]);

  return (
    <div className="fireflies-container absolute inset-0 pointer-events-none">
      {fireflies.map((firefly) => (
        <div
          key={firefly.id}
          className="absolute w-1 h-1 bg-yellow-200 rounded-full shadow-[0_0_8px_#fef08a] animate-firefly"
          style={{
            left: firefly.left,
            bottom: firefly.bottom,
            animationDelay: `${firefly.delay}s`,
            animationDuration: `${firefly.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
