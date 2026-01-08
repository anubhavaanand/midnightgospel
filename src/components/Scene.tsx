import { ScrollControls } from '@react-three/drei';
import { Suspense, useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';
import { useSceneStore } from '@store/sceneStore';
import { useCameraPath } from '@hooks/useCameraPath';
import SynthesizerDrone from './audio/SynthesizerDrone';
import { useScrollProgress } from '@hooks/useScrollProgress';
import { useDeviceDetection } from '@hooks/useMobileResponsive';
import CameraRig from './CameraRig';
import LevelContainer from './levels/LevelContainer';
import PerformanceMonitor from '@components/utils/PerformanceMonitor';
import ParticleTrail from './effects/ParticleTrail';
import ScreenShake from '@hooks/useScreenShake';
import PostProcessingEffects from './effects/PostProcessingEffects';
import Starfield from './effects/Starfield';

/**
 * Pitch Black Space Background
 * Ensures the scene background is pure black
 */
function PitchBlackSpace() {
  const { gl, scene } = useThree();

  useEffect(() => {
    // Set renderer clear color to black
    gl.setClearColor(0x000000, 1);
    // Set scene background to black
    scene.background = new THREE.Color(0x000000);
    // Disable fog if any
    scene.fog = null;
  }, [gl, scene]);

  return null;
}

// MinimalStarfield component removed - unused

/**
 * Main scene wrapper with ScrollControls and spline camera integration.
 * Supports both scroll (desktop) and touch (mobile) input.
 */
export default function Scene() {
  const scrollControlsRef = useRef<any>(null);
  const config = useDeviceDetection();

  return (
    <ScrollControls
      pages={8}
      damping={config.isMobile ? 0.15 : 0.25}
    >
      <PitchBlackSpace />
      {/* <MinimalStarfield /> - Commented out to verify black background */}
      <SceneContent scrollControlsRef={scrollControlsRef} />
    </ScrollControls>
  );
}

function SceneContent({ scrollControlsRef }: any) {
  const scrollProgress = useScrollProgress();
  const config = useDeviceDetection();
  const touchStartRef = useRef<{ y: number } | null>(null);
  const setIsLoading = useSceneStore((state) => state.setIsLoading);

  useEffect(() => {
    // Artificial small delay to ensure smooth transition
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  useCameraPath(scrollProgress);

  // Mobile touch-to-scroll handler
  useEffect(() => {
    if (!config.isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartRef.current = { y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current || !scrollControlsRef.current) return;

      const deltaY = touchStartRef.current.y - e.touches[0].clientY;
      const sensitivity = 0.001; // Adjust swipe sensitivity

      // Update scroll position
      scrollControlsRef.current.scroll.current += deltaY * sensitivity;

      // Clamp to valid range
      scrollControlsRef.current.scroll.current = Math.max(
        0,
        Math.min(1, scrollControlsRef.current.scroll.current)
      );

      touchStartRef.current = { y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      touchStartRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [config.isMobile, scrollControlsRef]);

  return (
    <Suspense fallback={null}>
      <Physics gravity={[0, -5, 0]}>
        <CameraRig />
        <PerformanceMonitor />
        <SynthesizerDrone />
        <LevelContainer scrollProgress={scrollProgress} />

        {/* Global Atmosphere - Breathtaking Starfield */}
        <Starfield />

        {/* E2: Particle Trail - cursor following particles */}
        <ParticleTrail />

        {/* E4: Screen Shake - camera shake on level transitions */}
        <ScreenShake intensity={0.3} decay={0.9} />

        {/* Visual Effects - Midnight Gospel Aesthetic */}
        <PostProcessingEffects />
      </Physics>
      {/* Minimal ambient light - just enough to see */}
      <ambientLight intensity={0.05} />
    </Suspense>
  );
}
