import { useState } from 'react';
import { useSceneStore } from '@store/sceneStore';
import { LEVEL_RANGES } from '@utils/constants';

/**
 * Glassmorphism navigation panel for level selection.
 */
export default function NavigationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const setActiveLevel = useSceneStore((state) => state.setActiveLevel);

  const handleLevelSelect = (levelIndex: number) => {
    setActiveLevel(levelIndex);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-8 right-8 z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button text-midnight-pink font-bold tracking-wider"
      >
        ☰ LEVELS
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 glass-panel p-4 w-56 space-y-2">
          {LEVEL_RANGES.map((level) => (
            <button
              key={level.level}
              onClick={() => handleLevelSelect(level.level)}
              className="w-full text-left glass-panel p-2 hover:bg-white/30 transition-all"
            >
              <div className="text-midnight-cyan text-xs">LEVEL {level.level + 1}</div>
              <div className="text-midnight-light text-sm font-semibold">{level.name}</div>
              <div className="text-midnight-pink/60 text-xs mt-1">
                {Math.round(level.scrollStart * 100)}% - {Math.round(level.scrollEnd * 100)}%
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
