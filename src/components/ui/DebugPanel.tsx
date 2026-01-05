import { useSceneStore } from '@store/sceneStore';

/**
 * Info panel showing performance metrics and current state.
 */
export default function DebugPanel() {
  const scrollProgress = useSceneStore((state) => state.scrollProgress);
  const activeLevel = useSceneStore((state) => state.activeLevel);
  const cameraMode = useSceneStore((state) => state.cameraMode);
  const metrics = useSceneStore((state) => state.performanceMetrics);


  const fps = metrics?.fps ?? 60;
  const fpsColor = fps > 50 ? 'text-green-400' : fps > 30 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="fixed bottom-8 left-8 glass-panel p-4 text-midnight-light text-xs font-mono space-y-1">
      <div>SCROLL: {(scrollProgress * 100).toFixed(1)}%</div>
      <div>LEVEL: {activeLevel}</div>
      <div>CAMERA: {cameraMode.toUpperCase()}</div>
      <div>FPS: <span className={fpsColor}>{fps.toFixed(1)}</span></div>
      <div>FRAME: <span className="text-midnight-cyan">{metrics?.frameTime?.toFixed(2) ?? '16.67'}ms</span></div>
      <div>GPU: <span className="text-midnight-pink">{metrics?.gpuTime?.toFixed(2) ?? '10.00'}ms</span></div>
      <div>MEM: <span className="text-midnight-purple">{metrics?.memoryUsed ?? 128}MB</span></div>
    </div>
  );
}
