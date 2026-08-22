import { useState, useCallback } from 'react';

/**
 * Hook to manage intro state with localStorage persistence
 */
export function useIntroState() {
    const [hasSeenIntro, setHasSeenIntro] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('midnight-intro-seen') === 'true';
        }
        return false;
    });

    const markIntroSeen = useCallback(() => {
        setHasSeenIntro(true);
        localStorage.setItem('midnight-intro-seen', 'true');
    }, []);

    const resetIntro = useCallback(() => {
        setHasSeenIntro(false);
        localStorage.removeItem('midnight-intro-seen');
    }, []);

    return { hasSeenIntro, markIntroSeen, resetIntro };
}