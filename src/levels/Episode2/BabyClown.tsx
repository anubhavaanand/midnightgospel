import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Sparkles, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useLevelStore } from '../../store/useLevelStore';
import { useDialogueStore } from '../../store/useDialogueStore';
import './BabyClownShader';

const BabyClown: React.FC = () => {
  const materialRef = useRef<any>(null);
  const setLevel = useLevelStore((state) => state.setLevel);
  const setTransitioning = useLevelStore((state) => state.setTransitioning);
  const isTransitioning = useLevelStore((state) => state.isTransitioning);
  const openDialogue = useDialogueStore((state) => state.openDialogue);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      // Keep intensity gentle for a dreamlike wave
      materialRef.current.uIntensity = 0.5;
    }
  });

  const handleBackToHub = (e: any) => {
    e.stopPropagation();
    if (isTransitioning) return;
    setTransitioning(true);
    setTimeout(() => { setLevel(0); setTransitioning(false); }, 500);
  };

  return (
    <group>
      <OrbitControls makeDefault maxDistance={30} minDistance={5} maxPolarAngle={Math.PI / 2 - 0.1} />
      <Environment preset="sunset" />
      
      {/* Ambient Dream Particles */}
      <Sparkles count={200} scale={20} size={4} speed={0.4} opacity={0.6} color="#FFFACD" />
      <Sparkles count={100} scale={20} size={6} speed={0.2} opacity={0.4} color="#FFB6C1" />

      {/* Baby Clown Entity */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.5]}>
        <group position={[0, 2, 0]} 
               onClick={(e) => { e.stopPropagation(); openDialogue(2); }} 
               onPointerOver={() => document.body.style.cursor = 'pointer'} 
               onPointerOut={() => document.body.style.cursor = 'auto'}>
          <Sphere args={[1.5, 32, 32]}>
            <meshStandardMaterial color="#FFB6C1" roughness={0.2} metalness={0.1} envMapIntensity={2.0} />
          </Sphere>
          
          {/* Cute clown nose */}
          <Sphere args={[0.3, 16, 16]} position={[0, 0, 1.45]}>
            <meshStandardMaterial color="#FF0000" roughness={0.4} />
          </Sphere>
          
          {/* Eyes */}
          <Sphere args={[0.15, 16, 16]} position={[-0.5, 0.5, 1.3]}>
            <meshStandardMaterial color="#000000" roughness={0.1} />
          </Sphere>
          <Sphere args={[0.15, 16, 16]} position={[0.5, 0.5, 1.3]}>
            <meshStandardMaterial color="#000000" roughness={0.1} />
          </Sphere>
        </group>
      </Float>

      {/* Undulating Pastel Terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[100, 100, 128, 128]} />
        {/* @ts-ignore */}
        <babyClownShaderMaterial ref={materialRef} side={THREE.DoubleSide} />
      </mesh>

      {/* Return to Hub Portal */}
      <group position={[0, -1, 8]}>
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
          <mesh onClick={handleBackToHub} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
            <boxGeometry args={[3, 0.5, 1]} />
            <meshStandardMaterial color="#FF69B4" emissive="#FF1493" emissiveIntensity={0.5} />
          </mesh>
          <Text position={[0, 0.6, 0]} fontSize={0.4} color="white" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000">
            Return to Hub
          </Text>
        </Float>
      </group>
    </group>
  );
};
export default BabyClown;
