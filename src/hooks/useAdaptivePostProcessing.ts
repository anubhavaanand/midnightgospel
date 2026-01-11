/**
 * Adaptive Post-Processing System
 * 
 * Automatically disables expensive effects on low-FPS devices
 * while maintaining visual quality on high-end hardware.
 */

import { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export interface PostProcessingQuality {
  bloom: boolean;
  chromatic: boolean;
  noise: boolean;
  glitch: boolean;
  quality: 'high' | 'medium' | 'low';
}

/**
 * Hook for adaptive post-processing based on FPS
 */
export const useAdaptivePostProcessing = (
  targetFPS: number = 60,
  lowFPSThreshold: number = 30
): PostProcessingQuality => {
  const [quality, setQuality] = useState<PostProcessingQuality>({
    bloom: true,
    chromatic: true,
    noise: true,
    glitch: true,
    quality: 'high',
  });

  const fpsBufferRef = useRef<number[]>([]);
  const lastCheckTimeRef = useRef(0);
  const currentQualityRef = useRef<PostProcessingQuality['quality']>('high');

  useFrame((_state) => {
    const currentTime = performance.now();

    // Calculate FPS
    fpsBufferRef.current.push(currentTime);
    if (fpsBufferRef.current.length > 60) fpsBufferRef.current.shift();

    // Throttle checks to once every 1000ms
    if (currentTime - lastCheckTimeRef.current < 1000) return;
    lastCheckTimeRef.current = currentTime;

    if (fpsBufferRef.current.length >= 30) {
      const frameTimes: number[] = [];
      for (let i = 1; i < fpsBufferRef.current.length; i++) {
        frameTimes.push(fpsBufferRef.current[i] - fpsBufferRef.current[i - 1]);
      }

      const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      const currentFPS = 1000 / avgFrameTime;

      let newQuality: PostProcessingQuality['quality'] = 'high';

      if (currentFPS < lowFPSThreshold) {
        newQuality = 'low';
      } else if (currentFPS < targetFPS * 0.8) {
        newQuality = 'medium';
      }

      // Only update state if quality tier changes
      if (newQuality !== currentQualityRef.current) {
        currentQualityRef.current = newQuality;

        if (newQuality === 'low') {
          setQuality({ bloom: false, chromatic: false, noise: false, glitch: false, quality: 'low' });
        } else if (newQuality === 'medium') {
          setQuality({ bloom: true, chromatic: false, noise: true, glitch: false, quality: 'medium' }); // Keep bloom on medium
        } else {
          setQuality({ bloom: true, chromatic: true, noise: true, glitch: true, quality: 'high' });
        }
      }
    }
  });

  return quality;
};

/**
 * Hook for device capability detection
 */
export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    isMobile: false,
    isLowEnd: false,
    maxMemory: 512, // MB
    isLowMemory: false,
  });

  useEffect(() => {
    // Detect mobile
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    // Detect memory
    const memory = (performance as any).memory
      ? ((performance as any).memory.jsHeapSizeLimit || 536870912) / (1024 * 1024)
      : 512;

    setCapabilities({
      isMobile,
      isLowEnd: isMobile || memory < 256,
      maxMemory: Math.round(memory),
      isLowMemory: memory < 256,
    });
  }, []);

  return capabilities;
};
