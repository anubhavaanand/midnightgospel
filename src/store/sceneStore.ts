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

// Achievement type
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number;
}

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_EGG: { id: 'first-egg', name: 'Egg Hunter', description: 'Collect your first easter egg', icon: '🥚' },
  ALL_EGGS: { id: 'all-eggs', name: 'Completionist', description: 'Collect all easter eggs', icon: '🏆' },
  QUOTE_COLLECTOR: { id: 'quote-collector', name: 'Philosopher', description: 'Save 10 quotes', icon: '📜' },
  ALL_LEVELS: { id: 'all-levels', name: 'Explorer', description: 'Visit all 6 levels', icon: '🌌' },
  SHARE_MOMENT: { id: 'share-moment', name: 'Social', description: 'Share a moment', icon: '📤' },
  DEEP_DIVE: { id: 'deep-dive', name: 'Deep Diver', description: 'Reach 100% scroll', icon: '🔮' },
} as const;

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

  // Easter eggs and achievements
  collectedEggs: string[];
  achievements: Achievement[];
  levelsVisited: number[];
  maxScrollProgress: number;

  // UI visibility states
  showKeyboardShortcuts: boolean;
  showMiniMap: boolean;
  showQuoteJournal: boolean;
  showAchievements: boolean;
  showSharePanel: boolean;

  // Hub navigation state
  showHub: boolean;
  isInTransition: boolean;
  introCompleted: boolean;

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

  // Easter egg and achievement actions
  collectEgg: (eggId: string) => void;
  unlockAchievement: (achievementId: string, name: string, description: string, icon: string) => void;
  visitLevel: (level: number) => void;
  updateMaxScroll: (progress: number) => void;

  // UI visibility toggles
  toggleKeyboardShortcuts: () => void;
  toggleMiniMap: () => void;
  toggleQuoteJournal: () => void;
  toggleAchievements: () => void;
  toggleSharePanel: () => void;

  // Hub navigation actions
  setShowHub: (show: boolean) => void;
  setIsInTransition: (transitioning: boolean) => void;
  setIntroCompleted: (completed: boolean) => void;
  navigateToLevel: (level: number) => void;
  returnToHub: () => void;
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

      // Easter eggs and achievements initial state
      collectedEggs: [],
      achievements: [],
      levelsVisited: [],
      maxScrollProgress: 0,

      // UI visibility initial states
      showKeyboardShortcuts: false,
      showMiniMap: true,
      showQuoteJournal: false,
      showAchievements: false,
      showSharePanel: false,

      // Hub navigation initial state
      showHub: true,
      isInTransition: false,
      introCompleted: false,

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

      // Easter egg and achievement actions
      collectEgg: (eggId) => set((state) => {
        if (state.collectedEggs.includes(eggId)) return state;
        return { collectedEggs: [...state.collectedEggs, eggId] };
      }),
      unlockAchievement: (achievementId, name, description, icon) => set((state) => {
        if (state.achievements.some(a => a.id === achievementId)) return state;
        return {
          achievements: [...state.achievements, {
            id: achievementId,
            name,
            description,
            icon,
            unlockedAt: Date.now()
          }]
        };
      }),
      visitLevel: (level) => set((state) => {
        if (state.levelsVisited.includes(level)) return state;
        return { levelsVisited: [...state.levelsVisited, level] };
      }),
      updateMaxScroll: (progress) => set((state) => ({
        maxScrollProgress: Math.max(state.maxScrollProgress, progress)
      })),

      // UI visibility toggles
      toggleKeyboardShortcuts: () => set((state) => ({
        showKeyboardShortcuts: !state.showKeyboardShortcuts
      })),
      toggleMiniMap: () => set((state) => ({ showMiniMap: !state.showMiniMap })),
      toggleQuoteJournal: () => set((state) => ({ showQuoteJournal: !state.showQuoteJournal })),
      toggleAchievements: () => set((state) => ({ showAchievements: !state.showAchievements })),
      toggleSharePanel: () => set((state) => ({ showSharePanel: !state.showSharePanel })),

      // Hub navigation actions
      setShowHub: (show) => set({ showHub: show }),
      setIsInTransition: (transitioning) => set({ isInTransition: transitioning }),
      setIntroCompleted: (completed) => set({ introCompleted: completed }),
      navigateToLevel: (level) => set({
        activeLevel: level,
        showHub: false,
        isInTransition: true,
      }),
      returnToHub: () => set({
        showHub: true,
        isInTransition: false,
      }),
    }),
    {
      name: 'midnight-gospel-storage',
      partialize: (state) => ({
        audioSettings: state.audioSettings,
        savedQuotes: state.savedQuotes,
        showMiniMap: state.showMiniMap,
        collectedEggs: state.collectedEggs,
        achievements: state.achievements,
        levelsVisited: state.levelsVisited,
        maxScrollProgress: state.maxScrollProgress,
      }),
    }
  )
);

