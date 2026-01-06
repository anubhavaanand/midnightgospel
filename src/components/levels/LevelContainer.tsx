import { lazy, Suspense, useEffect, useState, useRef } from 'react';
import CosmicEnvironment from '@components/environment/CosmicEnvironment';
import FloatingQuote from '@components/ui/FloatingQuote';
import { getQuotesForLevel } from '@utils/quotes';
import { useSceneStore } from '@store/sceneStore';
import { AmbientParticles, ChromaticFlash } from '@components/effects/LevelTransition';

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
  { nebula1: '#2e004f', nebula2: '#ff007f', intensity: 1.0, ambient: '#ff007f' },
  { nebula1: '#1a0a0a', nebula2: '#ff3333', intensity: 0.7, ambient: '#ff3333' },
  { nebula1: '#ff66cc', nebula2: '#ffff00', intensity: 0.9, ambient: '#ffff00' },
  { nebula1: '#004466', nebula2: '#00ffff', intensity: 0.8, ambient: '#00ffff' },
  { nebula1: '#1a0033', nebula2: '#9900ff', intensity: 0.6, ambient: '#9900ff' },
  { nebula1: '#ffffff', nebula2: '#00ffff', intensity: 1.2, ambient: '#ffffff' },
];

interface LevelContainerProps {
  scrollProgress: number;
}

export default function LevelContainer({ scrollProgress }: LevelContainerProps) {
  const prevLevelRef = useRef<number>(0);
  const [showFlash, setShowFlash] = useState(false);
  const setActiveLevel = useSceneStore((state) => state.setActiveLevel);
  const setIsTransitioning = useSceneStore((state) => state.setIsTransitioning);

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

  // Detect level transitions
  useEffect(() => {
    if (prevLevelRef.current !== activeLevel) {
      // Level changed - trigger transition effects
      setIsTransitioning(true);
      setShowFlash(true);
      setActiveLevel(activeLevel);

      // Reset transition state after animation
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setShowFlash(false);
      }, 500);

      prevLevelRef.current = activeLevel;
      return () => clearTimeout(timer);
    }
  }, [activeLevel, setActiveLevel, setIsTransitioning]);

  // Update store with active level on mount
  useEffect(() => {
    setActiveLevel(activeLevel);
  }, []);

  // Get quotes for current level
  const levelQuotes = getQuotesForLevel(activeLevel);

  return (
    <group>
      {/* Cosmic Space Environment - Always visible, changes color per level */}
      <CosmicEnvironment
        intensity={cosmicTheme.intensity}
        nebulaColor1={cosmicTheme.nebula1}
        nebulaColor2={cosmicTheme.nebula2}
        starCount={1500}
      />

      {/* Ambient floating particles */}
      <AmbientParticles
        count={80}
        color={cosmicTheme.ambient}
        speed={0.3}
        spread={40}
      />

      {/* Level transition flash */}
      <ChromaticFlash
        color={cosmicTheme.ambient}
        isActive={showFlash}
        duration={0.3}
      />

      {/* Floating Quotes - Philosophical dialogue from the show */}
      {levelQuotes.map((quote, index) => (
        <FloatingQuote
          key={`quote-${activeLevel}-${index}`}
          text={quote.text}
          author={quote.author}
          position={quote.position}
          rotation={quote.rotation}
          scale={quote.scale}
          isActive={true}
        />
      ))}

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

