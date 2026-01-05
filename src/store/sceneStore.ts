import { create } from 'zustand';
import type { PerformanceMetrics } from '@utils/performanceProfiler';

interface SceneStore {
  scrollProgress: number;
  activeLevel: number;
  cameraMode: 'spline' | 'theatre';
  isTransitioning: boolean;
  performanceMetrics: PerformanceMetrics | null;
  isLoading: boolean;
  setScrollProgress: (progress: number) => void;
  setActiveLevel: (level: number) => void;
  setCameraMode: (mode: 'spline' | 'theatre') => void;
  setIsTransitioning: (transitioning: boolean) => void;
  setPerformanceMetrics: (metrics: PerformanceMetrics) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
  scrollProgress: 0,
  activeLevel: 0,
  cameraMode: 'spline',
  isTransitioning: false,
  performanceMetrics: null,
  isLoading: true,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setActiveLevel: (level) => set({ activeLevel: level }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setIsTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
  setPerformanceMetrics: (metrics) => set({ performanceMetrics: metrics }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
