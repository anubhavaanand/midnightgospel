import { lazy, Suspense, useEffect, useRef } from 'react';
import FloatingQuote from '@components/ui/FloatingQuote';
import { getQuotesForLevel } from '@utils/quotes';
import { useSceneStore } from '@store/sceneStore';
import { LEVEL_RANGES } from '@utils/constants';

// Lazy load level components
const ChromaticVoid = lazy(() => import('./ChromaticVoid/Level0'));
const ZombieApocalypse = lazy(() => import('./ZombieApocalypse'));
const ClownPlanet = lazy(() => import('./ClownPlanet'));
const AssCream = lazy(() => import('./AssCream'));
const BlindedByEnd = lazy(() => import('./BlindedByEnd'));
const SoulPrison = lazy(() => import('./SoulPrison'));
const TheExit = lazy(() => import('./TheExit'));

/**
 * Level Container - Routes active level based on scroll progress
 * Only renders the currently active level for performance and correct isolation
 */

// Map level index to component
const LEVEL_COMPONENTS = [
  { Component: ChromaticVoid, name: 'ChromaticVoid' },
  { Component: ZombieApocalypse, name: 'ZombieApocalypse' },
  { Component: ClownPlanet, name: 'ClownPlanet' },
  { Component: AssCream, name: 'AssCream' },
  { Component: BlindedByEnd, name: 'BlindedByEnd' },
  { Component: SoulPrison, name: 'SoulPrison' },
  { Component: TheExit, name: 'TheExit' },
];

export default function LevelContainer({ scrollProgress: _prop }: { scrollProgress?: number }) {
  const prevLevelRef = useRef<number>(0);
  const setActiveLevel = useSceneStore((state) => state.setActiveLevel);
  const setIsTransitioning = useSceneStore((state) => state.setIsTransitioning);
  // Read scroll progress from store to trigger re-renders
  const scrollProgress = useSceneStore((state) => state.scrollProgress);

  // Determine active level from scroll progress using constants
  const getActiveLevel = (progress: number): number => {
    // Range check
    const level = LEVEL_RANGES.find(
      (l) => progress >= l.scrollStart && progress < l.scrollEnd
    );
    // Boundary case
    if (!level && progress >= 0.9) return 6; // The Exit
    if (!level && progress <= 0.01) return 0; // Start
    return level ? level.level : 0;
  };

  const activeLevel = getActiveLevel(scrollProgress);

  // Detect level transitions
  useEffect(() => {
    if (prevLevelRef.current !== activeLevel) {
      console.log(`[LevelContainer] TRANSITION DETECTED: ${prevLevelRef.current} -> ${activeLevel}`);
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

  // Get the active level component
  const ActiveLevelData = LEVEL_COMPONENTS[activeLevel] || LEVEL_COMPONENTS[0];
  const ActiveLevelComponent = ActiveLevelData?.Component;

  // Get level position
  const levelConfig = LEVEL_RANGES.find(l => l.level === activeLevel);
  const position: [number, number, number] = levelConfig?.position
    ? [levelConfig.position.x, levelConfig.position.y, levelConfig.position.z]
    : [0, 0, 0];

  // Debug log every render
  // console.log('[LevelContainer] Render. Progress:', scrollProgress.toFixed(3), 'Level:', activeLevel);

  return (
    <group>
      {/* Floating Quotes */}
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

      {/* Only render the active level positioned correctly in world space */}
      <Suspense fallback={null}>
        {ActiveLevelComponent && (
          <group position={position}>
            {/* @ts-ignore - Dynamic component props */}
            <ActiveLevelComponent
              key={`level-${activeLevel}`}
              isActive={true}
              scrollProgress={scrollProgress}
            />
          </group>
        )}
      </Suspense>
    </group>
  );
}
