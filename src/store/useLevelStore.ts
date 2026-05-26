import { create } from 'zustand';
import type { LevelId } from '../data/levels';

interface LevelState {
  activeLevelId: LevelId;
  previousLevelId: LevelId | null;
  isTransitioning: boolean;
  scrollProgress: number; // value from 0 to 1
  isMenuOpen: boolean;
  setLevel: (id: LevelId) => void;
  setTransitioning: (t: boolean) => void;
  setScrollProgress: (p: number) => void;
  setMenuOpen: (o: boolean) => void;
}

export const useLevelStore = create<LevelState>((set) => ({
  activeLevelId: 0,
  previousLevelId: null,
  isTransitioning: false,
  scrollProgress: 0,
  isMenuOpen: false,
  setLevel: (id) => set((state) => ({ 
    activeLevelId: id, 
    previousLevelId: state.activeLevelId,
    scrollProgress: 0, // Reset scroll progress on level switch
    isMenuOpen: false // Close menu on level switch
  })),
  setTransitioning: (t) => set({ isTransitioning: t }),
  setScrollProgress: (p) => set({ scrollProgress: p }),
  setMenuOpen: (o) => set({ isMenuOpen: o })
}));

if (typeof window !== 'undefined') {
  (window as any).useLevelStore = useLevelStore;
}

