import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PerformanceMetrics } from '@utils/performanceProfiler';

// Quote type for collection
export interface SavedQuote {
  text: string;
  author: string;
  level: number;
  savedAt: number;
}

// Audio settings
export interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  isMuted: boolean;
}

interface SceneStore {
  // Existing state
  scrollProgress: number;
  activeLevel: number;
  cameraMode: 'spline' | 'theatre';
  isTransitioning: boolean;
  performanceMetrics: PerformanceMetrics | null;
  isLoading: boolean;

  // U1: Audio settings
  audioSettings: AudioSettings;

  // U5: Quote collection
  savedQuotes: SavedQuote[];

  // UI visibility states
  showKeyboardShortcuts: boolean;
  showMiniMap: boolean;
  showQuoteJournal: boolean;

  // Existing setters
  setScrollProgress: (progress: number) => void;
  setActiveLevel: (level: number) => void;
  setCameraMode: (mode: 'spline' | 'theatre') => void;
  setIsTransitioning: (transitioning: boolean) => void;
  setPerformanceMetrics: (metrics: PerformanceMetrics) => void;
  setIsLoading: (loading: boolean) => void;

  // U1: Audio setters
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setEffectsVolume: (volume: number) => void;
  toggleMute: () => void;

  // U5: Quote actions
  saveQuote: (quote: Omit<SavedQuote, 'savedAt'>) => void;
  removeQuote: (savedAt: number) => void;
  clearAllQuotes: () => void;

  // UI visibility toggles
  toggleKeyboardShortcuts: () => void;
  toggleMiniMap: () => void;
  toggleQuoteJournal: () => void;
}

export const useSceneStore = create<SceneStore>()(
  persist(
    (set) => ({
      // Initial state
      scrollProgress: 0,
      activeLevel: 0,
      cameraMode: 'spline',
      isTransitioning: false,
      performanceMetrics: null,
      isLoading: true,

      // U1: Audio settings initial state
      audioSettings: {
        masterVolume: 0.5,
        musicVolume: 0.7,
        effectsVolume: 0.8,
        isMuted: false,
      },

      // U5: Quote collection initial state
      savedQuotes: [],

      // UI visibility initial states
      showKeyboardShortcuts: false,
      showMiniMap: true,
      showQuoteJournal: false,

      // Existing setters
      setScrollProgress: (progress) => set({ scrollProgress: progress }),
      setActiveLevel: (level) => set({ activeLevel: level }),
      setCameraMode: (mode) => set({ cameraMode: mode }),
      setIsTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
      setPerformanceMetrics: (metrics) => set({ performanceMetrics: metrics }),
      setIsLoading: (loading) => set({ isLoading: loading }),

      // U1: Audio setters
      setMasterVolume: (volume) => set((state) => ({
        audioSettings: { ...state.audioSettings, masterVolume: volume }
      })),
      setMusicVolume: (volume) => set((state) => ({
        audioSettings: { ...state.audioSettings, musicVolume: volume }
      })),
      setEffectsVolume: (volume) => set((state) => ({
        audioSettings: { ...state.audioSettings, effectsVolume: volume }
      })),
      toggleMute: () => set((state) => ({
        audioSettings: { ...state.audioSettings, isMuted: !state.audioSettings.isMuted }
      })),

      // U5: Quote actions
      saveQuote: (quote) => set((state) => ({
        savedQuotes: [...state.savedQuotes, { ...quote, savedAt: Date.now() }]
      })),
      removeQuote: (savedAt) => set((state) => ({
        savedQuotes: state.savedQuotes.filter(q => q.savedAt !== savedAt)
      })),
      clearAllQuotes: () => set({ savedQuotes: [] }),

      // UI visibility toggles
      toggleKeyboardShortcuts: () => set((state) => ({
        showKeyboardShortcuts: !state.showKeyboardShortcuts
      })),
      toggleMiniMap: () => set((state) => ({ showMiniMap: !state.showMiniMap })),
      toggleQuoteJournal: () => set((state) => ({ showQuoteJournal: !state.showQuoteJournal })),
    }),
    {
      name: 'midnight-gospel-storage',
      partialize: (state) => ({
        audioSettings: state.audioSettings,
        savedQuotes: state.savedQuotes,
        showMiniMap: state.showMiniMap,
      }),
    }
  )
);

