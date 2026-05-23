import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Float, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useLevelStore } from '../../store/useLevelStore';
import './ZombieShader';

const ZombieCapitol: React.FC = () => {
  const materialRef = useRef<any>(null);
  const coreRef = useRef<THREE.Group>(null);
  const setLevel = useLevelStore((state) => state.setLevel);
  const setTransitioning = useLevelStore((state) => state.setTransitioning);
  const isTransitioning = useLevelStore((state) => state.isTransitioning);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      coreRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  const handleBackToHub = (e: any) => {
    e.stopPropagation();
    if (isTransitioning) return;
    
    setTransitioning(true);
    setTimeout(() => {
      setLevel(0); // 0 is Hub LevelId
      setTransitioning(false);
    }, 500);
  };

  return (
    <group>
      <OrbitControls makeDefault maxDistance={30} minDistance={2} enablePan={false} />
      <Environment preset="night" />
      
      {/* Lighting to enhance the fleshy details */}
      <ambientLight intensity={0.4} color="#8e24aa" />
      <pointLight position={[0, 5, 0]} intensity={50} color="#ffb300" distance={20} />
      <pointLight position={[0, -5, 0]} intensity={30} color="#388e3c" distance={20} />
      
      {/* The Central Entity (Presidential Zombie / Glasses Man) */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <group ref={coreRef} position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); console.log("Clicked Glasses Man"); }}>
          {/* Main Body */}
          <mesh>
            <icosahedronGeometry args={[1.5, 4]} />
            <MeshDistortMaterial 
              color="#ff2a2a" 
              emissive="#5a0000"
              distort={0.4} 
              speed={3} 
              roughness={0.2} 
              metalness={0.8}
            />
          </mesh>
          
          {/* Orbiting corrupted debris */}
          {[...Array(8)].map((_, i) => (
            <mesh 
              key={i} 
              position={[
                Math.sin((i / 8) * Math.PI * 2) * 3, 
                Math.cos((i * 3)) * 1.5, 
                Math.cos((i / 8) * Math.PI * 2) * 3
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
            >
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              <meshStandardMaterial color="#8e24aa" roughness={0.1} metalness={0.9} />
            </mesh>
          ))}
        </group>
      </Float>

      {/* Chaotic particles in the air */}
      <Sparkles 
        count={300} 
        scale={20} 
        size={4} 
        speed={0.4} 
        opacity={0.6} 
        color="#388e3c" 
      />

      {/* The Background Fleshy Blob Dimension */}
      <mesh>
        <icosahedronGeometry args={[25, 32]} />
        {/* @ts-ignore - custom shader material */}
        <zombieShaderMaterial 
          ref={materialRef} 
          side={THREE.BackSide} 
          uSpeed={0.8}
          uDistortion={1.5}
        />
      </mesh>

      {/* Back to Hub Trigger Platform */}
      <group position={[0, -6, 8]}>
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
          <mesh 
            onClick={handleBackToHub}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[2.5, 2.0, 0.5, 32]} />
            <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
          </mesh>
          
          <mesh position={[0, 0.26, 0]}>
            <ringGeometry args={[1.5, 2.2, 32]} />
            <meshBasicMaterial color="#388e3c" side={THREE.DoubleSide} transparent opacity={0.5} />
          </mesh>

          <Text 
            position={[0, 1.2, 0]} 
            fontSize={0.4} 
            color="#ffb300" 
            anchorX="center" 
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000"
          >
            Return to Hub
          </Text>
        </Float>
      </group>
    </group>
  );
};

export default ZombieCapitol;
