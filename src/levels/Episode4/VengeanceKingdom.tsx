import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useLevelStore } from '../../store/useLevelStore';
import { useDialogueStore } from '../../store/useDialogueStore';
import './VengeanceKingdomShader';


const VengeanceKingdom: React.FC = () => {
  const materialRef = useRef<any>(null);
  const setLevel = useLevelStore((state) => state.setLevel);
  const setTransitioning = useLevelStore((state) => state.setTransitioning);
  const isTransitioning = useLevelStore((state) => state.isTransitioning);
  const openDialogue = useDialogueStore((state) => state.openDialogue);

  useFrame((state) => {
    if (materialRef.current) materialRef.current.uTime = state.clock.elapsedTime;
  });

  const handleBackToHub = (e: any) => {
    e.stopPropagation();
    if (isTransitioning) return;
    setTransitioning(true);
    setTimeout(() => { setLevel(0); setTransitioning(false); }, 500);
  };

  return (
    <group>
      <OrbitControls makeDefault maxDistance={20} minDistance={5} />
      <Environment preset="night" />
      
      <mesh position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); openDialogue(4); }} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#8B4513" wireframe />
      </mesh>

      <mesh>
        <icosahedronGeometry args={[15, 0]} />
        {/* @ts-ignore */}
        <vengeanceKingdomShaderMaterial ref={materialRef} side={THREE.BackSide} />
      </mesh>

      <group position={[0, -4, 5]}>
        <mesh onClick={handleBackToHub} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
          <boxGeometry args={[4, 1, 1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <Text position={[0, 0, 0.6]} fontSize={0.4} color="white" anchorX="center" anchorY="middle">Return to Hub</Text>
      </group>
    </group>
  );
};
export default VengeanceKingdom;
