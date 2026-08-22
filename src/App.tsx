import { useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { SimulatorRouter } from './components/scene/SimulatorRouter';
import { TransitionWipe } from './components/ui/TransitionWipe';
import { DialogueOverlay } from './components/ui/DialogueOverlay';
import { MoodSync } from './components/scene/MoodSync';
import { TouchJoystick } from './components/ui/TouchJoystick';
import { HubDialogueComputer } from './components/ui/HubDialogueComputer';
import { KineticDialogue } from './components/scene/KineticDialogue';
import { LayoutOverlay } from './components/ui/LayoutOverlay';
import { NavigationMenu } from './components/ui/NavigationMenu';
import { ScrollEngine } from './components/scene/ScrollEngine';
import { AudioListener } from './components/audio/AudioListener';
import { AudioAnalyzerNode } from './components/audio/AudioAnalyzerNode';
import { Effects } from './components/scene/Effects';
import { LevelAtmosphere } from './components/scene/LevelAtmosphere';
import CinematicIntro, { CinematicIntroOverlay } from './components/intro/CinematicIntro';
import { useIntroState } from './components/intro/useIntroState';

const WebGLFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-black text-white text-center p-8">
    <div>
      <h1 className="text-3xl font-bold mb-4 text-fuchsia-500">WebGL 2.0 Required</h1>
      <p className="text-gray-400">Your browser or device does not support WebGL 2.0, which is required to enter the simulation.</p>
    </div>
  </div>
);

function App() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const { hasSeenIntro, markIntroSeen } = useIntroState();
  const [introActive, setIntroActive] = useState(!hasSeenIntro);
  const [introProgress, setIntroProgress] = useState(0);

  // Sync intro progress from the 3D component via a custom event
  useEffect(() => {
    const handleProgress = (e: CustomEvent<number>) => setIntroProgress(e.detail);
    window.addEventListener('cinematic-intro-progress', handleProgress as EventListener);
    return () => window.removeEventListener('cinematic-intro-progress', handleProgress as EventListener);
  }, []);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const handleIntroComplete = useCallback(() => {
    markIntroSeen();
    setIntroActive(false);
  }, [markIntroSeen]);

  const handleIntroSkip = useCallback(() => {
    markIntroSeen();
    setIntroActive(false);
  }, [markIntroSeen]);

  if (!hasWebGL) {
    return <WebGLFallback />;
  }

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative font-mono-diagnostic">
      {/* HUD & Overlay layers */}
      <LayoutOverlay />
      <NavigationMenu />
      
      <HubDialogueComputer />
      <TransitionWipe />
      <DialogueOverlay />
      <TouchJoystick />

      {/* Cinematic Intro Overlay (2D) */}
      <CinematicIntroOverlay
        isVisible={introActive}
        progress={introProgress}
        onSkip={handleIntroSkip}
      />
      
      <Canvas
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={window.devicePixelRatio}
        onCreated={(state) => {
          // Debug hooks for automated QA
          (window as any).__r3f = state;
          state.gl.domElement.addEventListener('webglcontextlost', (e: Event) => {
            console.error('WEBGL_CONTEXT_LOST', e);
          });
        }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <AudioListener />
        <AudioAnalyzerNode />
        <LevelAtmosphere />
        <Effects />
        <MoodSync />
        <KineticDialogue />

        {/* Cinematic Intro (3D camera animation) */}
        {introActive && (
          <CinematicIntro
            duration={6000}
            onComplete={handleIntroComplete}
          />
        )}
        
        {/* Hub & Level Router - only after intro completes */}
        {!introActive && (
          <>
            <ScrollEngine />
            <SimulatorRouter />
          </>
        )}
      </Canvas>
    </div>
  );
}

export default App;
