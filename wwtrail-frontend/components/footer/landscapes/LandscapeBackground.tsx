'use client';

import { useState, useEffect } from 'react';
import { MountainsScene } from './MountainsScene';
import { DesertScene } from './DesertScene';
import { CoastScene } from './CoastScene';
import { PlainsScene } from './PlainsScene';

export type SceneType = 'mountains' | 'desert' | 'coast' | 'plains';

const SCENES: SceneType[] = ['mountains', 'desert', 'coast', 'plains'];
const STORAGE_KEY = 'wwtrail-footer-scene';

/**
 * Determines if it's night time (20:00 - 07:00)
 */
function isNightTime(): boolean {
  const hour = new Date().getHours();
  return hour < 7 || hour >= 20;
}

/**
 * Gets or generates a random scene, persisted in sessionStorage
 */
function getRandomScene(): SceneType {
  if (typeof window === 'undefined') {
    return 'mountains';
  }

  let scene = sessionStorage.getItem(STORAGE_KEY) as SceneType | null;

  if (!scene || !SCENES.includes(scene)) {
    scene = SCENES[Math.floor(Math.random() * SCENES.length)];
    sessionStorage.setItem(STORAGE_KEY, scene);
  }

  return scene;
}

interface LandscapeBackgroundProps {
  /** Force a specific scene (optional, for testing) */
  forceScene?: SceneType;
  /** Force day or night mode (optional, for testing) */
  forceNight?: boolean;
}

export function LandscapeBackground({ forceScene, forceNight }: LandscapeBackgroundProps) {
  const [scene, setScene] = useState<SceneType>('mountains');
  const [isNight, setIsNight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setScene(forceScene || getRandomScene());
    setIsNight(forceNight !== undefined ? forceNight : isNightTime());
  }, [forceScene, forceNight]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div className="absolute inset-0 bg-slate-900" />;
  }

  const sceneComponents: Record<SceneType, React.ReactNode> = {
    mountains: <MountainsScene isNight={isNight} />,
    desert: <DesertScene isNight={isNight} />,
    coast: <CoastScene isNight={isNight} />,
    plains: <PlainsScene isNight={isNight} />,
  };

  return (
    <div className="landscape-background absolute inset-0 transition-opacity duration-500">
      {sceneComponents[scene]}
    </div>
  );
}
