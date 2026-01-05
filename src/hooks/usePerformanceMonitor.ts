/**
 * usePerformanceMonitor Hook
 * 
 * Integrates performance profiling into the R3F render loop
 * Tracks metrics and detects bottlenecks for optimization
 */

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { profiler, type PerformanceMetrics } from '@utils/performanceProfiler';

interface PerformanceThresholds {
  fpsTarget: number; // Target FPS (default 60)
  frameBudget: number; // Target frame time in ms (default 16.67 for 60 FPS)
  gpuBudget: number; // Max GPU time budget (default 10ms)
  memoryLimit: number; // Max memory before warning (default 256MB)
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  fpsTarget: 60,
  frameBudget: 16.67,
  gpuBudget: 10,
  memoryLimit: 256,
};

export const usePerformanceMonitor = (
  thresholds: Partial<PerformanceThresholds> = {},
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
) => {
  const config = { ...DEFAULT_THRESHOLDS, ...thresholds };
  const reportIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const metricsRef = useRef<PerformanceMetrics | null>(null);

  useFrame(() => {
    // Record frame time
    profiler.recordFrame();

    // Update metrics
    metricsRef.current = profiler.getMetrics();
    onMetricsUpdate?.(metricsRef.current);

    // Log warnings for performance issues
    if (metricsRef.current.frameTime > config.frameBudget) {
      console.warn(
        `[Performance] Frame time exceeded budget: ${metricsRef.current.frameTime}ms > ${config.frameBudget}ms`
      );
    }

    if (metricsRef.current.fps < 30) {
      console.warn(`[Performance] Low FPS detected: ${metricsRef.current.fps}`);
    }

    if (metricsRef.current.memoryUsed > config.memoryLimit) {
      console.warn(
        `[Performance] Memory usage high: ${metricsRef.current.memoryUsed}MB > ${config.memoryLimit}MB`
      );
    }
  });

  // Setup periodic reporting
  useEffect(() => {
    reportIntervalRef.current = setInterval(() => {
      const stats = profiler.getFrameStats();
      const metrics = profiler.getMetrics();

      console.log('[Performance Report]', {
        fps: metrics.fps,
        frameTime: metrics.frameTime,
        samples: stats.frameCount,
        p95: stats.P95FrameTime,
        p99: stats.P99FrameTime,
        memory: metrics.memoryUsed,
      });
    }, 10000); // Report every 10 seconds

    return () => {
      if (reportIntervalRef.current) {
        clearInterval(reportIntervalRef.current);
      }
    };
  }, []);

  return {
    getMetrics: () => metricsRef.current,
    getReport: () => profiler.generateReport(),
    reset: () => profiler.reset(),
  };
};
