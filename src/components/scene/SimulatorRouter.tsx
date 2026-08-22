import React, { Suspense, lazy } from 'react';
import { Html } from '@react-three/drei';
import { useLevelStore } from '../../store/useLevelStore';

/**
 * Plain spinner — intentionally NOT driven by drei's useProgress.
 * useProgress only tracks three.js asset loads; JS module chunks never
 * register, which previously left the fallback stuck forever.
 */
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

class LevelErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  componentDidCatch(error: Error, info: unknown) {
    console.error('[LevelErrorBoundary]', error, info);
    this.setState({ error });
  }
  render() {
    if (this.state.error) {
      return (
        <Html center>
          <div style={{ color: '#ff4488', fontFamily: 'monospace', maxWidth: 480 }}>
            LEVEL CRASHED: {this.state.error.message}
          </div>
        </Html>
      );
    }
    return this.props.children;
  }
}

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
    <LevelErrorBoundary>
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
    </LevelErrorBoundary>
  );
};
