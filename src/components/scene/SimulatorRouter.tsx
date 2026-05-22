import React, { Suspense, lazy } from 'react';
import { Html } from '@react-three/drei';
import { useLevelStore } from '../../store/useLevelStore';
import { LoadingScreen } from '../ui/LoadingScreen';

const ChromaticRibbon = lazy(() => import('../../levels/Hub/ChromaticRibbon'));
const ZombieCapitol = lazy(() => import('../episodes/episode1/ZombieCapitol').then(m => ({ default: m.ZombieCapitol })));
const BabyClown = lazy(() => import('../../levels/Episode2/BabyClown'));
const CreamOcean = lazy(() => import('../../levels/Episode3/CreamOcean'));
const VengeanceKingdom = lazy(() => import('../../levels/Episode4/VengeanceKingdom'));
const SoulPrison = lazy(() => import('../../levels/Episode5/SoulPrison'));
const MeditationCave = lazy(() => import('../../levels/Episode6/MeditationCave'));
const PlanetBlankBall = lazy(() => import('../../levels/Episode7/PlanetBlankBall'));
const Trainworld = lazy(() => import('../../levels/Episode8/Trainworld'));

const LevelSuspenseFallback = () => (
  <Html center zIndexRange={[100, 0]}>
    <LoadingScreen />
  </Html>
);

export const SimulatorRouter: React.FC = () => {
  const activeLevelId = useLevelStore((state) => state.activeLevelId);

  return (
    <Suspense fallback={<LevelSuspenseFallback />}>
      {activeLevelId === 0 && <ChromaticRibbon />}
      {activeLevelId === 1 && <ZombieCapitol />}
      {activeLevelId === 2 && <BabyClown />}
      {activeLevelId === 3 && <CreamOcean />}
      {activeLevelId === 4 && <VengeanceKingdom />}
      {activeLevelId === 5 && <SoulPrison />}
      {activeLevelId === 6 && <MeditationCave />}
      {activeLevelId === 7 && <PlanetBlankBall />}
      {activeLevelId === 8 && <Trainworld />}
    </Suspense>
  );
};
