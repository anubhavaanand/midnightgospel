import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import DistortedBuilding from './DistortedBuilding';
import ZombieCrowd from './ZombieCrowd';
import FloatingQuote from '@components/ui/FloatingQuote';
import { LEVEL_QUOTES } from '@utils/quotes';

/**
 * Level 1: Zombie Apocalypse (Taste of the King)
 * Scroll Progress: 15-35%
 *
 * Episode Theme: "Taste of the King"
 * - Clancy visits a decaying White House overrun by zombies
 * - Visual metaphor: governmental decay, loss of control, entropy
 * - The zombies are not threatening—they're pitiable, mindless shambling
 *
 * Design Notes (from Liam Cobb):
 * - Warped architecture suggests institutional breakdown
 * - Zombie crowd creates sense of scale and normalcy of chaos
 * - Color decay from institutional gold (#DAA520) to flesh tones to purple shadow
 * - Backgrounds comment on theme: emptiness, purposelessness, institutional collapse
 *
 * Visual Hierarchy:
 * 1. Warped building (focal point)
 * 2. Zombie crowd (scale/atmosphere)
 * 3. Decay particles (detail)
 * 4. Overhead sky (containment)
 */

interface ZombieApocalypseProps {
  isActive: boolean;
}

/**
 * Decay Particle System
 * Dust, debris, and decay particles floating from the building
 */
function DecayParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 200;
  const particles = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    particles[i * 3] = (Math.random() - 0.5) * 20;
    particles[i * 3 + 1] = Math.random() * 12 - 1;
    particles[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
  }

  useFrame((state: any) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Gentle downward drift with lateral movement
        positions[i * 3 + 1] -= 0.02;
        positions[i * 3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.01;

        // Reset particles that fall below
        if (positions[i * 3 + 1] < -3) {
          positions[i * 3 + 1] = 12;
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
        size={0.08}
        sizeAttenuation
        color="#2E004F"
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Sky/Atmosphere - subtle gradient suggesting containment/oppression
 */
function ApocalypseAtmosphere() {
  return (
    <mesh position={[0, 8, -20]} scale={[40, 20, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#2E004F"
        emissive="#FF007F"
        emissiveIntensity={0.1}
        roughness={1}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

export default function ZombieApocalypse({ isActive }: ZombieApocalypseProps) {
  if (!isActive) return null;

  return (
    <group>
      {/* Background atmosphere */}
      <ApocalypseAtmosphere />

      {/* Lighting - harsh, institutional */}
      <ambientLight intensity={0.6} color="#FF007F" />
      <pointLight
        position={[0, 8, 0]}
        intensity={1.2}
        color="#DAA520"
        castShadow
        distance={40}
      />
      <pointLight
        position={[-10, 3, -5]}
        intensity={0.8}
        color="#FF007F"
        castShadow
        distance={30}
      />
      <pointLight
        position={[10, 2, -5]}
        intensity={0.6}
        color="#00FFFF"
        castShadow
        distance={25}
      />

      {/* Main architectural element */}
      <DistortedBuilding />

      {/* Zombie crowd - hundreds of instances */}
      <ZombieCrowd />

      {/* Atmospheric decay particles */}
      <DecayParticles />

      {/* Ground plane */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#4A3728"
          roughness={0.8}
          emissive="#2E004F"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Floating Quotes */}
      {LEVEL_QUOTES.filter(q => q.level === 1).map((quote, i) => (
        <FloatingQuote
          key={i}
          {...quote}
          isActive={isActive}
        />
      ))}
    </group>
  );
}
