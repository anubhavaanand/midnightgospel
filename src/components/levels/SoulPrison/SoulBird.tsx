import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * SoulBird Component
 * 
 * A mystical flying entity (bird-like) that hovers over the skeletal landscape.
 * Represents transcendence, spiritual escape, or the soul's journey.
 * 
 * Design:
 * - Elegant, ethereal form (not threatening)
 * - Cyan (#00FFFF) glow suggests divine/spiritual energy
 * - Smooth, flowing animation (gentle curves)
 * - High contrast against dark landscape (focal point)
 * - Geometric simplicity (triangles/curves for wings)
 * 
 * Animation:
 * - Slow, graceful flight pattern
 * - Gentle hovering motion
 * - Pulsing glow (breathing effect)
 * - Orbits the focal skull
 * 
 * Visual Metaphor:
 * - Escape from prison
 * - Soul ascending
 * - Hope amid suffering
 * - Preparation for final revelation
 */

export default function SoulBird() {
  const birdRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state: any) => {
    if (birdRef.current) {
      timeRef.current += state.delta;

      // Orbital flight pattern
      const orbitSpeed = 0.5;
      const orbitRadius = 8;
      const angle = timeRef.current * orbitSpeed;

      birdRef.current.position.x = Math.cos(angle) * orbitRadius;
      birdRef.current.position.y = 4 + Math.sin(timeRef.current * 1.2) * 2;
      birdRef.current.position.z = Math.sin(angle) * orbitRadius - 8;

      // Look toward center
      birdRef.current.lookAt(0, 3, -8);

      // Pulsing glow
      const children = birdRef.current.children;
      children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          const pulse = Math.sin(timeRef.current * 2) * 0.3 + 0.7;
          child.material.emissiveIntensity = pulse;
        }
      });
    }
  });

  return (
    <group ref={birdRef} position={[8, 4, 0]} castShadow>
      {/* Body - elongated form */}
      <mesh castShadow>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#00FFFF"
          emissiveIntensity={0.8}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Head - smaller sphere */}
      <mesh position={[0, 0.5, 0.6]} castShadow>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#00FFFF"
          emissiveIntensity={0.9}
          roughness={0.25}
          metalness={0.5}
        />
      </mesh>

      {/* Left wing */}
      <mesh position={[-1, 0, 0]} rotation={[0, 0, 0.4]} scale={[1.2, 0.3, 0.6]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#FF007F"
          emissiveIntensity={0.6}
          roughness={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Right wing */}
      <mesh position={[1, 0, 0]} rotation={[0, 0, -0.4]} scale={[1.2, 0.3, 0.6]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#FF007F"
          emissiveIntensity={0.6}
          roughness={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Tail streamer */}
      <mesh position={[0, -0.5, -1.2]} scale={[0.4, 0.2, 1.5]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#00FFFF"
          emissiveIntensity={0.7}
          roughness={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Energy aura - particle-like effect */}
      <mesh castShadow>
        <octahedronGeometry args={[1.5, 2]} />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#00FFFF"
          emissiveIntensity={0.4}
          roughness={0.6}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}
