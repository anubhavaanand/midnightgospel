import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sparkles, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useLevelStore } from '../../store/useLevelStore';
import { useDialogueStore } from '../../store/useDialogueStore';
import { NPCAttentionCatcher } from '../../components/scene/NPCAttentionCatcher';
import { KineticDialogue } from '../../components/scene/KineticDialogue';
import './VengeanceKingdomShader';

export const VengeanceKingdom: React.FC = () => {
  const materialRef = useRef<any>(null);
  const npcRef = useRef<THREE.Group>(null);
  const clancyRef = useRef<THREE.Group>(null);

  const setLevel = useLevelStore((state) => state.setLevel);
  const setTransitioning = useLevelStore((state) => state.setTransitioning);
  const isTransitioning = useLevelStore((state) => state.isTransitioning);
  const openDialogue = useDialogueStore((state) => state.openDialogue);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }

    // Heavy floating cycle for Knight NPC
    if (npcRef.current) {
      npcRef.current.rotation.y = -time * 0.15;
      npcRef.current.position.y = 1.0 + Math.sin(time * 0.5) * 0.2;
    }

    // Wiggle Warrior Clancy
    if (clancyRef.current) {
      clancyRef.current.rotation.y = time * 0.2;
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
      {/* High-fidelity orbital review boundaries */}
      <OrbitControls makeDefault maxDistance={24} minDistance={4} maxPolarAngle={Math.PI / 2 - 0.05} />
      <Environment preset="sunset" />

      {/* Fiery apocalyptic ambient lights */}
      <ambientLight intensity={0.2} color="#ff3d00" />
      <pointLight position={[0, 8, 0]} intensity={120} color="#ff5722" distance={25} />
      <pointLight position={[-6, 2, -6]} intensity={50} color="#c62828" distance={20} />
      <pointLight position={[6, -1, 6]} intensity={40} color="#00ffff" distance={20} />

      {/* Floating molten sparks and ash embers */}
      <Sparkles count={180} scale={22} size={6} speed={0.4} opacity={0.6} color="#ff3d00" />
      <Sparkles count={80} scale={22} size={8} speed={0.25} opacity={0.4} color="#ffea00" />

      {/* 1. CRAGGY VOLCANIC MAGMA FLOOR PLATE (Terrain mesh like Level 2) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[115, 115, 128, 128]} />
        <vengeanceKingdomShaderMaterial 
          ref={materialRef} 
          side={THREE.DoubleSide} 
          uSpeed={0.8}
          uDistortion={0.8}
        />
      </mesh>

      {/* 2. KNIGHT NPC (Medieval Trudy Knight - Metallic Box Stack with glowing crest) */}
      {/* Size: 1.0 x 2.2 x 1.0 */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
        <group 
          ref={npcRef}
          position={[0, 1.0, 0]}
          onClick={(e) => { e.stopPropagation(); openDialogue(4); }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          {/* Main Helmet - Dark slate box */}
          <mesh castShadow>
            <boxGeometry args={[0.8, 1.0, 0.8]} />
            <meshStandardMaterial color="#37474f" roughness={0.15} metalness={0.9} />
          </mesh>
          {/* Neon Orange Visor Slit */}
          <mesh position={[0, 0.1, 0.41]}>
            <boxGeometry args={[0.55, 0.08, 0.05]} />
            <meshStandardMaterial color="#ffffff" emissive="#ff3d00" emissiveIntensity={3.5} />
          </mesh>
          {/* Glowing Warrior Crest Plume */}
          <mesh position={[0, 0.7, -0.1]} rotation={[-Math.PI / 6, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.18, 0.7, 16]} />
            <meshStandardMaterial color="#ff1744" emissive="#ff1744" emissiveIntensity={2.5} />
          </mesh>
        </group>
      </Float>

      {/* 3. WARRIOR CLANCY AVATAR (Glowing Crimson & Fuchsia Cylinder with orbiting Neon Sword) */}
      {/* Size: 0.8 x 1.9 x 0.8 */}
      <group ref={clancyRef} position={[0, -0.6, 5.0]}>
        <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh castShadow>
            <cylinderGeometry args={[0.35, 0.35, 1.3, 16]} />
            <MeshDistortMaterial
              color="#e91e63"
              emissive="#c2185b"
              emissiveIntensity={2.0}
              distort={0.25}
              speed={2.2}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          {/* Orbiting Neon Sword placeholder */}
          <group position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <mesh>
              <boxGeometry args={[0.08, 1.2, 0.04]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} />
            </mesh>
          </group>
        </Float>
      </group>

      {/* Return to Hub Lava Altar Portal */}
      <group position={[0, -1.0, 8.5]}>
        <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.3}>
          <mesh onClick={handleBackToHub} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
            <boxGeometry args={[3.0, 0.4, 1.2]} />
            <meshStandardMaterial color="#212121" emissive="#b71c1c" emissiveIntensity={0.8} roughness={0.4} />
          </mesh>
          <Text position={[0, 0.5, 0]} fontSize={0.35} color="white" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000" font="https://fonts.gstatic.com/s/outfit/v11/0oWkYn31adA7zp0t7TxB6H8.woff">
            Return to Hub
          </Text>
        </Float>
      </group>

      {/* NPC Proximity Attention Catcher and Dialogue bills */}
      <NPCAttentionCatcher npcPosition={[0, 1.5, 0]} npcName="Knight" targetLevelId={4} />
      <KineticDialogue position={[0, 3.2, 0]} />

      <gridHelper args={[60, 40, '#c62828', '#2b0000']} position={[0, -1.95, 0]} />
    </group>
  );
};

export default VengeanceKingdom;
