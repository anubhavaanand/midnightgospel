import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * GrindingMechanism Component
 * 
 * A rotating meat grinder metaphor for institutional machinery consuming individuals.
 * The spinning blades, pulsing center, and vortex effect suggest entropy/loss of control.
 * 
 * Design Principles:
 * - Smooth cylindrical forms (house style: no hard edges)
 * - Continuous rotation + pulsing for kinetic energy
 * - Pink (#FF007F) for "meat" / organic destruction
 * - Purple (#2E004F) for cold machinery
 * - Cyan (#00FFFF) for error/digital breakdown
 * 
 * Visual Metaphor: "Grinding Down"
 * - Blades rotating inward
 * - Vortex pulls entities toward center
 * - Pulsing suggests consumption/processing
 */

export default function GrindingMechanism() {
  const mechanismRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state: any) => {
    if (mechanismRef.current) {
      timeRef.current += state.delta;

      // Main rotation - continuous spinning
      mechanismRef.current.rotation.z = timeRef.current * 2.0;

      // Pulsing scale for grinding effect
      const pulse = Math.sin(timeRef.current * 3.0) * 0.05 + 1.0;
      mechanismRef.current.scale.set(pulse, 1, pulse);
    }
  });

  return (
    <group ref={mechanismRef} position={[0, 0, -5]}>
      {/* Main grinder cylinder body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[4, 4, 2, 32]} />
        <meshStandardMaterial
          color="#2E004F"
          roughness={0.3}
          metalness={0.7}
          emissive="#FF007F"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Top rim - decorative ring */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <torusGeometry args={[4.2, 0.3, 8, 32]} />
        <meshStandardMaterial
          color="#FF007F"
          roughness={0.4}
          metalness={0.6}
          emissive="#FF007F"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Bottom rim */}
      <mesh position={[0, -1.05, 0]} castShadow>
        <torusGeometry args={[4.2, 0.3, 8, 32]} />
        <meshStandardMaterial
          color="#FF007F"
          roughness={0.4}
          metalness={0.6}
          emissive="#FF007F"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Grinding blades - 4 rotating inward */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={`blade-${i}`}
          position={[0, 0, 0]}
          rotation={[0, (i / 4) * Math.PI * 2, 0]}
          castShadow
        >
          {/* Blade shape - thin elongated form */}
          <boxGeometry args={[0.3, 3, 0.1]} />
          <meshStandardMaterial
            color="#FF007F"
            roughness={0.5}
            metalness={0.5}
            emissive="#FF007F"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Center vortex cone - suggests pull/suction */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <coneGeometry args={[2, 1.5, 32]} />
        <meshStandardMaterial
          color="#00FFFF"
          roughness={0.8}
          emissive="#00FFFF"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Interior spiral grooves for mechanical detail */}
      {[0, 1, 2].map((ring) => (
        <mesh key={`groove-${ring}`} position={[0, 0.3 - ring * 0.5, 0]}>
          <torusGeometry args={[3.5 - ring * 0.3, 0.15, 8, 16]} />
          <meshStandardMaterial
            color="#0A0E27"
            roughness={0.9}
            emissive="#2E004F"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Danger indicator lights (8 around perimeter) */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 4.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <mesh key={`light-${i}`} position={[x, 1.2, z]} castShadow>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial
              color="#FF007F"
              emissive="#FF007F"
              emissiveIntensity={0.8}
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}
