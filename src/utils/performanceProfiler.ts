/**
 * Performance Profiling Utility
 * 
 * Measures FPS, GPU time, memory usage, and render frame times
 * to establish baseline metrics and identify bottlenecks.
 */

interface PerformanceMetrics {
  fps: number;
  frameTime: number; // ms
  gpuTime: number; // ms estimate
  memoryUsed: number; // MB
  timeoutMs: number;
  isLowPerformance: boolean;
}

interface FrameStats {
  frameCount: number;
  totalFrameTime: number;
  maxFrameTime: number;
  minFrameTime: number;
  samples: number[];
}

class PerformanceProfiler {
  private frameStats: FrameStats = {
    frameCount: 0,
    totalFrameTime: 0,
    maxFrameTime: 0,
    minFrameTime: Infinity,
    samples: [],
  };

  private lastTime: number = performance.now();
  private metricsWindow: number[] = [];
  private readonly WINDOW_SIZE = 60; // 1 second at 60 FPS

  /**
   * Record a frame render time
   */
  recordFrame(): void {
    const now = performance.now();
    const frameTime = now - this.lastTime;
    this.lastTime = now;

    this.frameStats.frameCount++;
    this.frameStats.totalFrameTime += frameTime;
    this.frameStats.maxFrameTime = Math.max(this.frameStats.maxFrameTime, frameTime);
    this.frameStats.minFrameTime = Math.min(this.frameStats.minFrameTime, frameTime);
    this.frameStats.samples.push(frameTime);

    // Keep only recent samples
    if (this.frameStats.samples.length > 300) {
      this.frameStats.samples.shift();
    }

    this.metricsWindow.push(frameTime);
    if (this.metricsWindow.length > this.WINDOW_SIZE) {
      this.metricsWindow.shift();
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    const avgFrameTime = this.metricsWindow.length > 0
      ? this.metricsWindow.reduce((a, b) => a + b, 0) / this.metricsWindow.length
      : 0;

    const fps = avgFrameTime > 0 ? 1000 / avgFrameTime : 0;

    // Estimate GPU time as portion of frame time
    const gpuTime = avgFrameTime * 0.6; // Rough estimate: GPU is ~60% of frame

    // Estimate memory usage (rough approximation)
    const memoryEstimate = (performance as any).memory
      ? ((performance as any).memory.usedJSHeapSize || 0) / (1024 * 1024)
      : 0;

    const isLowPerformance = fps < 30; // Below 30 FPS is low

    return {
      fps: Math.round(fps * 10) / 10,
      frameTime: Math.round(avgFrameTime * 10) / 10,
      gpuTime: Math.round(gpuTime * 10) / 10,
      memoryUsed: Math.round(memoryEstimate),
      timeoutMs: Math.round(avgFrameTime),
      isLowPerformance,
    };
  }

  /**
   * Get detailed frame statistics
   */
  getFrameStats() {
    return {
      ...this.frameStats,
      averageFrameTime: this.frameStats.frameCount > 0
        ? this.frameStats.totalFrameTime / this.frameStats.frameCount
        : 0,
      P95FrameTime: this.calculatePercentile(0.95),
      P99FrameTime: this.calculatePercentile(0.99),
    };
  }

  /**
   * Calculate percentile from samples
   */
  private calculatePercentile(percentile: number): number {
    if (this.frameStats.samples.length === 0) return 0;
    const sorted = [...this.frameStats.samples].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * percentile) - 1;
    return Math.round(sorted[Math.max(0, index)] * 10) / 10;
  }

  /**
   * Reset statistics
   */
  reset(): void {
    this.frameStats = {
      frameCount: 0,
      totalFrameTime: 0,
      maxFrameTime: 0,
      minFrameTime: Infinity,
      samples: [],
    };
    this.metricsWindow = [];
    this.lastTime = performance.now();
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const metrics = this.getMetrics();
    const stats = this.getFrameStats();

    return `
=== Midnight Gospel 3D Performance Report ===

FPS: ${metrics.fps} (${metrics.isLowPerformance ? '⚠️ LOW' : '✓ GOOD'})
Frame Time: ${metrics.frameTime}ms
GPU Time (est): ${metrics.gpuTime}ms
Memory Used: ${metrics.memoryUsed}MB

Frame Statistics (${stats.frameCount} frames):
- Average: ${Math.round(stats.averageFrameTime * 10) / 10}ms
- Min: ${Math.round(stats.minFrameTime * 10) / 10}ms
- Max: ${Math.round(stats.maxFrameTime * 10) / 10}ms
- P95: ${stats.P95FrameTime}ms
- P99: ${stats.P99FrameTime}ms
    `.trim();
  }
}

export const profiler = new PerformanceProfiler();
export type { PerformanceMetrics, FrameStats };
