import { ScrollControls } from '@react-three/drei';
import { Suspense, useRef, useEffect } from 'react';
import { Physics } from '@react-three/rapier';
import { useSceneStore } from '@store/sceneStore';
import { useCameraPath } from '@hooks/useCameraPath';
import VoxelArtifact from './interactive/VoxelArtifact';
import SynthesizerDrone from './audio/SynthesizerDrone';
import { useScrollProgress } from '@hooks/useScrollProgress';
import { useDeviceDetection } from '@hooks/useMobileResponsive';
import CameraRig from './CameraRig';
import LevelContainer from './levels/LevelContainer';
import PerformanceMonitor from '@components/utils/PerformanceMonitor';

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
      </Physics>
      {/* Lighting and environment will be added in level components */}
    </Suspense>
  );
}
