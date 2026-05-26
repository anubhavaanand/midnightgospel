import React, { Suspense, lazy } from 'react';
import { Html } from '@react-three/drei';
import { useLevelStore } from '../../store/useLevelStore';
import { NPCAttentionCatcher } from './NPCAttentionCatcher';

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
    <Suspense fallback={
      <Html center>
        <div className="flex flex-col items-center justify-center text-center whitespace-nowrap pointer-events-none select-none">
          <div className="w-12 h-12 rounded-full border-2 border-t-fuchsia-500 border-r-transparent border-b-cyan-500 border-l-transparent animate-spin mb-4" />
          <span className="font-sans-elegant text-sm font-bold tracking-[0.2em] text-white">
            SCANNING MULTIVERSE...
          </span>
        </div>
      </Html>
    }>
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
      {activeLevelId === 9 && (
        <>
          <TheCore />
          <NPCAttentionCatcher npcPosition={[0, 5, 0]} npcName="The Simulator" targetLevelId={9} />
        </>
      )}
    </Suspense>
  );
};

