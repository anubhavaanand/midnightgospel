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

  useFrame(() => {
    const currentTime = performance.now();
    fpsBufferRef.current = [...fpsBufferRef.current, currentTime];

    // Keep last 60 frame timestamps
    if (fpsBufferRef.current.length > 60) {
      fpsBufferRef.current.shift();
    }

    // Calculate average frame time over last 60 frames
    if (fpsBufferRef.current.length >= 30) {
      const frameTimes: number[] = [];
      for (let i = 1; i < fpsBufferRef.current.length; i++) {
        frameTimes.push(fpsBufferRef.current[i] - fpsBufferRef.current[i - 1]);
      }

      const avgFrameTime =
        frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      const currentFPS = 1000 / avgFrameTime;

      // Adapt quality based on FPS
      if (currentFPS < lowFPSThreshold) {
        setQuality({
          bloom: false,
          chromatic: false,
          noise: false,
          glitch: false,
          quality: 'low',
        });
      } else if (currentFPS < targetFPS * 0.8) {
        setQuality({
          bloom: false,
          chromatic: false,
          noise: true,
          glitch: false,
          quality: 'medium',
        });
      } else {
        setQuality({
          bloom: true,
          chromatic: true,
          noise: true,
          glitch: true,
          quality: 'high',
        });
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
