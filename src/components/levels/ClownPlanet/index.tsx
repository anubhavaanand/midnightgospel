import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GrindingMechanism from './GrindingMechanism';
import ClownCrowd from './ClownCrowd';

/**
 * Level 2: Clown Planet (Officers & Wolves)
 * Scroll Progress: 35-55%
 *
 * Episode Theme: "Officers & Wolves"
 * - Clancy explores a surreal landscape of institutional machinery
 * - Visual metaphor: institutional grinding down of individuality
 * - The meat grinder symbolizes loss of personal agency
 *
 * Design Notes:
 * - Central grinding mechanism is focal point
 * - Clown crowd spirals toward center (entropy/inevitable processing)
 * - Particles suggest decay/transformation
 * - Color palette: Meat pink (#FF007F) dominant, machinery purple (#2E004F), error cyan (#00FFFF)
 *
 * Visual Hierarchy:
 * 1. Grinding mechanism (central, dominant)
 * 2. Clown crowd (surrounding, moving toward center)
 * 3. Grinding particles (detail, atmospheric)
 * 4. Overhead atmosphere (containment/claustrophobia)
 *
 * Thematic Notes:
 * - No threat, just inexorable processing
 * - Comedic despite dark metaphor (matches show's tone)
 * - Ground mechanics suggest solidity despite surrealism
 */

interface ClownPlanetProps {
  isActive: boolean;
  scrollProgress?: number;
}

/**
 * Grinding Particle System
 * Particles ejected from grinder suggest processed material
 */
function GrindingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 250;
  const particles = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const radius = Math.random() * 5 + 0.5;
    const height = Math.random() * 3 - 0.5;

    particles[i * 3] = Math.cos(angle) * radius;
    particles[i * 3 + 1] = height;
    particles[i * 3 + 2] = Math.sin(angle) * radius - 5;
  }

  useFrame((_state: any) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Radial ejection from center, downward drift
        const x = positions[i * 3];
        const z = positions[i * 3 + 2] + 5;

        const distance = Math.sqrt(x * x + z * z);
        if (distance > 0.1) {
          const angle = Math.atan2(z, x);
          const speed = 0.05;
          positions[i * 3] += Math.cos(angle) * speed;
          positions[i * 3 + 2] += Math.sin(angle) * speed - 5;
        }

        // Gravity - particles fall
        positions[i * 3 + 1] -= 0.02;

        // Reset particles that get too far or fall below
        if (distance > 15 || positions[i * 3 + 1] < -2) {
          const angle = (Math.random() * Math.PI * 2);
          const radius = Math.random() * 5 + 0.5;
          positions[i * 3] = Math.cos(angle) * radius;
          positions[i * 3 + 1] = Math.random() * 2 + 0.5;
          positions[i * 3 + 2] = Math.sin(angle) * radius - 5;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

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
        size={0.12}
        sizeAttenuation
        color="#FF007F"
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Atmosphere - chaotic color suggesting instability
 */
function ClownAtmosphere() {
  return (
    <mesh position={[0, 6, -20]} scale={[40, 20, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#FF7F7F"
        emissive="#FF007F"
        emissiveIntensity={0.12}
        roughness={1}
        side={THREE.BackSide}
        fog={false}
      />
    </mesh>
  );
}

export default function ClownPlanet({ isActive, scrollProgress }: ClownPlanetProps) {
  if (!isActive) return null;

  return (
    <group>
      {/* Background atmosphere - chaotic and carnival-like */}
      <ClownAtmosphere />

      {/* Lighting - mechanical, harsh, with entertainment touches */}
      <ambientLight intensity={0.7} color="#FF007F" />
      <pointLight
        position={[0, 6, 0]}
        intensity={1.3}
        color="#FF007F"
        castShadow
        distance={45}
      />
      <pointLight
        position={[-12, 2, -5]}
        intensity={0.9}
        color="#00FFFF"
        castShadow
        distance={35}
      />
      <pointLight
        position={[12, 2, -5]}
        intensity={0.7}
        color="#FF007F"
        castShadow
        distance={30}
      />

      {/* Main mechanical element - the grinder */}
      <GrindingMechanism />

      {/* Clown crowd - spiraling toward their fate */}
      <ClownCrowd />

      {/* Atmospheric particles from grinding */}
      <GrindingParticles />

      {/* Ground plane - solid despite chaos above */}
      <mesh position={[0, -0.8, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#2E004F"
          roughness={0.85}
          emissive="#2E004F"
          emissiveIntensity={0.2}
        />
      </mesh>


      {/* Optional: Stage lights for carnival atmosphere */}
      <mesh position={[-8, 8, -10]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial
          color="#FF007F"
          emissive="#FF007F"
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[8, 8, -10]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#00FFFF"
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}
