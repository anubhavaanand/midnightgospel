import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import Scene from '@components/Scene';
import PostProcessingEffects from '@components/effects/PostProcessingEffects';
import Loading from '@components/ui/Loading';
import HUD from '@components/ui/HUD';
import MobileUI from '@components/ui/MobileUI';
import { useDeviceDetection } from '@hooks/useMobileResponsive';
import { getMobileViewportConfig } from '@utils/mobileConfig';
import {
  initializeAnalytics,
  setupErrorTracking,
  trackPerformanceMetrics,
  trackEvent,
  analyticsEvents
} from '@utils/analytics';
import { initializeSEO, injectStructuredData } from '@utils/seo';

/**
 * SimulatorApp - The 3D scroll-driven multiverse simulator
 * This is the main 3D experience component, accessed via /simulator route
 */
export default function SimulatorApp() {
  const mobileConfig = useDeviceDetection();
  const viewportConfig = getMobileViewportConfig(mobileConfig);

  // Initialize analytics and monitoring on app mount
  useEffect(() => {
    // Analytics initialization
    initializeAnalytics();
    initializeSEO();
    injectStructuredData();
    setupErrorTracking();
    trackPerformanceMetrics();

    // Track app load
    trackEvent(analyticsEvents.APP_LOADED, {
      environment: import.meta.env.VITE_ENV,
      timestamp: new Date().toISOString(),
    });

    console.log('✅ Simulator initialized');
  }, []);

  return (
    <div className="w-full h-screen bg-midnight-dark relative overflow-hidden">
      <Canvas
        camera={{
          position: [0, 0, viewportConfig.cameraDistance],
          fov: viewportConfig.fov
        }}
        gl={{
          antialias: !mobileConfig.isLowEnd,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: mobileConfig.isLowEnd ? 'low-power' : 'default',
          pixelRatio: mobileConfig.dpr,
        }}
      >
        <Suspense fallback={null}>
          <Scene />
          <PostProcessingEffects />
        </Suspense>
      </Canvas>
      <HUD />
      <MobileUI />
      <Loading />
    </div>
  );
}
