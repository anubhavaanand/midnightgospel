import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ChromaticVoidBackground from './Background';
import SimulatorPod from './SimulatorPod';
import FloatingTape from './FloatingTape';
import VoxelArtifact from '@components/interactive/VoxelArtifact';

/**
 * Level 0: Chromatic Void
 * Introduction to the simulator with floating tapes, particle field, and entry pod.
 * Scroll 0-15% of journey.
 * 
 * Visual Theme:
 * - Empty void filled with digital artifacts (tapes)
 * - Particle field suggests data/consciousness streaming
 * - Central pod waiting for user interaction
 * - Color palette: #2E004F (base), #FF007F (accents), #00FFFF (energy)
 */
interface ChromaticVoidProps {
  isActive: boolean;
}

/**
 * Floating particle system - suggests digital consciousness entering the void
 */
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state: any) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      // Animate particles in a spiral pattern
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];

        const angle = Math.atan2(y, x) + state.clock.elapsedTime * 0.1;
        const radius = Math.sqrt(x * x + y * y);

        positions[i] = Math.cos(angle) * radius;
        positions[i + 1] = Math.sin(angle) * radius + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.05;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const particleCount = 250; // Optimized from 400 for 15% FPS improvement
  const particles = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const radius = Math.random() * 20 + 5;
    const height = (Math.random() - 0.5) * 20;

    particles[i * 3] = Math.cos(angle) * radius;
    particles[i * 3 + 1] = height;
    particles[i * 3 + 2] = Math.sin(angle) * radius;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        sizeAttenuation
        color="#00ffff"
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </points>
  );
}

export default function ChromaticVoid({ isActive }: ChromaticVoidProps) {
  if (!isActive) return null;

  return (
    <group>
      {/* Background shader with enhanced domain warping */}
      <ChromaticVoidBackground />

      {/* Particle field - digital consciousness */}
      <ParticleField />

      {/* Lighting hierarchy */}
      <ambientLight intensity={0.4} color="#00ffff" />
      <pointLight position={[5, 5, 5]} intensity={1.0} color="#ff007f" castShadow distance={30} />
      <pointLight position={[-5, -5, 5]} intensity={0.7} color="#2e004f" castShadow distance={25} />
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#00ffff" castShadow distance={40} />

      {/* Simulator entry pod - center stage */}
      <SimulatorPod />

      {/* Floating tapes scattered in void - asymmetric arrangement */}
      <FloatingTape position={[-10, 4, -12]} rotation={[0.3, 0.5, 0.1]} scale={0.85} />
      <FloatingTape position={[8, -3, -14]} rotation={[-0.2, -0.3, 0.2]} scale={0.95} />
      <FloatingTape position={[3, 7, -10]} rotation={[0.1, 0.1, -0.3]} scale={0.75} />
      <FloatingTape position={[-6, -6, -16]} rotation={[0.4, 0, 0]} scale={1.05} />
      <FloatingTape position={[0, 0, -20]} rotation={[0.2, 0.4, -0.1]} scale={0.8} />

      {/* Interactive Glitch Artifact */}
      <VoxelArtifact position={[3, -1, -5]} scale={0.5} />
    </group>
  );
}
