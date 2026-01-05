import { lazy, Suspense } from 'react';
import CosmicEnvironment from '@components/environment/CosmicEnvironment';

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

// Level-specific cosmic color themes based on research data
const LEVEL_COSMIC_THEMES = [
  { nebula1: '#2e004f', nebula2: '#ff007f', intensity: 1.0 },   // Chromatic Void - psychedelic
  { nebula1: '#1a0a0a', nebula2: '#ff3333', intensity: 0.7 },   // Zombie - dark red/death
  { nebula1: '#ff66cc', nebula2: '#ffff00', intensity: 0.9 },   // Clown Planet - bright carnival
  { nebula1: '#004466', nebula2: '#00ffff', intensity: 0.8 },   // Ass Cream - underwater blue
  { nebula1: '#1a0033', nebula2: '#9900ff', intensity: 0.6 },   // Soul Prison - dark purple
  { nebula1: '#ffffff', nebula2: '#00ffff', intensity: 1.2 },   // The Exit - transcendence white
];

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
  const cosmicTheme = LEVEL_COSMIC_THEMES[activeLevel];

  return (
    <group>
      {/* Cosmic Space Environment - Always visible, changes color per level */}
      <CosmicEnvironment
        intensity={cosmicTheme.intensity}
        nebulaColor1={cosmicTheme.nebula1}
        nebulaColor2={cosmicTheme.nebula2}
        starCount={1500}
      />

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
