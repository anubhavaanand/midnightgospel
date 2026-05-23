import React, { Suspense, lazy } from 'react';
import { Html } from '@react-three/drei';
import { useLevelStore } from '../../store/useLevelStore';
import { LoadingScreen } from '../ui/LoadingScreen';
import { NPCAttentionCatcher } from './NPCAttentionCatcher';

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
      {activeLevelId === 0 && (
        <>
          <ChromaticRibbon />
          <NPCAttentionCatcher npcPosition={[0, 0, 0]} npcName="Clancy" targetLevelId={0} />
        </>
      )}
      {activeLevelId === 1 && (
        <>
          <ZombieCapitol />
          <NPCAttentionCatcher npcPosition={[0, 1, 0]} npcName="Glasses Man" targetLevelId={1} />
        </>
      )}
      {activeLevelId === 2 && (
        <>
          <BabyClown />
          <NPCAttentionCatcher npcPosition={[0, 2, 0]} npcName="Baby Clown King" targetLevelId={2} />
        </>
      )}
      {activeLevelId === 3 && (
        <>
          <CreamOcean />
          <NPCAttentionCatcher npcPosition={[0, 0, 0]} npcName="Fish Mage" targetLevelId={3} />
        </>
      )}
      {activeLevelId === 4 && (
        <>
          <VengeanceKingdom />
          <NPCAttentionCatcher npcPosition={[0, 0, 0]} npcName="Knight" targetLevelId={4} />
        </>
      )}
      {activeLevelId === 5 && (
        <>
          <SoulPrison />
          <NPCAttentionCatcher npcPosition={[0, 0, 0]} npcName="Inmate" targetLevelId={5} />
        </>
      )}
      {activeLevelId === 6 && (
        <>
          <MeditationCave />
          <NPCAttentionCatcher npcPosition={[0, 0, 0]} npcName="Teacher" targetLevelId={6} />
        </>
      )}
      {activeLevelId === 7 && (
        <>
          <PlanetBlankBall />
          <NPCAttentionCatcher npcPosition={[0, 0, 0]} npcName="Death" targetLevelId={7} />
        </>
      )}
      {activeLevelId === 8 && (
        <>
          <Trainworld />
          <NPCAttentionCatcher npcPosition={[0, 0, 0]} npcName="Mom" targetLevelId={8} />
        </>
      )}
    </Suspense>
  );
};

