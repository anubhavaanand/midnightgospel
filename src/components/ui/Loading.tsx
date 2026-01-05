import { useSceneStore } from '@store/sceneStore';

export default function Loading() {
  const isLoading = useSceneStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-midnight-dark/80 backdrop-blur-sm pointer-events-none z-50">
      <div className="glass-panel p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-midnight-pink border-t-midnight-cyan rounded-full animate-spin" />
          <p className="text-midnight-light text-sm">Initializing Multiverse Simulator...</p>
        </div>
      </div>
    </div>
  );
}
