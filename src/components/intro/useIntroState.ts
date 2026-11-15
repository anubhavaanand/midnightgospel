import { useState, useCallback } from 'react';

/**
 * Hook to manage intro state with localStorage persistence
 */
export function useIntroState() {
    const [hasSeenIntro, setHasSeenIntro] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                return localStorage.getItem('midnight-intro-seen') === 'true';
            } catch {
                return false;
            }
        }
        return false;
    });

    const markIntroSeen = useCallback(() => {
        setHasSeenIntro(true);
        try {
            localStorage.setItem('midnight-intro-seen', 'true');
        } catch {
            // Ignore restricted localStorage
        }
    }, []);

    const resetIntro = useCallback(() => {
        setHasSeenIntro(false);
        try {
            localStorage.removeItem('midnight-intro-seen');
        } catch {
            // Ignore restricted localStorage
        }
    }, []);

    return { hasSeenIntro, markIntroSeen, resetIntro };
}