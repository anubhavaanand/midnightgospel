import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
    collectibles: string[];
    score: number;
    unlockedSecrets: Record<string, boolean>;

    // Actions
    collectItem: (id: string, value?: number) => void;
    unlockSecret: (id: string) => void;
    resetProgress: () => void;
    hasCollected: (id: string) => boolean;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            collectibles: [],
            score: 0,
            unlockedSecrets: {},

            collectItem: (id, value = 100) => {
                const { collectibles, score } = get();
                if (!collectibles.includes(id)) {
                    set({
                        collectibles: [...collectibles, id],
                        score: score + value,
                    });
                }
            },

            unlockSecret: (id) => {
                set((state) => ({
                    unlockedSecrets: { ...state.unlockedSecrets, [id]: true },
                }));
            },

            resetProgress: () => {
                set({
                    collectibles: [],
                    score: 0,
                    unlockedSecrets: {},
                });
            },

            hasCollected: (id) => {
                return get().collectibles.includes(id);
            },
        }),
        {
            name: 'midnight-gospel-storage', // unique name
        }
    )
);
