import { lazy, Suspense } from 'react';

const ChromaticVoid = lazy(() => import('./ChromaticVoid'));
const ZombieApocalypse = lazy(() => import('./ZombieApocalypse'));
const ClownPlanet = lazy(() => import('./ClownPlanet'));
const AssCream = lazy(() => import('./AssCream'));
const SoulPrison = lazy(() => import('./SoulPrison'));
const TheExit = lazy(() => import('./TheExit'));

/**
 * Level Container - Routes active level based on scroll progress
 * 
 * Level Structure (6 segments):
 * 0: Chromatic Void        [0.00 - 0.15]  Intro/Simulator Hub
 * 1: Zombie Apocalypse     [0.15 - 0.35]  Taste of the King
 * 2: Clown Planet          [0.35 - 0.55]  Officers & Wolves
 * 3: Ass Cream             [0.55 - 0.75]  Hunters Without Home
 * 4: Soul Prison           [0.75 - 0.90]  Annihilation of Joy
 * 5: The Exit              [0.90 - 1.00]  Climax
 */
interface LevelContainerProps {
  scrollProgress: number;
}

export default function LevelContainer({ scrollProgress }: LevelContainerProps) {
  // Determine active level from scroll progress
  const getActiveLevel = (progress: number): number => {
    if (progress < 0.15) return 0;
    if (progress < 0.35) return 1;
    if (progress < 0.55) return 2;
    if (progress < 0.75) return 3;
    if (progress < 0.90) return 4;
    return 5;
  };

  const activeLevel = getActiveLevel(scrollProgress);

  return (
    <group>
      <Suspense fallback={null}>
        {/* Level 0: Chromatic Void */}
        <ChromaticVoid isActive={activeLevel === 0} />

        {/* Level 1: Zombie Apocalypse */}
        <ZombieApocalypse isActive={activeLevel === 1} />

        {/* Level 2: Clown Planet */}
        <ClownPlanet isActive={activeLevel === 2} />

        {/* Level 3: Ass Cream */}
        <AssCream isActive={activeLevel === 3} />

        {/* Level 4: Soul Prison */}
        <SoulPrison isActive={activeLevel === 4} />

        {/* Level 5: The Exit */}
        <TheExit isActive={activeLevel === 5} />
      </Suspense>
    </group>
  );
}
