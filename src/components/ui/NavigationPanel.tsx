import { useState, useEffect, useCallback } from 'react';
import { useSceneStore } from '@store/sceneStore';
import { LEVEL_RANGES } from '@utils/constants';

// Episode metadata for navigation display
const LEVEL_EPISODES = [
  { shortName: 'Intro', episode: 'Simulator', color: '#00ffff' },
  { shortName: 'Ep. 1', episode: 'Taste of the King', color: '#ff3333' },
  { shortName: 'Ep. 2', episode: 'Officers & Wolves', color: '#ffcc00' },
  { shortName: 'Ep. 3', episode: 'Hunters Without Home', color: '#00ffff' },
  { shortName: 'Ep. 4', episode: 'Blinded by My End', color: '#ff9900' },
  { shortName: 'Ep. 5', episode: 'Annihilation of Joy', color: '#9900ff' },
  { shortName: 'Finale', episode: 'Transcendence', color: '#ffffff' },
];

/**
 * Glassmorphism navigation panel for level selection.
 * Supports keyboard navigation:
 * - Numbers 1-6: Jump to level
 * - Arrow Up/Down: Navigate levels
 * - L: Toggle panel
 * - Escape: Close panel
 */
export default function NavigationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const activeLevel = useSceneStore((state) => state.activeLevel);
  const setActiveLevel = useSceneStore((state) => state.setActiveLevel);
  const setScrollProgress = useSceneStore((state) => state.setScrollProgress);

  const handleLevelSelect = useCallback((levelIndex: number) => {
    setActiveLevel(levelIndex);
    // Also update scroll progress to match level start
    const levelRange = LEVEL_RANGES[levelIndex];
    if (levelRange) {
      setScrollProgress(levelRange.scrollStart);
    }
    setIsOpen(false);
  }, [setActiveLevel, setScrollProgress]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
          e.preventDefault();
          handleLevelSelect(parseInt(e.key) - 1);
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          setIsOpen(prev => !prev);
          break;
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowUp':
          if (activeLevel > 0) {
            e.preventDefault();
            handleLevelSelect(activeLevel - 1);
          }
          break;
        case 'ArrowDown':
          if (activeLevel < LEVEL_RANGES.length - 1) {
            e.preventDefault();
            handleLevelSelect(activeLevel + 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLevel, handleLevelSelect]);

  return (
    <div className="fixed top-24 right-8 z-30 pointer-events-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel px-5 py-3 text-midnight-pink font-bold tracking-wider flex items-center gap-3 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-midnight-cyan/50"
      >
        <span className="text-midnight-cyan text-lg">☰</span>
        <span className="text-white/90">LEVELS</span>
        <span className="text-[9px] text-white/40 hidden md:inline ml-1">[L]</span>
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 glass-panel p-4 w-72 space-y-2">
          {/* Keyboard hints */}
          <div className="text-[8px] text-white/30 mb-3 flex justify-between items-center border-b border-white/10 pb-2">
            <span>Press 1-6 to jump • ↑↓ to navigate</span>
            <span className="text-white/50">[ESC] close</span>
          </div>

          {LEVEL_RANGES.map((level, index) => {
            const episode = LEVEL_EPISODES[index];
            const isActive = activeLevel === level.level;

            return (
              <button
                key={level.level}
                onClick={() => handleLevelSelect(level.level)}
                className={`w-full text-left glass-panel p-3 transition-all relative overflow-hidden ${isActive
                  ? 'bg-white/20 border-l-2'
                  : 'hover:bg-white/10'
                  }`}
                style={{ borderLeftColor: isActive ? episode.color : 'transparent' }}
              >
                {/* Active indicator glow */}
                {isActive && (
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{ background: `linear-gradient(90deg, ${episode.color}, transparent)` }}
                  />
                )}

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold" style={{ color: episode.color }}>
                      {episode.shortName}
                    </span>
                    <span className="text-[10px] text-white/30 font-mono">
                      [{index + 1}]
                    </span>
                  </div>

                  <div className="text-white text-sm font-semibold mb-1">
                    {level.name}
                  </div>

                  <div className="text-white/40 text-[10px] italic">
                    "{episode.episode}"
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="text-midnight-pink/60 text-[9px] font-mono">
                      {Math.round(level.scrollStart * 100)}% → {Math.round(level.scrollEnd * 100)}%
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: episode.color }} />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
