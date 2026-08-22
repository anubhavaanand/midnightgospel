import React, { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Resize, Float, Center } from '@react-three/drei';
import * as THREE from 'three';
import { LevelSelector } from '../../components/ui/LevelSelector';
import { useDialogueStore } from '../../store/useDialogueStore';
import { NPCAttentionCatcher } from '../../components/scene/NPCAttentionCatcher';
import { HubDecorations } from './HubDecorations';
import './ChromaticShader';

const SpaceIsland = ({ position }: { position: [number, number, number] }) => {
  const { scene } = useGLTF('/models/space_exploration.glb');
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2} position={position}>
      <Resize scale={4}>
        <primitive object={clonedScene} />
      </Resize>
    </Float>
  );
};

const CenterIsland = () => {
  const { scene } = useGLTF('/models/island_in_the_space.glb');
  
  return (
    <group position={[0, 0, 0]}>
      <Resize scale={10}>
        <Center>
          <primitive object={scene} />
        </Center>
      </Resize>
    </group>
  );
};


const ChromaticRibbon: React.FC = () => {
  const materialRef = useRef<any>(null);
  const openDialogue = useDialogueStore((state) => state.openDialogue);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <group>
      <OrbitControls makeDefault maxDistance={20} minDistance={3} enablePan={false} maxPolarAngle={Math.PI / 2.5} />
      <Environment preset="city" />
      
      {/* The Central Island (Click to open dialogue) */}
      <Suspense fallback={null}>
        <group onClick={(e) => { e.stopPropagation(); openDialogue(0); }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}>
          <CenterIsland />
        </group>
      </Suspense>

      {/* The Background Ribbon */}
      <mesh>
        <torusGeometry args={[15, 3, 32, 64]} />
        <chromaticShaderMaterial ref={materialRef} side={THREE.BackSide} />
      </mesh>

      {/* Diegetic Portals */}
      <LevelSelector />

      <NPCAttentionCatcher npcPosition={[0, 0, 0]} npcName="Clancy" targetLevelId={0} />

      {/* Randomly Placed Space Islands */}
      <Suspense fallback={null}>
        <SpaceIsland position={[8, 5, -8]} />
        <SpaceIsland position={[-10, -3, -12]} />
        <SpaceIsland position={[4, -8, 10]} />
      </Suspense>

      {/* Mobius halo + cyber orbs + mini planets (additive decorations) */}
      <HubDecorations />
    </group>
  );
};

export default ChromaticRibbon;
