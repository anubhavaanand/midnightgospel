import { usePerformanceMonitor } from '@hooks/usePerformanceMonitor';
import { useSceneStore } from '@store/sceneStore';

/**
 * Component that runs inside Canvas to track performance metrics
 * and sync them to the global store for UI display.
 */
export default function PerformanceMonitor() {
    const setMetrics = useSceneStore((state) => state.setPerformanceMetrics);

    usePerformanceMonitor(
        { fpsTarget: 60, frameBudget: 16.67 },
        (newMetrics) => setMetrics(newMetrics)
    );

    return null;
}
