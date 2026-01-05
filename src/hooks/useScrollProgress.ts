import { useScroll } from '@react-three/drei';
import { useSceneStore } from '@store/sceneStore';

/**
 * Hook to sync scroll position from ScrollControls to global store.
 * Returns normalized scroll progress (0-1).
 */
export const useScrollProgress = () => {
  const scroll = useScroll();
  const setScrollProgress = useSceneStore((state) => state.setScrollProgress);

  // Normalize scroll offset to 0-1 range
  const progress = scroll.offset;
  setScrollProgress(progress);

  return progress;
};
