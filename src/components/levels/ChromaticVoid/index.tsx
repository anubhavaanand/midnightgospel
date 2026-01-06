import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SimulatorPod from './SimulatorPod';
import FloatingTape from './FloatingTape';
import VoxelArtifact from '@components/interactive/VoxelArtifact';
import ChromaticRibbon from '@components/environment/ChromaticRibbon';

/**
 * Level 0: Chromatic Void
 * Redesigned for pitch black space with floating neon elements
 * 
 * The Chromatic Void is Clancy's home dimension - a colorful void
 * where he lives on the Chromatic Ribbon with his bio-organic simulator.
 */
interface ChromaticVoidProps {
  isActive: boolean;
}

/**
 * Floating particles - sparse cyan dots against black
 */
function SparseParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 100;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = Math.random() * -40 - 5;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#00ffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Neon Grid floor - cyberpunk aesthetic
 */
function NeonGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 2) % 2;
    }
  });

  return (
    <group position={[0, -8, -20]} rotation={[-Math.PI / 2, 0, 0]}>
      <gridHelper
        ref={gridRef}
        args={[100, 50, '#ff007f', '#2e004f']}
      />
    </group>
  );
}

export default function ChromaticVoid({ isActive }: ChromaticVoidProps) {
  if (!isActive) return null;

  return (
    <group>
      {/* Sparse floating particles */}
      <SparseParticles />

      {/* Neon grid for cyberpunk feel */}
      <NeonGrid />

      {/* Localized lighting - only on objects, not flooding the scene */}
      <pointLight position={[0, 2, 0]} intensity={2} color="#ff007f" distance={10} decay={2} />
      <pointLight position={[-8, 0, -10]} intensity={1.5} color="#00ffff" distance={15} decay={2} />
      <pointLight position={[8, 0, -10]} intensity={1.5} color="#2e004f" distance={15} decay={2} />

      {/* Simulator entry pod - center stage */}
      <SimulatorPod />

      {/* Floating tapes scattered in void */}
      <FloatingTape position={[-10, 4, -12]} rotation={[0.3, 0.5, 0.1]} scale={0.85} />
      <FloatingTape position={[8, -3, -14]} rotation={[-0.2, -0.3, 0.2]} scale={0.95} />
      <FloatingTape position={[3, 7, -10]} rotation={[0.1, 0.1, -0.3]} scale={0.75} />
      <FloatingTape position={[-6, -6, -16]} rotation={[0.4, 0, 0]} scale={1.05} />
      <FloatingTape position={[0, 0, -20]} rotation={[0.2, 0.4, -0.1]} scale={0.8} />

      {/* Interactive Glitch Artifact */}
      <VoxelArtifact position={[3, -1, -5]} scale={0.5} />

      {/* Chromatic Ribbons - the colorful bands of Clancy's dimension */}
      <ChromaticRibbon position={[0, 3, -20]} scale={0.8} />
      <ChromaticRibbon position={[-5, -2, -25]} scale={0.5} color1="#2e004f" color2="#00ffff" />
      <ChromaticRibbon position={[8, 5, -30]} scale={0.4} color1="#00ffff" color2="#ff007f" speed={0.7} />
    </group>
  );
}
