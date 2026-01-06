import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
// import SimulatorPod from './SimulatorPod';
// import FloatingTape from './FloatingTape';
// import VoxelArtifact from '@components/interactive/VoxelArtifact';
// import Ribbon from '@components/environment/Ribbon';

interface ChromaticVoidProps {
  isActive: boolean;
}

export default function ChromaticVoid({ isActive }: ChromaticVoidProps) {
  if (!isActive) return null;

  return (
    <group>
      {/* EVERYTHING DISABLED FOR BLACK VOID TEST */}

      {/* 
      <SparseParticles />
      <NeonGrid />
      
      <pointLight position={[0, 2, 0]} intensity={2} color="#ff007f" distance={10} decay={2} />
      <pointLight position={[-8, 0, -10]} intensity={1.5} color="#00ffff" distance={15} decay={2} />
      <pointLight position={[8, 0, -10]} intensity={1.5} color="#2e004f" distance={15} decay={2} />

      <SimulatorPod />

      <FloatingTape position={[-10, 4, -12]} rotation={[0.3, 0.5, 0.1]} scale={0.85} />
      <FloatingTape position={[8, -3, -14]} rotation={[-0.2, -0.3, 0.2]} scale={0.95} />
      <FloatingTape position={[3, 7, -10]} rotation={[0.1, 0.1, -0.3]} scale={0.75} />
      <FloatingTape position={[-6, -6, -16]} rotation={[0.4, 0, 0]} scale={1.05} />
      <FloatingTape position={[0, 0, -20]} rotation={[0.2, 0.4, -0.1]} scale={0.8} />

      <VoxelArtifact position={[3, -1, -5]} scale={0.5} />
      */}

    </group>
  );
}
