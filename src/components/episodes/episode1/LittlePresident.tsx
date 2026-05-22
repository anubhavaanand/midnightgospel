import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useDialogueStore } from '../../../store/useDialogueStore';

export const LittlePresident: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    const { bass, rms } = useDialogueStore.getState().audioMetrics;
    // Pulse based on audio metrics
    const scale = 1.0 + (bass * 0.4) + (rms * 0.2);
    
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef} position={[0, 1, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#ffaa00" />
    </mesh>
  );
};
