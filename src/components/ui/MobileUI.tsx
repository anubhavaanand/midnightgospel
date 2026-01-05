/**
 * Mobile UI Overlay
 * 
 * Touch-optimized UI controls for mobile devices.
 * Includes swipe indicators, touch buttons, and responsive layout.
 */

import { useEffect, useState } from 'react';
import { useSceneStore } from '@store/sceneStore';
import { useDeviceDetection } from '@hooks/useMobileResponsive';

export default function MobileUI() {
  const { scrollProgress } = useSceneStore();
  const [isVisible, setIsVisible] = useState(true);
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout>();
  const config = useDeviceDetection();
  
  // Calculate level index from scroll progress
  const levelIndex = Math.floor(scrollProgress * 6);

  // Hide UI after inactivity
  useEffect(() => {
    if (hideTimer) clearTimeout(hideTimer);
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    setHideTimer(timer);
    return () => clearTimeout(timer);
  }, [scrollProgress]);

  if (!config.isMobile) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-20 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Top Indicator */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center py-4">
        <div className="text-white text-center text-sm font-light">
          <div className="text-xs opacity-60 mb-2">LEVEL {levelIndex + 1}/6</div>
          <div className="text-xs opacity-60">
            {Math.round(scrollProgress * 100)}%
          </div>
        </div>
      </div>

      {/* Swipe Indicator - Up */}
      <div
        className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
          isVisible ? 'opacity-40' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-6 h-6 text-white animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
          <span className="text-xs text-white opacity-60">Swipe to scroll</span>
        </div>
      </div>

      {/* Swipe Indicator - Down */}
      <div
        className={`absolute bottom-1/4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
          isVisible ? 'opacity-40' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-6 h-6 text-white animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H9"
            />
          </svg>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Level Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === levelIndex
                ? 'bg-white w-4'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
