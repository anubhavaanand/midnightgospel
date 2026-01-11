/**
 * Mobile UI Overlay
 * 
 * Touch-optimized UI controls for mobile devices.
 * Includes swipe indicators, touch buttons, and responsive layout.
 * Enhanced for better visibility and no overlap.
 */

import { useEffect, useState } from 'react';
import { useSceneStore } from '@store/sceneStore';
import { useDeviceDetection } from '@hooks/useMobileResponsive';
import { LEVEL_RANGES } from '@utils/constants';

export default function MobileUI() {
  const scrollProgress = useSceneStore((state) => state.scrollProgress);
  const activeLevel = useSceneStore((state) => state.activeLevel);
  const [isVisible, setIsVisible] = useState(true);
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout>();
  const config = useDeviceDetection();

  // Get level info
  const levelInfo = LEVEL_RANGES[activeLevel];
  const levelName = levelInfo?.name ?? 'Unknown';

  // Hide UI after inactivity
  useEffect(() => {
    if (hideTimer) clearTimeout(hideTimer);
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    setHideTimer(timer);
    return () => clearTimeout(timer);
  }, [scrollProgress]);

  // Show on touch
  useEffect(() => {
    const handleTouch = () => {
      setIsVisible(true);
    };

    window.addEventListener('touchstart', handleTouch);
    return () => window.removeEventListener('touchstart', handleTouch);
  }, []);

  if (!config.isMobile && !config.isTablet) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-20 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-30'
        }`}
    >
      {/* Compact Top Bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
        {/* Level Info - Left */}
        <div className="text-white text-left">
          <div className="text-[10px] opacity-50 uppercase tracking-wider">Level {activeLevel + 1}</div>
          <div className="text-xs font-medium text-cyan-400 truncate max-w-[120px]">
            {levelName}
          </div>
        </div>

        {/* Progress - Center */}
        <div className="text-white text-center">
          <div className="text-lg font-bold text-pink-400">
            {Math.round(scrollProgress * 100)}%
          </div>
        </div>

        {/* Episode - Right */}
        <div className="text-white text-right">
          <div className="text-[10px] opacity-50 uppercase">Episode</div>
          <div className="text-xs font-medium">{activeLevel === 0 ? 'INTRO' : `EP. ${activeLevel}`}</div>
        </div>
      </div>

      {/* Swipe Hint - Center (only on Level 0) */}
      {activeLevel === 0 && scrollProgress < 0.05 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center animate-pulse">
          <div className="text-4xl mb-2">👆</div>
          <div className="text-xs text-white/60">Swipe to explore</div>
        </div>
      )}

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Progress Track */}
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 transition-all duration-300"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* Level Dots */}
        <div className="flex justify-center gap-2 py-3 bg-gradient-to-t from-black/60 to-transparent">
          {LEVEL_RANGES.map((_level, i) => (
            <div
              key={i}
              className={`transition-all duration-300 rounded-full ${i === activeLevel
                ? 'w-6 h-2 bg-cyan-400'
                : i < activeLevel
                  ? 'w-2 h-2 bg-pink-400/60'
                  : 'w-2 h-2 bg-white/30'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
