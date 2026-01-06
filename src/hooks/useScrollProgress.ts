import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '@store/sceneStore';
import { useRef } from 'react';

/**
 * Hook to sync scroll position from ScrollControls to global store.
 * Uses useFrame for real-time updates every render cycle.
 * Returns normalized scroll progress (0-1).
 */
export const useScrollProgress = () => {
  const scroll = useScroll();
  const setScrollProgress = useSceneStore((state) => state.setScrollProgress);
  const prevProgressRef = useRef(0);

  // Use useFrame for real-time scroll syncing
  useFrame(() => {
    const progress = scroll.offset;

    // Only update if progress actually changed (reduces unnecessary renders)
    if (Math.abs(progress - prevProgressRef.current) > 0.001) {
      setScrollProgress(progress);
      prevProgressRef.current = progress;
    }
  });

  return scroll.offset;
};
