import React, { Suspense, lazy } from 'react';
import { Html, useProgress } from '@react-three/drei';
import { useLevelStore } from '../../store/useLevelStore';

const LoadingFallback: React.FC = () => {
  const { progress, active } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-center pointer-events-none select-none gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-t-fuchsia-500 border-r-transparent border-b-cyan-500 border-l-transparent animate-spin" />
        {active ? (
          <>
            <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-[10px] font-mono text-white/40 tracking-widest">
              LOADING {Math.round(progress)}%
            </span>
          </>
        ) : (
          <span className="font-sans-elegant text-sm font-bold tracking-[0.2em] text-white">
            SCANNING MULTIVERSE...
          </span>
        )}
      </div>
    </Html>
  );
};

const ChromaticRibbon = lazy(() => import('../../levels/Hub/ChromaticRibbon'));
const ZombieCapitol = lazy(() => import('../../levels/Episode1/ZombieCapitol'));
const BabyClown = lazy(() => import('../../levels/Episode2/BabyClown'));
const CreamOcean = lazy(() => import('../../levels/Episode3/CreamOcean'));
const VengeanceKingdom = lazy(() => import('../../levels/Episode4/VengeanceKingdom'));
const SoulPrison = lazy(() => import('../../levels/Episode5/SoulPrison'));
const MeditationCave = lazy(() => import('../../levels/Episode6/MeditationCave'));
const PlanetBlankBall = lazy(() => import('../../levels/Episode7/PlanetBlankBall'));
const Trainworld = lazy(() => import('../../levels/Episode8/Trainworld'));
const TheCore = lazy(() => import('../../levels/Episode9/TheCore'));

export const SimulatorRouter: React.FC = () => {
  const activeLevelId = useLevelStore((state) => state.activeLevelId);

  return (
    <Suspense fallback={<LoadingFallback />}>
      {activeLevelId === 0 && <ChromaticRibbon />}
      {activeLevelId === 1 && <ZombieCapitol />}
      {activeLevelId === 2 && <BabyClown />}
      {activeLevelId === 3 && <CreamOcean />}
      {activeLevelId === 4 && <VengeanceKingdom />}
      {activeLevelId === 5 && <SoulPrison />}
      {activeLevelId === 6 && <MeditationCave />}
      {activeLevelId === 7 && <PlanetBlankBall />}
      {activeLevelId === 8 && <Trainworld />}
      {activeLevelId === 9 && <TheCore />}
    </Suspense>
  );
};

