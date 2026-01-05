/**
 * Mobile Responsiveness Hook
 * 
 * Detects device capabilities and adjusts rendering/interaction for mobile.
 * Handles touch controls, adaptive quality, and viewport optimizations.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface MobileConfig {
  isMobile: boolean;
  isTablet: boolean;
  isLowEnd: boolean;
  touchEnabled: boolean;
  dpr: number;
  maxTextureSize: number;
  enablePostProcessing: boolean;
  particleQuality: number; // 0.5 = 50%, 1.0 = 100%
  shadowMapSize: 512 | 1024 | 2048;
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * Detect device capabilities and screen size
 */
export const useDeviceDetection = (): MobileConfig => {
  const [config, setConfig] = useState<MobileConfig>({
    isMobile: false,
    isTablet: false,
    isLowEnd: false,
    touchEnabled: false,
    dpr: 1,
    maxTextureSize: 2048,
    enablePostProcessing: true,
    particleQuality: 1,
    shadowMapSize: 1024,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  });

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const touchEnabled = () => {
        return (
          'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          (navigator as any).msMaxTouchPoints > 0
        );
      };

      // Device detection
      const isMobile =
        /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        ) && window.innerWidth < 768;

      const isTablet =
        /ipad|android(?!.*mobi)/i.test(userAgent) ||
        (window.innerWidth >= 768 && window.innerWidth < 1024);

      // Check for low-end device (older mobile, low RAM)
      const isLowEnd = 
        isMobile && 
        ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4);

      // Calculate device pixel ratio (cap at 2 for mobile)
      const dpr = Math.min(
        isMobile || isTablet ? 1.5 : 2,
        window.devicePixelRatio || 1
      );

      // Adaptive quality settings
      let maxTextureSize = 2048;
      let enablePostProcessing = true;
      let particleQuality = 1;
      let shadowMapSize: 512 | 1024 | 2048 = 1024;

      if (isLowEnd) {
        // Very low-end device
        maxTextureSize = 512;
        enablePostProcessing = false;
        particleQuality = 0.3;
        shadowMapSize = 512;
      } else if (isMobile) {
        // Standard mobile
        maxTextureSize = 1024;
        enablePostProcessing = true;
        particleQuality = 0.6;
        shadowMapSize = 512;
      } else if (isTablet) {
        // Tablet
        maxTextureSize = 1024;
        enablePostProcessing = true;
        particleQuality = 0.8;
        shadowMapSize = 1024;
      }

      setConfig({
        isMobile,
        isTablet,
        isLowEnd,
        touchEnabled: touchEnabled(),
        dpr,
        maxTextureSize,
        enablePostProcessing,
        particleQuality,
        shadowMapSize,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });
    };

    detectDevice();

    // Re-detect on resize
    const handleResize = () => {
      detectDevice();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return config;
};

/**
 * Hook for managing touch/swipe input on mobile
 */
export const useSwipeNavigation = (
  onSwipeUp: () => void,
  onSwipeDown: () => void
) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current || isLoading) return;

    const touch = e.changedTouches[0];
    const deltaY = touchStartRef.current.y - touch.clientY;
    const minSwipeDistance = 50;

    if (Math.abs(deltaY) > minSwipeDistance) {
      setIsLoading(true);
      if (deltaY > 0) {
        onSwipeUp();
      } else {
        onSwipeDown();
      }
      // Prevent rapid consecutive swipes
      setTimeout(() => setIsLoading(false), 300);
    }

    touchStartRef.current = null;
  }, [onSwipeUp, onSwipeDown, isLoading]);

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart, false);
    window.addEventListener('touchend', handleTouchEnd, false);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart, false);
      window.removeEventListener('touchend', handleTouchEnd, false);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return { isLoading };
};

/**
 * Hook for applying mobile-specific canvas settings
 */
export const useMobileCanvas = () => {
  const { gl } = useThree();
  const config = useDeviceDetection();

  useEffect(() => {
    // Set device pixel ratio
    gl.setPixelRatio(config.dpr);

    // Disable unnecessary features on mobile
    if (config.isMobile) {
      // Reduce shadow map resolution
      gl.shadowMap.type = THREE.PCFShadowMap;
      gl.shadowMap.enabled = false; // Disable shadows on mobile

      // Optimize for power consumption
      gl.autoClear = true;
      (gl as any).sortObjects = true;
    }

    // Optimize for tablet
    if (config.isTablet) {
      gl.shadowMap.type = THREE.PCFShadowMap;
      gl.shadowMap.enabled = true;
    }
  }, [config, gl]);

  return config;
};

/**
 * Hook for responsive font sizes
 */
export const useResponsiveText = () => {
  const [textScale, setTextScale] = useState(1);

  useEffect(() => {
    const updateTextScale = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setTextScale(0.7);
      } else if (width < 768) {
        setTextScale(0.85);
      } else if (width < 1024) {
        setTextScale(0.95);
      } else {
        setTextScale(1);
      }
    };

    updateTextScale();
    window.addEventListener('resize', updateTextScale);
    return () => window.removeEventListener('resize', updateTextScale);
  }, []);

  return textScale;
};
