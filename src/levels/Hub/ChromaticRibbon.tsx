import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { LevelSelector } from '../../components/ui/LevelSelector';
import { useDialogueStore } from '../../store/useDialogueStore';
import './ChromaticShader';


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
      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} maxDistance={20} minDistance={5} />
      <Environment preset="city" />
      
      {/* The Central Entity (Clancy placeholder) */}
      <mesh position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); openDialogue(0); }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}>
        <octahedronGeometry args={[2, 0]} />
        <meshStandardMaterial color="#FF00FF" wireframe />
      </mesh>

      {/* The Background Ribbon */}
      <mesh>
        <torusGeometry args={[15, 3, 64, 128]} />
        {/* @ts-ignore - custom shader material */}
        <chromaticShaderMaterial ref={materialRef} side={THREE.BackSide} />
      </mesh>

      {/* Diegetic Portals */}
      <LevelSelector />
    </group>
  );
};

export default ChromaticRibbon;
