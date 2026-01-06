import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SimulatorPod from './SimulatorPod';
import FloatingTape from './FloatingTape';
import VoxelArtifact from '@components/interactive/VoxelArtifact';

interface ChromaticVoidProps {
  isActive: boolean;
}

function SparseParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 150;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = Math.random() * -50 + 10;
  }
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02;
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
        size={0.1}
        color="#00ffff"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ChromaticVoid({ isActive }: ChromaticVoidProps) {
  if (!isActive) return null;
  console.log('☢️ CHROMATIC VOID LEVEL 0 RELOADED - BLACK MODE');

  return (
    <group>
      <SparseParticles />
      <pointLight position={[0, 5, -5]} intensity={2} color="#ff007f" distance={20} decay={2} />
      <pointLight position={[-10, 0, -10]} intensity={1.5} color="#00ffff" distance={20} decay={2} />
      <pointLight position={[10, 2, -15]} intensity={1.5} color="#2e004f" distance={20} decay={2} />
      <SimulatorPod />
      <VoxelArtifact position={[3, -1, -5]} scale={0.5} />
      <FloatingTape position={[-10, 4, -12]} rotation={[0.3, 0.5, 0.1]} scale={0.85} />
      <FloatingTape position={[8, -3, -14]} rotation={[-0.2, -0.3, 0.2]} scale={0.95} />
      <FloatingTape position={[3, 7, -10]} rotation={[0.1, 0.1, -0.3]} scale={0.75} />
      <FloatingTape position={[0, 0, -20]} rotation={[0.2, 0.4, -0.1]} scale={0.8} />
      {/* NO RIBBONS to ensure Black Background */}
    </group>
  );
}
