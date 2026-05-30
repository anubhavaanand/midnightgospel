import { useEffect, useState } from 'react';
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
      
      <Canvas
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={window.devicePixelRatio} // Full native resolution for sharp text
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <AudioListener />
        <MoodSync />
        <KineticDialogue />
        
        {/* Spatial Depth Scrolling Driver */}
        <ScrollEngine />
        
        <SimulatorRouter />
      </Canvas>
    </div>
  );
}

export default App;
