import { Canvas, useLoader } from '@react-three/fiber';
import { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
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
import ReloadPrompt from '@components/ui/ReloadPrompt';

// Phase 6 Components
import SpaceBackground from '@components/environment/SpaceBackground';
import SolarSystemHub from '@components/levels/SolarSystemHub';
import SpaceTravelTransition from '@components/effects/SpaceTravelTransition';
import CinematicIntro, { CinematicIntroOverlay, useIntroState } from '@components/intro/CinematicIntro';
import MiniMap3D from '@components/ui/MiniMap3D';

// Store
import { useSceneStore } from '@store/sceneStore';

/**
 * SimulatorApp - The 3D scroll-driven multiverse simulator
 * This is the main 3D experience component, accessed via /simulator route
 */
export default function SimulatorApp() {
  const mobileConfig = useDeviceDetection();
  const viewportConfig = getMobileViewportConfig(mobileConfig);

  // Phase 6: Hub navigation state
  const showHub = useSceneStore((state) => state.showHub);
  const isInTransition = useSceneStore((state) => state.isInTransition);
  const introCompleted = useSceneStore((state) => state.introCompleted);
  const setIntroCompleted = useSceneStore((state) => state.setIntroCompleted);
  const setIsInTransition = useSceneStore((state) => state.setIsInTransition);
  const setIsLoading = useSceneStore((state) => state.setIsLoading);
  const navigateToLevel = useSceneStore((state) => state.navigateToLevel);
  const activeLevel = useSceneStore((state) => state.activeLevel);

  // Intro state from localStorage
  const { hasSeenIntro, markIntroSeen } = useIntroState();
  const [showIntro, setShowIntro] = useState(!hasSeenIntro);
  const [introProgress] = useState(0);

  // Ref for cleanup of transition timer
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize analytics and monitoring on app mount
  useEffect(() => {
    initializeAnalytics();
    initializeSEO();
    injectStructuredData();
    setupErrorTracking();
    trackPerformanceMetrics();

    trackEvent(analyticsEvents.APP_LOADED, {
      environment: import.meta.env.VITE_ENV,
      timestamp: new Date().toISOString(),
    });

    // Mark intro completed if already seen
    if (hasSeenIntro) {
      setShowIntro(false);
      setIntroCompleted(true);
    }

    // Clear loading state after a brief delay for canvas to initialize
    const loadingTimer = setTimeout(() => setIsLoading(false), 1000);

    console.log('✅ Simulator initialized');

    return () => clearTimeout(loadingTimer);
  }, [hasSeenIntro, setIntroCompleted, setIsLoading]);

  // Handle intro completion
  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    markIntroSeen();
    setIntroCompleted(true);
  }, [markIntroSeen, setIntroCompleted]);

  // Handle planet selection from hub
  const handleSelectPlanet = useCallback((levelId: number) => {
    navigateToLevel(levelId);
    // Clear any pending transition timer before starting a new one
    if (transitionTimerRef.current !== null) clearTimeout(transitionTimerRef.current);
    // Transition will complete after duration
    transitionTimerRef.current = setTimeout(() => {
      setIsInTransition(false);
    }, 2500);
  }, [navigateToLevel, setIsInTransition]);

  // Cleanup transition timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  // Handle transition complete
  const handleTransitionComplete = useCallback(() => {
    setIsInTransition(false);
  }, [setIsInTransition]);

  // Determine camera position based on mode
  const cameraPosition = (showHub ? [0, 20, 60] : [0, 0, viewportConfig.cameraDistance]) as [number, number, number];
  const fov = showHub ? 45 : viewportConfig.fov;

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <ReloadPrompt />
      <Canvas
        camera={{
          position: cameraPosition,
          fov: fov
        }}
        gl={{
          antialias: !mobileConfig.isLowEnd,
          alpha: false,
          preserveDrawingBuffer: false, // enable only when a screenshot is requested
          powerPreference: mobileConfig.isLowEnd ? 'low-power' : 'default',
          pixelRatio: mobileConfig.dpr,
        }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Controls for Hub Mode */}
          {showHub && introCompleted && !isInTransition && (
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={20}
              maxDistance={100}
              maxPolarAngle={Math.PI / 2}
              autoRotate={true}
              autoRotateSpeed={0.5}
            />
          )}

          {/* Controls for Levels - User Feedback Zoom/Scroll */}
          {!showHub && !isInTransition && (
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={5}
              maxDistance={30}
              maxPolarAngle={Math.PI / 1.5}
              enableDamping={true}
              dampingFactor={0.05}
            />
          )}

          {/* Phase 6: Cosmic background always visible */}
          <SpaceBackground particleCount={mobileConfig.isLowEnd ? 2000 : 5000} />

          {/* Cinematic intro camera animation */}
          {showIntro && !introCompleted && (
            <CinematicIntro onComplete={handleIntroComplete} />
          )}

          {/* Solar System Hub mode */}
          {showHub && introCompleted && !isInTransition && (
            <SolarSystemHub
              onSelectPlanet={handleSelectPlanet}
              currentLevel={activeLevel}
            />
          )}

          {/* Space travel transition effect */}
          <SpaceTravelTransition
            isActive={isInTransition}
            onComplete={handleTransitionComplete}
          />

          {/* Main level experience */}
          {!showHub && !isInTransition && (
            <>
              <Scene />
              <PostProcessingEffects />
            </>
          )}
        </Suspense>
      </Canvas >

      {/* Intro overlay */}
      {
        showIntro && (
          <CinematicIntroOverlay
            isVisible={showIntro}
            progress={introProgress}
            onSkip={handleIntroComplete}
          />
        )
      }

      {/* UI Components - only show when not in intro or hub */}
      {
        introCompleted && !showHub && !isInTransition && (
          <>
            <HUD />
            <MobileUI />
          </>
        )
      }

      {/* 3D Mini-Map - show when in levels */}
      {
        introCompleted && !showHub && !isInTransition && (
          <MiniMap3D onQuickTravel={handleSelectPlanet} />
        )
      }

      <Loading />
    </div >
  );
}

// Preload critical 3D assets for smooth transitions
useGLTF.preload('/models/sci-fi-alien-city/source/alien_city.glb');
// Preload black hole FBX using the correct FBXLoader
useLoader.preload(FBXLoader, '/models/black-hole/source/black_hole.fbx');
