import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Floating tape props for the simulator hub.
 */
interface FloatingTapeProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export default function FloatingTape({ position, rotation = [0, 0, 0], scale = 1 }: FloatingTapeProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Bob and rotate slowly
    groupRef.current.position.y += Math.sin(clock.getElapsedTime() * 0.5) * 0.01;
    groupRef.current.rotation.z += 0.001;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Tape cassette body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.8, 0.3]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Left reel */}
      <mesh position={[-0.35, 0, 0.2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#ff007f" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Right reel */}
      <mesh position={[0.35, 0, 0.2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#00ffff" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Label */}
      <mesh position={[0, 0.1, 0.16]}>
        <planeGeometry args={[1, 0.4]} />
        <meshStandardMaterial color="#2e004f" />
      </mesh>
    </group>
  );
}
