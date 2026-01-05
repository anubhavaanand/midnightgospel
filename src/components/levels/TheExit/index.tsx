import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ParticleExplosion from './ParticleExplosion';
import EgoFormations from './EgoFormations';

/**
 * The Exit - Level 5 (Final)
 * 
 * Location: 0.90-1.00 of scroll journey (climactic finale)
 * Episode Theme: "Annihilation of Joy" finale + series conclusion
 * 
 * Visual Philosophy:
 * - Transcendence through ego death
 * - Consciousness expansion into void
 * - Third eye opening (Hindu spiritual metaphor)
 * - Return to cosmic origin
 * - Celebration of impermanence and acceptance
 * 
 * Design Elements:
 * 1. ParticleExplosion: Massive consciousness burst (1200+ particles)
 * 2. EgoFormations: Geometric ego structures dissolving (100 rotating polyhedrons)
 * 3. Lighting: Chaos → order transition (overwhelm → peace)
 * 4. Atmosphere: Void fade (becoming one with infinite consciousness)
 * 5. Camera Moment: Final ascent (reaching third eye)
 * 
 * Color Palette (Strict Enforcement):
 * - Hot Pink: #FF007F (60% - explosive energy)
 * - Cyan Energy: #00FFFF (30% - divine consciousness)
 * - Deep Purple: #2E004F (10% - grounding base)
 * - White Highlights: #F0F0F0 (essence/pure consciousness)
 * - Black Void: #0A0E27 (background/infinity)
 * 
 * Performance Target: 10-15ms GPU time (60 FPS achievable)
 * Key Optimization: Instanced rendering for ego formations + single points draw call for particles
 * 
 * Animation Techniques:
 * - Particle spawning: Crescendo effect (acceleration of emission rate)
 * - Ego formations: Chaotic rotation (increasing speed over time)
 * - Lighting: Pulsing intensity (builds toward climax)
 * - Camera: Potential for Theatre.js final reveal (optional for Phase 3)
 * 
 * Narrative Function:
 * - Represents consciousness leaving the body
 * - Ego structures shattering into primordial energy
 * - Return to the infinite
 * - Series climax: Acceptance of impermanence
 */

export default function TheExit({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state: any) => {
    if (groupRef.current && isActive) {
      timeRef.current += state.delta;

      // Update camera fog for void effect
      state.camera.fog = new THREE.Fog(0x0a0e27, 20, 100);

      // Lighting crescendo - builds toward climax
      const crescendo = Math.min(timeRef.current / 3.0, 1.0); // Ramp up over 3 seconds
      const intensity = 0.3 + crescendo * 0.7; // 0.3 → 1.0

      // Update all lights
      const lights = groupRef.current.children.filter((c) => c instanceof THREE.Light);
      lights.forEach((light) => {
        if (light instanceof THREE.Light) {
          light.intensity = intensity;
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Ambient Light - Builds from darkness */}
      <ambientLight color="#00FFFF" intensity={0.3} />

      {/* Main Cyan Light - Consciousness activation */}
      <pointLight position={[0, 10, 0]} color="#00FFFF" intensity={0.6} distance={50} />

      {/* Pink Explosion Light - Ego dissolution energy */}
      <pointLight position={[15, 5, 5]} color="#FF007F" intensity={0.5} distance={40} />

      {/* Purple Base Light - Grounding anchor */}
      <pointLight position={[-15, 5, -5]} color="#2E004F" intensity={0.4} distance={35} />

      {/* Particle Explosion - Consciousness burst */}
      <ParticleExplosion />

      {/* Ego Formations - Geometric dissolution */}
      <EgoFormations />

      {/* Upper void plane - Represents infinite space */}
      <mesh position={[0, 20, 0]} scale={[100, 50, 100]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#0A0E27"
          emissive="#00FFFF"
          emissiveIntensity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Lower grounding plane - Earth/origin */}
      <mesh position={[0, -10, -8]} rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#2E004F"
          emissive="#FF007F"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Atmosphere sphere - Void surrounding consciousness */}
      <mesh position={[0, 0, 0]} scale={[150, 150, 150]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#0A0E27"
          emissive="#2E004F"
          emissiveIntensity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Center void - Pure consciousness emptiness */}
      <mesh position={[0, 5, -8]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial
          color="#F0F0F0"
          emissive="#00FFFF"
          emissiveIntensity={0.9}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Rim light energy - Cosmic consciousness glow */}
      <mesh position={[0, 15, 10]} rotation={[-0.3, 0, 0]} scale={[80, 60, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#00FFFF"
          transparent
          opacity={0.12}
          emissive="#FF007F"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}
