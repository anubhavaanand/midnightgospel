import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WaterMaterial } from './WaterMaterial';

/**
 * FishBowl Component
 * 
 * The containing environment - a spherical bowl/tank filled with animated water.
 * Creates the sensation of being inside an aquarium.
 * 
 * Design:
 * - Large sphere (bowl rim)
 * - Water plane inside with wave animation
 * - Non-Euclidean feeling (distorted geometry hints)
 * - Cyan (#00FFFF) dominant with purple shadows
 * 
 * Visual Effect:
 * - Water moves organically
 * - Glass/barrier suggested by transparency
 * - Space cats float inside
 * - Creates sense of containment (contrasts with "escape" theme)
 */

export default function FishBowl() {
  const waterRef = useRef<THREE.Mesh>(null);
  const waterMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const timeRef = useRef(0);

  useFrame((state) => {
    // @ts-expect-error - delta exists on state at runtime
    timeRef.current += state.delta;

    // Animate water shader
    if (waterMaterialRef.current && waterMaterialRef.current.uniforms) {
      waterMaterialRef.current.uniforms.time.value = timeRef.current;
    }

    // Gentle rotation of entire bowl
    if (waterRef.current) {
      // @ts-expect-error - delta exists on state at runtime
      waterRef.current.rotation.z += state.delta * 0.05;
    }
  });

  // Create water material
  const waterMat = new WaterMaterial();
  waterMaterialRef.current = waterMat;

  return (
    <group position={[0, 0, -5]}>
      {/* Outer bowl rim - transparent glass suggestion */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[20, 32, 32]} />
        <meshStandardMaterial
          color="#2E004F"
          roughness={0.6}
          metalness={0.3}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Water volume - animated surface */}
      <mesh
        ref={waterRef}
        position={[0, -5, 0]}
        scale={[20, 0.5, 20]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[1, 1, 64, 64]} />
        <primitive object={waterMat} attach="material" />
      </mesh>

      {/* Alternative: Sphere water surface (more bowl-like) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[19.5, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#00FFFF"
          emissiveIntensity={0.1}
          transparent
          opacity={0.3}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Bottom of bowl - suggests ground */}
      <mesh position={[0, -18, 0]} receiveShadow>
        <sphereGeometry args={[19.5, 32, 16, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5]} />
        <meshStandardMaterial
          color="#0A0E27"
          emissive="#2E004F"
          emissiveIntensity={0.2}
          roughness={0.9}
        />
      </mesh>

      {/* Light rays - suggest underwater lighting */}
      <mesh position={[8, 5, -8]} scale={[2, 20, 2]}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#00FFFF"
          emissiveIntensity={0.2}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[-8, 5, -8]} scale={[2, 20, 2]}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#00FFFF"
          emissiveIntensity={0.2}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Particles in water (dust/debris) */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={`light-ray-${i}`} position={[Math.cos(i) * 10, -5 + i * 3, -8]} scale={[1.5, 15, 1.5]}>
          <cylinderGeometry args={[0.8, 0.8, 1, 6]} />
          <meshStandardMaterial
            color="#00FFFF"
            emissive="#00FFFF"
            emissiveIntensity={0.15}
            transparent
            opacity={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
