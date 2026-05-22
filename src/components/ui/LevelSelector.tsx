import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useLevelStore } from '../../store/useLevelStore';
import { LEVELS, LevelId } from '../../data/levels';

const Portal = ({ levelId, position }: { levelId: LevelId; position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const setLevel = useLevelStore((state) => state.setLevel);
  const setTransitioning = useLevelStore((state) => state.setTransitioning);
  const isTransitioning = useLevelStore((state) => state.isTransitioning);
  
  const level = LEVELS.find(l => l.id === levelId);
  if (!level) return null;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (isTransitioning) return;
    
    setTransitioning(true);
    // Wait for the transition wipe to cover the screen (duration 0.8s, wait ~0.4s)
    setTimeout(() => {
      setLevel(levelId);
      setTransitioning(false);
    }, 500);
  };

  return (
    <group position={position}>
      <mesh 
        ref={meshRef} 
        onClick={handleClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <torusGeometry args={[1, 0.3, 16, 32]} />
        <meshStandardMaterial 
          color={level.palette.primary} 
          emissive={level.palette.bloom}
          emissiveIntensity={0.5}
          wireframe
        />
      </mesh>
      <Text
        position={[0, -2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {level.name}
      </Text>
    </group>
  );
};

export const LevelSelector: React.FC = () => {
  const episodes = [1, 2, 3, 4, 5, 6, 7, 8] as LevelId[];
  
  return (
    <group>
      {episodes.map((epId, index) => {
        const angle = (index / episodes.length) * Math.PI * 2;
        const radius = 8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return <Portal key={epId} levelId={epId} position={[x, 0, z]} />;
      })}
    </group>
  );
};
