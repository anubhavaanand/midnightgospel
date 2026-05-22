import { create } from 'zustand';
import type { LevelId } from '../data/levels';

interface LevelState {
  activeLevelId: LevelId;
  previousLevelId: LevelId | null;
  isTransitioning: boolean;
  setLevel: (id: LevelId) => void;
  setTransitioning: (t: boolean) => void;
}

export const useLevelStore = create<LevelState>((set) => ({
  activeLevelId: 0,
  previousLevelId: null,
  isTransitioning: false,
  setLevel: (id) => set((state) => ({ 
    activeLevelId: id, 
    previousLevelId: state.activeLevelId 
  })),
  setTransitioning: (t) => set({ isTransitioning: t })
}));
