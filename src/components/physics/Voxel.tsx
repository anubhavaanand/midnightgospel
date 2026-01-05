import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Single voxel cube with physics properties.
 */
interface VoxelProps {
  position: [number, number, number];
  color: string;
  isPhysical: boolean;
  onDestroy?: () => void;
}

export default function Voxel({ position, color, isPhysical, onDestroy }: VoxelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocityRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const [isDestroyed, setIsDestroyed] = useState(false);

  useEffect(() => {
    if (meshRef.current && isPhysical) {
      (meshRef.current as any).userData.isPhysicsObject = true;
    }
  }, [isPhysical]);

  useFrame(() => {
    if (!meshRef.current || isDestroyed || !isPhysical) return;

    // Simple gravity simulation
    velocityRef.current.y -= 0.01;
    meshRef.current.position.add(velocityRef.current);

    // Bounce off ground
    if (meshRef.current.position.y < -50) {
      velocityRef.current.y *= -0.8;
      meshRef.current.position.y = -50;
    }
  });

  const handlePointerDown = () => {
    if (!isPhysical) return;

    // Apply upward impulse on click
    velocityRef.current.y = 0.5;
    velocityRef.current.x = (Math.random() - 0.5) * 0.2;
    velocityRef.current.z = (Math.random() - 0.5) * 0.2;

    // Fade out and destroy
    setTimeout(() => {
      setIsDestroyed(true);
      onDestroy?.();
    }, 1000);
  };

  if (isDestroyed) return null;

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerDown={handlePointerDown}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial
        color={color}
        metalness={0.4}
        roughness={0.6}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}
