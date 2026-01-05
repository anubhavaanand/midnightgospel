import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * DistortedBuilding Component
 * A warped, decaying White House structure representing governmental chaos.
 * 
 * Design Principles (Liam Cobb):
 * - Smooth lines with consistent corner radii
 * - Logical geometry despite surrealism
 * - Navigable space (characters can move through)
 * - Visual metaphor: warping = institutional breakdown
 */

export default function DistortedBuilding() {
  const buildingRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state: any) => {
    if (buildingRef.current) {
      timeRef.current += state.delta;
      
      // Subtle continuous warping to suggest decay/instability
      const children = buildingRef.current.children;
      children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          const offset = Math.sin(timeRef.current * 0.3 + index * 0.2) * 0.02;
          child.position.y += offset - child.position.y * 0.001;
        }
      });
    }
  });

  return (
    <group ref={buildingRef} position={[0, -2, -5]}>
      {/* Main building structure - warped rectangular form */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 6, 4]} />
        <meshStandardMaterial
          color="#F0E68C"
          roughness={0.4}
          metalness={0.1}
          emissive="#FF007F"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Left wing - fractured and tilted */}
      <mesh position={[-5, 1.5, 0]} rotation={[0, 0, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[3, 5, 3.5]} />
        <meshStandardMaterial
          color="#D3A574"
          roughness={0.5}
          emissive="#FF007F"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Right wing - more fractured */}
      <mesh position={[5, 0.8, 0]} rotation={[0, 0, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[3, 4.5, 3.5]} />
        <meshStandardMaterial
          color="#C19A6B"
          roughness={0.6}
          emissive="#FF007F"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Central tower - twisted upward */}
      <mesh position={[0, 5, 0]} scale={[0.7, 1.3, 0.7]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2.2, 3, 8]} />
        <meshStandardMaterial
          color="#DAA520"
          roughness={0.45}
          emissive="#FF007F"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Dome crown - fractured/broken */}
      <mesh position={[0, 7.2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.8, 16, 8]} />
        <meshStandardMaterial
          color="#B8860B"
          roughness={0.5}
          metalness={0.2}
          emissive="#00FFFF"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Decayed roof fragments */}
      <mesh position={[-2, 8, -1]} rotation={[0.3, 0.5, 0.2]} scale={[0.8, 0.2, 0.6]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial
          color="#654321"
          roughness={0.8}
          emissive="#FF007F"
          emissiveIntensity={0.08}
        />
      </mesh>

      <mesh position={[3, 7.5, 1]} rotation={[-0.2, -0.3, -0.1]} scale={[0.7, 0.15, 0.5]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial
          color="#5C4033"
          roughness={0.85}
          emissive="#FF007F"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Windows - dark voids suggesting emptiness/hollowness */}
      {/* Grid of window openings */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <mesh
            key={`window-${row}-${col}`}
            position={[-2.8 + col * 1.9, 3 + row * 1.5, 2.05]}
            castShadow
          >
            <boxGeometry args={[0.6, 0.8, 0.1]} />
            <meshStandardMaterial
              color="#0A0E27"
              roughness={0.9}
              emissive="#2E004F"
              emissiveIntensity={0.3}
            />
          </mesh>
        ))
      )}

      {/* Cracks/fissures in main structure */}
      <mesh position={[1, 3, 2.05]} castShadow>
        <boxGeometry args={[0.15, 2, 0.1]} />
        <meshStandardMaterial
          color="#000000"
          roughness={1}
          emissive="#FF007F"
          emissiveIntensity={0.12}
        />
      </mesh>

      <mesh position={[-2, 1, 2.05]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial
          color="#000000"
          roughness={1}
          emissive="#FF007F"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}
