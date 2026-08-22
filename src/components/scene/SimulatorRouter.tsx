import React, { useState, useEffect, ComponentType } from 'react';
import { Html } from '@react-three/drei';
import { useLevelStore } from '../../store/useLevelStore';

const LoadingFallback: React.FC = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center text-center pointer-events-none select-none gap-3">
      <div className="w-12 h-12 rounded-full border-2 border-t-fuchsia-500 border-r-transparent border-b-cyan-500 border-l-transparent animate-spin" />
      <span className="font-sans-elegant text-sm font-bold tracking-[0.2em] text-white">
        SCANNING MULTIVERSE...
      </span>
    </div>
  </Html>
);

const levelLoaders: Record<number, () => Promise<{ default: ComponentType }>> = {
  0: () => import('../../levels/Hub/ChromaticRibbon'),
  1: () => import('../../levels/Episode1/ZombieCapitol'),
  2: () => import('../../levels/Episode2/BabyClown'),
  3: () => import('../../levels/Episode3/CreamOcean'),
  4: () => import('../../levels/Episode4/VengeanceKingdom'),
  5: () => import('../../levels/Episode5/SoulPrison'),
  6: () => import('../../levels/Episode6/MeditationCave'),
  7: () => import('../../levels/Episode7/PlanetBlankBall'),
  8: () => import('../../levels/Episode8/Trainworld'),
  9: () => import('../../levels/Episode9/TheCore'),
};

export const SimulatorRouter: React.FC = () => {
  const activeLevelId = useLevelStore((state) => state.activeLevelId);
  const [LoadedLevel, setLoadedLevel] = useState<ComponentType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loader = levelLoaders[activeLevelId];
    if (!loader) return;

    setLoading(true);
    setLoadedLevel(null);

    loader().then((mod) => {
      if (!cancelled) {
        setLoadedLevel(() => mod.default);
        setLoading(false);
      }
    }).catch((err) => {
      console.error(`Failed to load level ${activeLevelId}:`, err);
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [activeLevelId]);

  if (loading) return <LoadingFallback />;
  if (!LoadedLevel) return null;

  return <LoadedLevel />;
};

