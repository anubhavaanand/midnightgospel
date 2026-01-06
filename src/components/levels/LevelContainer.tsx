import { lazy, Suspense, useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import FloatingQuote from '@components/ui/FloatingQuote';
import { getQuotesForLevel } from '@utils/quotes';
import { useSceneStore } from '@store/sceneStore';

const ChromaticVoid = lazy(() => import('./ChromaticVoid/Level0'));
const ZombieApocalypse = lazy(() => import('./ZombieApocalypse'));
const ClownPlanet = lazy(() => import('./ClownPlanet'));
const AssCream = lazy(() => import('./AssCream'));
const SoulPrison = lazy(() => import('./SoulPrison'));
const TheExit = lazy(() => import('./TheExit'));

/**
 * Level Container - Routes active level based on scroll progress
 * Redesigned for pitch black space with floating colorful elements
 */

// Level-specific themes
const LEVEL_THEMES = [
  { color: '#ff007f', name: 'Chromatic Void' },    // Hot pink
  { color: '#ff3333', name: 'Zombie Apocalypse' }, // Red
  { color: '#ffcc00', name: 'Clown Planet' },      // Yellow
  { color: '#00ffff', name: 'Ass Cream' },         // Cyan
  { color: '#9900ff', name: 'Soul Prison' },       // Purple
  { color: '#ffffff', name: 'The Exit' },          // White
];

interface LevelContainerProps {
  scrollProgress: number;
}

/**
 * Floating Orb Light - Colored point light that floats in space
 */
function FloatingLight({ color, position, intensity = 1 }: {
  color: string;
  position: [number, number, number];
  intensity?: number
}) {
  const lightRef = useRef<THREE.PointLight>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (lightRef.current && meshRef.current) {
      // Gentle floating motion
      lightRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.5;
    }
  });

  return (
    <group position={position}>
      <pointLight
        ref={lightRef}
        color={color}
        intensity={intensity}
        distance={20}
        decay={2}
      />
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function LevelContainer({ scrollProgress }: LevelContainerProps) {
  const prevLevelRef = useRef<number>(0);
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
  const theme = LEVEL_THEMES[activeLevel];

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
      {/* Level-specific accent lights */}
      {/* <FloatingLight color={theme.color} position={[-8, 5, -10]} intensity={2} /> */}
      {/* <FloatingLight color={theme.color} position={[8, -4, -12]} intensity={1.5} /> */}

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
