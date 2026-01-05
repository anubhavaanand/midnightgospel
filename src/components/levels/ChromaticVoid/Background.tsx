import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ChromaticVoidMaterial } from '@shaders/ChromaticVoidMaterial';

/**
 * Chromatic Void background: animated procedural shader.
 */
export default function ChromaticVoidBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.side = THREE.DoubleSide;
    }
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.time = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -20]} scale={[100, 100, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        {...ChromaticVoidMaterial}
      />
    </mesh>
  );
}
