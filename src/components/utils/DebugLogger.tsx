import { useEffect } from 'react';
import { useSceneStore } from '@store/sceneStore';

/**
 * Debug Logger - Console logging for development
 * Logs level changes, scroll progress, and rendering state
 */
export default function DebugLogger() {
    const activeLevel = useSceneStore((state) => state.activeLevel);
    const scrollProgress = useSceneStore((state) => state.scrollProgress);
    const isTransitioning = useSceneStore((state) => state.isTransitioning);

    useEffect(() => {
        console.log('%c🌌 MIDNIGHT GOSPEL DEBUG', 'background: #ff007f; color: white; padding: 4px 8px; font-weight: bold');
        console.log('Active Level:', activeLevel);
        console.log('Scroll Progress:', (scrollProgress * 100).toFixed(2) + '%');
        console.log('Is Transitioning:', isTransitioning);
        console.log('---');
    }, [activeLevel, scrollProgress, isTransitioning]);

    // Log on mount
    useEffect(() => {
        console.log('%c🚀 Simulator Started', 'background: #00ffff; color: black; padding: 4px 8px; font-weight: bold');
        console.log('Use mouse wheel or arrow keys to scroll through levels');
        console.log('Press 1-6 to jump to specific levels');
    }, []);

    return null;
}
