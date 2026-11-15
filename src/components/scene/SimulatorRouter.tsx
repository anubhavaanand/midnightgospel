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
  { children: React.ReactNode; levelId: number },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error('[LevelErrorBoundary]', error, info);
  }

  componentDidUpdate(prevProps: { levelId: number }) {
    if (prevProps.levelId !== this.props.levelId && this.state.error) {
      this.setState({ error: null });
    }
  }

  handleReturnToHub = () => {
    this.setState({ error: null });
    useLevelStore.getState().setLevel(0);
  };

  render() {
    if (this.state.error) {
      return (
        <Html center>
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/90 border border-rose-500/50 backdrop-blur-xl text-center font-mono-diagnostic max-w-md shadow-2xl pointer-events-auto select-none">
            <span className="text-xs font-bold text-rose-400 tracking-widest uppercase mb-2">
              SIMULATION PARADOX // LEVEL ERROR
            </span>
            <p className="text-white/80 text-xs mb-4 line-clamp-3">
              {this.state.error.message || 'Dimensional rendering encountered an anomaly.'}
            </p>
            <button
              onClick={this.handleReturnToHub}
              className="px-4 py-2 rounded-full glass-button text-xs text-white hover:text-fuchsia-400 border border-white/20 hover:border-fuchsia-400/50 transition-all font-bold tracking-wider"
            >
              RETURN TO HUB ⟲
            </button>
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
    <LevelErrorBoundary key={activeLevelId} levelId={activeLevelId}>
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
