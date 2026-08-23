import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Sparkles, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useLevelStore } from '../../store/useLevelStore';
import { useDialogueStore } from '../../store/useDialogueStore';
import { NPCAttentionCatcher } from '../../components/scene/NPCAttentionCatcher';
import { KineticDialogue } from '../../components/scene/KineticDialogue';
import { CircusTent, MeatClowns, Balloons, CarouselRing, MysteryEgg, ClownFlock } from './ClownWorldProps';
import './BabyClownShader';

const BabyClown: React.FC = () => {
  const materialRef = useRef<any>(null);
  const clancyRef = useRef<THREE.Group>(null);
  const setLevel = useLevelStore((state) => state.setLevel);
  const setTransitioning = useLevelStore((state) => state.setTransitioning);
  const isTransitioning = useLevelStore((state) => state.isTransitioning);
  const openDialogue = useDialogueStore((state) => state.openDialogue);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (materialRef.current) {
      materialRef.current.uTime = time;
    }
    // Animate Clancy Avatar
    if (clancyRef.current) {
      clancyRef.current.rotation.y = time * 0.2;
      clancyRef.current.position.y = -0.6 + Math.sin(time * 0.5) * 0.1;
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

      {/* UNIQUE CLANCY AVATAR (Glowing Pastel Clown Balloon Canine) */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4} position={[0, -0.6, 4.5]}>
        <group ref={clancyRef}>
          {/* Body capsule */}
          <mesh castShadow>
            <cylinderGeometry args={[0.35, 0.35, 1.2, 16]} />
            <meshStandardMaterial 
              color="#FFFACD" 
              emissive="#FFFACD" 
              emissiveIntensity={1.5}
              roughness={0.2}
              metalness={0.5}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Balloon Ears */}
          <mesh position={[-0.4, 0.6, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#FFB6C1" emissive="#FFB6C1" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[0.4, 0.6, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#FFB6C1" emissive="#FFB6C1" emissiveIntensity={1.5} />
          </mesh>
          {/* Main sphere head */}
          <mesh position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial 
              color="#FFB6C1" 
              emissive="#FFB6C1" 
              emissiveIntensity={2.0}
              roughness={0.1}
            />
          </mesh>
          {/* Orbiting bubble ring */}
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[0.6, 0.02, 8, 32]} />
            <meshBasicMaterial color="#FF69B4" transparent opacity={0.7} />
          </mesh>
        </group>
      </Float>

      {/* Undulating Pastel Terrain */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2, 0]}
        onPointerMove={(e) => {
          e.stopPropagation();
          if (e.uv && materialRef.current) {
            materialRef.current.uMouse.copy(e.uv);
          }
        }}
        onPointerOut={() => {
          if (materialRef.current) {
            materialRef.current.uMouse.set(-9999, -9999);
          }
        }}
      >
        <planeGeometry args={[100, 100, 128, 128]} />
        <babyClownShaderMaterial ref={materialRef} side={THREE.DoubleSide} />
      </mesh>

      {/* Return to Hub Portal */}
      <group position={[0, -1.0, 8]}>
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
          <mesh onClick={handleBackToHub} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
            <boxGeometry args={[3.2, 0.4, 1.2]} />
            <meshStandardMaterial color="#424242" emissive="#FF69B4" emissiveIntensity={0.6} roughness={0.3} />
          </mesh>
          <Text position={[0, 0.5, 0]} fontSize={0.35} color="white" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000">
            Return to Hub
          </Text>
        </Float>
      </group>

      {/* Proximity Dialogue and Attention Catchers */}
      <NPCAttentionCatcher npcPosition={[0, 2.0, 0]} npcName="Baby Clown King" targetLevelId={2} />
      <KineticDialogue position={[0, 4.2, 0]} />

      {/* Clown World set dressing */}
      <CircusTent position={[-11, -2, -12]} />
      <MeatClowns count={6} />
      <ClownFlock count={6} />
      <Balloons />
      <CarouselRing position={[9, -1.6, 4]} />
      <MysteryEgg position={[-4, -1.7, 3]} />

      {/* Carnival lighting accents */}
      <pointLight position={[-8, 5, 2]} intensity={40} color="#FF69B4" distance={20} />
      <pointLight position={[9, 6, -6]} intensity={35} color="#00CED1" distance={18} />

      {/* Thematic Grid Platform */}
      <gridHelper args={[60, 40, '#FFB6C1', '#FFFACD']} position={[0, -1.95, 0]} />
    </group>
  );
};
export default BabyClown;
