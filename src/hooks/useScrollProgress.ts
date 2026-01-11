import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '@store/sceneStore';
import { useRef, useEffect } from 'react';

/**
 * Hook to sync scroll position from ScrollControls to global store.
 * Uses useFrame for real-time updates every render cycle.
 * Returns normalized scroll progress (0-1).
 */
export const useScrollProgress = () => {
  const scroll = useScroll();
  const setScrollProgress = useSceneStore((state) => state.setScrollProgress);
  const prevProgressRef = useRef(-1); // Start at -1 to ensure first update

  // Initial sync on mount
  useEffect(() => {
    setScrollProgress(scroll.offset);
  }, []);

  // Use useFrame for real-time scroll syncing
  useFrame(() => {
    const progress = scroll.offset;

    // Update with very low threshold for responsiveness
    if (Math.abs(progress - prevProgressRef.current) > 0.0001) {
      setScrollProgress(progress);
      prevProgressRef.current = progress;
    }
  });

  return scroll.offset;
};
