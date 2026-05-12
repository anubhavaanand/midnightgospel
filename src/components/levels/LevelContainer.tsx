import { lazy, Suspense, useEffect, useRef } from 'react';
import FloatingQuote from '@components/ui/FloatingQuote';
import { getQuotesForLevel } from '@utils/quotes';
import { useSceneStore } from '@store/sceneStore';
import { LEVEL_RANGES } from '@utils/constants';

const ChromaticVoid = lazy(() => import('./ChromaticVoid/Level0'));
const ZombieApocalypse = lazy(() => import('./ZombieApocalypse'));
const ClownPlanet = lazy(() => import('./ClownPlanet'));
const AssCream = lazy(() => import('./AssCream'));
const BlindedByEnd = lazy(() => import('./BlindedByEnd'));
const SoulPrison = lazy(() => import('./SoulPrison'));
const TheExit = lazy(() => import('./TheExit'));

/**
 * Generates a stable id for a FloatingQuote from the level number and quote text.
 * Uses the first 30 characters of the text slugified, prefixed with the level number.
 */
function createQuoteId(level: number, text: string): string {
  const slug = text.slice(0, 30).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${level}-${slug}`;
}

/**
 * Level Container - Routes active level based on scroll progress
 * Redesigned for pitch black space with floating colorful elements
 */

interface LevelContainerProps {
  readonly scrollProgress: number;
}

export default function LevelContainer({ scrollProgress }: LevelContainerProps) {
  const prevLevelRef = useRef<number>(0);
  const setActiveLevel = useSceneStore((state) => state.setActiveLevel);
  const setIsTransitioning = useSceneStore((state) => state.setIsTransitioning);

  // Determine active level from scroll progress using constants
  const getActiveLevel = (progress: number): number => {
    // Find the level where progress is within [start, end)
    const level = LEVEL_RANGES.find(
      (l) => progress >= l.scrollStart && progress < l.scrollEnd
    );
    // If exact 1.0 or somehow missed, return last level
    if (!level && progress >= 0.9) return LEVEL_RANGES.at(-1)!.level;
    return level ? level.level : 0;
  };

  const activeLevel = getActiveLevel(scrollProgress);

  // Detect level transitions
  useEffect(() => {
    if (prevLevelRef.current !== activeLevel) {
      setIsTransitioning(true);
      setActiveLevel(activeLevel);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
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
      {/* Floating Quotes */}
      {levelQuotes.map((quote) => (
        <FloatingQuote
          key={createQuoteId(activeLevel, quote.text)}
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

        {/* Level 4: Blinded by My End */}
        <BlindedByEnd isActive={activeLevel === 4} />

        {/* Level 5: Soul Prison */}
        <SoulPrison isActive={activeLevel === 5} />

        {/* Level 6: The Exit */}
        <TheExit isActive={activeLevel === 6} />
      </Suspense>
    </group>
  );
}
