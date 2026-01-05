import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Floating pod (simulator entry point) with pulsing glow.
 */
export default function SimulatorPod() {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const time = clock.getElapsedTime();

    // Floating animation
    groupRef.current.position.y += Math.sin(time * 0.3) * 0.02;
    groupRef.current.rotation.y += 0.002;

    // Pulsing glow
    if (glowRef.current && glowRef.current.material instanceof THREE.MeshBasicMaterial) {
      const intensity = 0.5 + Math.sin(time * 2) * 0.3;
      (glowRef.current.material as any).opacity = intensity;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, -15]}>
      {/* Main pod body - organic vulva-like shape */}
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[1.5, 5]} />
        <meshStandardMaterial
          color="#ff007f"
          metalness={0.4}
          roughness={0.3}
          emissive="#ff007f"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Glow halo */}
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.8, 5]} />
        <meshBasicMaterial color="#ff007f" transparent opacity={0.4} fog={false} />
      </mesh>

      {/* Inner cavity */}
      <mesh position={[0, -0.2, 0]}>
        <coneGeometry args={[1, 1.5, 32]} />
        <meshStandardMaterial color="#2e004f" metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  );
}
