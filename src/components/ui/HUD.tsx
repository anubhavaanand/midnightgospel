import { useSceneStore } from '@store/sceneStore';
import { LEVEL_RANGES } from '@utils/constants';
import NavigationPanel from './NavigationPanel';
import DebugPanel from './DebugPanel';

/**
 * HUD overlay with level info and interactive elements.
 */
export default function HUD() {
  const activeLevel = useSceneStore((state) => state.activeLevel);
  const scrollProgress = useSceneStore((state) => state.scrollProgress);

  const currentLevel = LEVEL_RANGES[activeLevel];

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top-left: Level Info */}
      <div className="absolute top-8 left-8 glass-panel p-4 pointer-events-auto">
        <div className="text-midnight-cyan text-xs tracking-wider mb-2">LEVEL {activeLevel + 1}</div>
        <h2 className="text-midnight-pink text-lg font-bold">{currentLevel?.name}</h2>
        <div className="mt-2 w-32 h-1 bg-white/10 rounded overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-midnight-cyan to-midnight-pink transition-all duration-300"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>

      {/* Navigation Panel */}
      <NavigationPanel />

      {/* Debug Panel */}
      <DebugPanel />

      {/* Bottom-center: Scroll Hint (Level 0 only) */}
      {activeLevel === 0 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-panel p-4 pointer-events-auto animate-pulse">
          <p className="text-midnight-light text-sm text-center">↓ SCROLL TO BEGIN ↓</p>
        </div>
      )}
    </div>
  );
}
