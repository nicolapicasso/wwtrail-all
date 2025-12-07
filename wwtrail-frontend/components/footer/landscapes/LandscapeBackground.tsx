'use client';

import { useState, useEffect } from 'react';
import { MountainsScene } from './MountainsScene';
import { DesertScene } from './DesertScene';
import { CoastScene } from './CoastScene';
import { PlainsScene } from './PlainsScene';

export type SceneType = 'mountains' | 'desert' | 'coast' | 'plains';
export type TimeOfDay = 'night' | 'sunrise' | 'day' | 'sunset';

const SCENES: SceneType[] = ['mountains', 'desert', 'coast', 'plains'];
const STORAGE_KEY = 'wwtrail-footer-scene';

/**
 * Determines the time of day based on current hour
 * - Night: 21:00 - 6:00
 * - Sunrise: 6:00 - 9:00
 * - Day: 9:00 - 18:00
 * - Sunset: 18:00 - 21:00
 */
function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 9) {
    return 'sunrise';
  } else if (hour >= 9 && hour < 18) {
    return 'day';
  } else if (hour >= 18 && hour < 21) {
    return 'sunset';
  } else {
    return 'night';
  }
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
  /** Force a specific time of day (optional, for testing) */
  forceTimeOfDay?: TimeOfDay;
}

export function LandscapeBackground({ forceScene, forceTimeOfDay }: LandscapeBackgroundProps) {
  const [scene, setScene] = useState<SceneType>('mountains');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setScene(forceScene || getRandomScene());
    setTimeOfDay(forceTimeOfDay || getTimeOfDay());
  }, [forceScene, forceTimeOfDay]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div className="absolute inset-0 bg-slate-900" />;
  }

  const sceneComponents: Record<SceneType, React.ReactNode> = {
    mountains: <MountainsScene timeOfDay={timeOfDay} />,
    desert: <DesertScene timeOfDay={timeOfDay} />,
    coast: <CoastScene timeOfDay={timeOfDay} />,
    plains: <PlainsScene timeOfDay={timeOfDay} />,
  };

  return (
    <div className="landscape-background absolute inset-0 transition-opacity duration-500">
      {sceneComponents[scene]}
    </div>
  );
}
