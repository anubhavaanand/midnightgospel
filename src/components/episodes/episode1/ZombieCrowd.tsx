import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDialogueStore } from '../../../store/useDialogueStore';

const CROWD_SIZE = 100;

export const ZombieCrowd: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Initialize random positions and phases for the crowd
  const zombiesData = useMemo(() => {
    const data = [];
    for (let i = 0; i < CROWD_SIZE; i++) {
      // Position them in a circle around the center (Little President)
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 15;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const phaseOffset = Math.random() * Math.PI * 2;
      data.push({ x, z, phaseOffset });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const { bass, treble } = useDialogueStore.getState().audioMetrics;
    const time = state.clock.elapsedTime;

    zombiesData.forEach((zombie, i) => {
      // Basic position
      dummy.position.set(zombie.x, -2, zombie.z);
      
      // Face the center (0,0,0)
      dummy.lookAt(0, -2, 0);

      // Bounce based on bass and treble
      const jumpHeight = Math.max(0, Math.sin(time * 5 + zombie.phaseOffset)) * (bass * 2.0);
      dummy.position.y = -2 + jumpHeight;

      // Scale based on treble
      const scale = 1.0 + treble * 0.5 * Math.sin(time * 10 + zombie.phaseOffset);
      dummy.scale.setScalar(scale);

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, CROWD_SIZE]}>
      {/* Simple low-poly representation of a zombie */}
      <boxGeometry args={[0.5, 1.5, 0.5]} />
      <meshStandardMaterial color="#2d4a22" roughness={0.8} />
    </instancedMesh>
  );
};
