import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sparkles, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useLevelStore } from '../../store/useLevelStore';
import { useDialogueStore } from '../../store/useDialogueStore';
import { NPCAttentionCatcher } from '../../components/scene/NPCAttentionCatcher';
import { KineticDialogue } from '../../components/scene/KineticDialogue';
import { IceFloes, CatShip, SleepingGiant } from './OceanProps';
import './CreamOceanShader';

export const CreamOcean: React.FC = () => {
  const materialRef = useRef<any>(null);
  const npcRef = useRef<THREE.Group>(null);
  const clancyRef = useRef<THREE.Group>(null);

  const setLevel = useLevelStore((state) => state.setLevel);
  const setTransitioning = useLevelStore((state) => state.setTransitioning);
  const isTransitioning = useLevelStore((state) => state.isTransitioning);
  const openDialogue = useDialogueStore((state) => state.openDialogue);

  useEffect(() => {
    return () => {
      if (materialRef.current) {
        materialRef.current.dispose();
      }
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (materialRef.current) {
      materialRef.current.uTime = time;
    }

    // Gentle rotate and wave for Fish Mage NPC
    if (npcRef.current) {
      npcRef.current.rotation.y = time * 0.25;
      npcRef.current.rotation.x = Math.sin(time * 0.4) * 0.15;
    }

    // Wiggle Clancy Octopus shape
    if (clancyRef.current) {
      clancyRef.current.rotation.y = -time * 0.15;
      clancyRef.current.position.y = -0.5 + Math.sin(time * 0.6) * 0.1;
    }
  });

  const handleBackToHub = (e: any) => {
    e.stopPropagation();
    if (isTransitioning) return;
    setTransitioning(true);
    setTimeout(() => { 
      setLevel(0); 
      setTransitioning(false); 
    }, 800);
  };

  return (
    <group>
      {/* Cinematic, restricted orbital spatial constraints */}
      <OrbitControls makeDefault maxDistance={22} minDistance={4} maxPolarAngle={Math.PI / 2 - 0.08} />
      <Environment preset="night" />

      {/* Sub-aquatic bioluminescent lighting */}
      <ambientLight intensity={0.25} color="#004d40" />
      <pointLight position={[0, 6, 0]} intensity={80} color="#ffb300" distance={25} />
      <pointLight position={[-8, -1, -5]} intensity={60} color="#00ffff" distance={20} />
      <pointLight position={[8, 3, 8]} intensity={50} color="#ff00ff" distance={20} />

      {/* Liquid particles/bubbles */}
      <Sparkles count={150} scale={20} size={5} speed={0.2} opacity={0.5} color="#e0f7fa" />
      <Sparkles count={100} scale={20} size={8} speed={0.4} opacity={0.3} color="#ffe082" />

      {/* 1. UNDULATING CREAM LIQUID GROUND (Terrain like Level 2) */}
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
        <planeGeometry args={[110, 110, 128, 128]} />
        <creamOceanShaderMaterial 
          ref={materialRef} 
          side={THREE.DoubleSide}
          uSpeed={0.5}
          uDistortion={1.0}
        />
      </mesh>

      {/* 2. FISH MAGE NPC (Trudy / Fish Mage - Intersecting golden glowing shapes) */}
      {/* Size: 1.2 x 1.2 x 2.2 */}
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.0}>
        <group 
          ref={npcRef}
          position={[0, 0.8, 0]}
          onClick={(e) => { e.stopPropagation(); openDialogue(3); }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          {/* Main Body - Golden Cylinder capsule */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.5, 0.5, 1.8, 16]} />
            <meshStandardMaterial color="#ffe082" emissive="#ffb300" emissiveIntensity={1.2} roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Tail Fin - Golden Torus */}
          <mesh position={[-1.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.4, 0.08, 8, 24]} />
            <meshStandardMaterial color="#ffd54f" emissive="#ff8f00" emissiveIntensity={1.5} />
          </mesh>
          {/* Glowing Wizard Crown Orb */}
          <mesh position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={2.5} roughness={0} />
          </mesh>
        </group>
      </Float>

      {/* 3. CLANCY AVATAR: OCTOPUS / ALIEN FORM (Glowing Purple and Neon-Blue cylinder/ring stack) */}
      {/* Size: 0.8 x 1.8 x 0.8 */}
      <group ref={clancyRef} position={[0, -0.5, 5.5]}>
        <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.4}>
          {/* Core Body */}
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.45, 1.2, 16]} />
            <MeshDistortMaterial
              color="#ba68c8"
              emissive="#8e24aa"
              emissiveIntensity={2.0}
              distort={0.3}
              speed={2.0}
              roughness={0.1}
              metalness={0.6}
            />
          </mesh>
          {/* Glowing Eye */}
          <mesh position={[0, 0.4, 0.35]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#fff" emissive="#00ffff" emissiveIntensity={3} />
          </mesh>
          {/* Orbital tentacles (flat thin toruses) */}
          <mesh rotation={[Math.PI / 6, 0, 0]} position={[0, -0.4, 0]}>
            <torusGeometry args={[0.6, 0.02, 6, 32]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.7} />
          </mesh>
          <mesh rotation={[-Math.PI / 6, 0, 0]} position={[0, -0.5, 0]}>
            <torusGeometry args={[0.65, 0.02, 6, 32]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.7} />
          </mesh>
        </Float>
      </group>

      {/* Return to Hub Platform Portal */}
      <group position={[0, -1.0, 9]}>
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
          <mesh onClick={handleBackToHub} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
            <boxGeometry args={[3.2, 0.4, 1.2]} />
            <meshStandardMaterial color="#424242" emissive="#ffb300" emissiveIntensity={0.6} roughness={0.3} />
          </mesh>
          <Text position={[0, 0.5, 0]} fontSize={0.35} color="white" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000" font="https://fonts.gstatic.com/s/outfit/v11/0oWkYn31adA7zp0t7TxB6H8.woff">
            Return to Hub
          </Text>
        </Float>
      </group>

      {/* NPC Proximity Triggers and Kinetic Dialogues */}
      <NPCAttentionCatcher npcPosition={[0, 1.2, 0]} npcName="Fish Mage" targetLevelId={3} />
      <KineticDialogue position={[0, 3.0, 0]} />

      {/* Ep3 set dressing: ice floes, Darryl's cat ship, sleeping Barry */}
      <IceFloes count={9} />
      <CatShip position={[8, -1.4, -6]} />
      <SleepingGiant position={[-14, -2, -16]} />

      <gridHelper args={[50, 30, '#00ffff', '#003333']} position={[0, -1.95, 0]} />
    </group>
  );
};

export default CreamOcean;
