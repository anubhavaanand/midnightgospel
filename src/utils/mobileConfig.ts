/**
 * Mobile Canvas Configuration
 * 
 * Optimized Three.js/R3F settings for mobile devices.
 * Reduces memory, improves battery life, maintains visual quality.
 */

import { CanvasProps } from '@react-three/fiber';
import { useDeviceDetection } from '@hooks/useMobileResponsive';

export const useMobileCanvasConfig = (): Partial<CanvasProps> => {
  const config = useDeviceDetection();

  const canvasConfig: Partial<CanvasProps> = {
    camera: {
      position: [0, 0, 10],
      fov: config.isMobile ? 50 : 45, // Wider FOV on mobile
    },
    gl: {
      antialias: !config.isLowEnd,
      alpha: true,
      preserveDrawingBuffer: false,
      powerPreference: config.isLowEnd ? 'low-power' : 'default',
      pixelRatio: config.dpr,
      precision: config.isMobile ? 'lowp' : 'highp',
      logarithmicDepthBuffer: false,
      stencil: false,
      premultipliedAlpha: true,
      depth: true,
      failIfMajorPerformanceCaveat: true,
    } as any,
  };

  return canvasConfig;
};

/**
 * Get adaptive shadow settings based on device
 */
export const getAdaptiveShadowConfig = (config: ReturnType<typeof useDeviceDetection>) => {
  return {
    enabled: config.isTablet || !config.isMobile,
    mapSize: config.shadowMapSize,
    normalBias: config.isMobile ? 0.05 : 0.01,
    bias: config.isMobile ? 0.002 : 0.0001,
  };
};

/**
 * Get adaptive post-processing settings
 */
export const getAdaptivePostProcessing = (config: ReturnType<typeof useDeviceDetection>) => {
  if (!config.enablePostProcessing) {
    return {
      bloom: false,
      chromatic: false,
      noise: false,
      glitch: false,
    };
  }

  if (config.isLowEnd) {
    return {
      bloom: false,
      chromatic: false,
      noise: true,
      glitch: false,
    };
  }

  if (config.isMobile) {
    return {
      bloom: true,
      chromatic: false,
      noise: true,
      glitch: false,
    };
  }

  // Desktop/tablet
  return {
    bloom: true,
    chromatic: true,
    noise: true,
    glitch: true,
  };
};

/**
 * Get particle count based on device
 */
export const getParticleMultiplier = (config: ReturnType<typeof useDeviceDetection>): number => {
  return config.particleQuality;
};

/**
 * Viewport configuration for mobile
 */
export const getMobileViewportConfig = (config: ReturnType<typeof useDeviceDetection>) => {
  const isMediumMobile = config.viewportWidth >= 480 && config.viewportWidth < 768;

  return {
    width: config.viewportWidth,
    height: config.viewportHeight,
    dpr: config.dpr,
    // Adjust FOV for different screen sizes
    fov: config.isMobile ? (isMediumMobile ? 48 : 50) : 45,
    // Camera position adjustment
    cameraDistance: config.isLowEnd ? 12 : 10,
  };
};
