import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SkeletalLandscape from './SkeletalLandscape';
import SoulBird from './SoulBird';

/**
 * Blinded by My End - Level 4 (Episode 4)
 * 
 * Theme: Forgiveness, Listening, Warmth
 * Visual: Warm, healing glow against the darkness.
 */

export default function BlindedByEnd({ isActive, scrollProgress }: { isActive: boolean; scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const particlePositions = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // ... (rest of particle logic same as original, omitted for brevity if I could, but I must provide valid replacement)
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return positions;
  }, []);

  const particleGeometry = useMemo(
    () => new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(particlePositions, 3)),
    [particlePositions]
  );

  useFrame((state: any) => {
    if (groupRef.current && isActive) {
      timeRef.current += state.delta;

      // Update camera fog - Warm/Orange fog
      // state.camera.fog = new THREE.Fog(0x331100, 30, 90);

      // Gentle pulsing
      const pulse = Math.sin(timeRef.current * 2.0) * 0.1 + 0.9;
      if (groupRef.current.scale) {
        groupRef.current.scale.setScalar(pulse);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient Light - Warm Glow */}
      <ambientLight color="#ff9900" intensity={0.4} />

      {/* Rim Light 1 - Orange/Gold */}
      <pointLight position={[10, 5, 5]} color="#ffcc00" intensity={0.8} distance={40} />

      {/* Rim Light 2 - Soft Pink */}
      <pointLight position={[-10, 8, -5]} color="#ff6699" intensity={0.6} distance={40} />

      {/* Central Radiance */}
      <pointLight position={[0, 0, 0]} color="#ffffff" intensity={0.5} distance={20} />

      {/* Reusing SkeletalLandscape but it will look different with this lighting */}
      <SkeletalLandscape />

      {/* Soul Bird - acts as the listener */}
      <SoulBird />

      {/* Particles - Embers/Gold Dust */}
      <points geometry={particleGeometry} position={[0, 0, 0]}>
        <pointsMaterial
          color="#ffcc00"
          size={0.2}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Ground reference plane - warm reflection */}
      <mesh position={[0, -2, -8]} rotation={[-Math.PI / 2, 0, 0]} scale={[60, 60, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#441100"
          emissive="#ff4400"
          emissiveIntensity={0.2}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}
