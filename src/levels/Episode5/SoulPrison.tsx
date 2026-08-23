import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sparkles, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useLevelStore } from '../../store/useLevelStore';
import { useDialogueStore } from '../../store/useDialogueStore';
import { NPCAttentionCatcher } from '../../components/scene/NPCAttentionCatcher';
import { KineticDialogue } from '../../components/scene/KineticDialogue';
import { BardoScale, SoulStrings, GlyphPillars, HangingCages, CrashRubble } from './PrisonProps';
import './SoulPrisonShader';

export const SoulPrison: React.FC = () => {
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

    // Heavy floating cycle for Bob NPC
    if (npcRef.current) {
      npcRef.current.rotation.y = time * 0.2;
      npcRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
    }

    // Wiggle Rainbow Clancy
    if (clancyRef.current) {
      clancyRef.current.rotation.y = -time * 0.15;
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
      {/* High-fidelity orbital spatial constraints */}
      <OrbitControls makeDefault maxDistance={22} minDistance={4} maxPolarAngle={Math.PI / 2 - 0.05} />
      <Environment preset="city" />

      {/* Cyber/neon prison ambient lights */}
      <ambientLight intensity={0.2} color="#4a148c" />
      <pointLight position={[0, 7, 0]} intensity={100} color="#00e5ff" distance={25} />
      <pointLight position={[-6, 1, -6]} intensity={50} color="#d500f9" distance={20} />
      <pointLight position={[6, 1, 6]} intensity={50} color="#00e5ff" distance={20} />

      {/* Floating digital space code code rain/spark particles */}
      <Sparkles count={160} scale={20} size={5} speed={0.3} opacity={0.6} color="#00e5ff" />
      <Sparkles count={80} scale={20} size={7} speed={0.15} opacity={0.4} color="#d500f9" />

      {/* 1. COSMIC GRID SHADER FLOOR (Terrain mesh like Level 2) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[112, 112, 128, 128]} />
        <soulPrisonShaderMaterial 
          ref={materialRef} 
          side={THREE.DoubleSide} 
          uSpeed={0.6}
          uDistortion={0.8}
        />
      </mesh>

      {/* 2. INMATE BOB NPC (Cosmic prison sphere with orbiting grid rings) */}
      {/* Size: 1.0 x 1.0 x 1.0 */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
        <group 
          ref={npcRef}
          position={[0, 0.8, 0]}
          onClick={(e) => { e.stopPropagation(); openDialogue(5); }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          {/* Inner Prism Core */}
          <mesh>
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color="#ffffff" emissive="#00e5ff" emissiveIntensity={2.5} roughness={0} metalness={0.9} />
          </mesh>
          {/* Outer wireframe shell */}
          <mesh>
            <octahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial color="#d500f9" wireframe roughness={0.1} />
          </mesh>
          {/* Orbiting lock ring */}
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[1.1, 0.03, 6, 32]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.5} />
          </mesh>
        </group>
      </Float>

      {/* 3. RAINBOW CLANCY AVATAR (Glowing Shifting glass cylinder) */}
      {/* Size: 0.8 x 2.0 x 0.8 */}
      <group ref={clancyRef} position={[0, -0.6, 5.2]}>
        <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh castShadow>
            <cylinderGeometry args={[0.32, 0.32, 1.4, 16]} />
            <MeshDistortMaterial
              color="#00e5ff"
              emissive="#d500f9"
              emissiveIntensity={2.2}
              distort={0.35}
              speed={1.8}
              roughness={0.05}
              metalness={0.9}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Internal core */}
          <mesh>
            <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#00e5ff" emissiveIntensity={2.0} />
          </mesh>
        </Float>
      </group>

      {/* Return to Hub Neon Platform Portal */}
      <group position={[0, -1.0, 8.8]}>
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.25}>
          <mesh onClick={handleBackToHub} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
            <boxGeometry args={[3.2, 0.4, 1.2]} />
            <meshStandardMaterial color="#1a237e" emissive="#00e5ff" emissiveIntensity={0.7} roughness={0.2} />
          </mesh>
          <Text position={[0, 0.5, 0]} fontSize={0.35} color="white" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000">
            Return to Hub
          </Text>
        </Float>
      </group>

      {/* NPC Proximity Attention Catcher and Dialogue bills */}
      <NPCAttentionCatcher npcPosition={[0, 1.2, 0]} npcName="Inmate" targetLevelId={5} />
      <KineticDialogue position={[0, 3.1, 0]} />

      {/* Ep5 set dressing: Bardo Loop scale, soul strings, glyph pillars */}
      <BardoScale position={[0, -1.9, -14]} />
      <SoulStrings count={7} />
      <GlyphPillars count={6} />
      <HangingCages count={4} />
      <CrashRubble count={9} />

      <gridHelper args={[60, 40, '#00e5ff', '#1a0033']} position={[0, -1.95, 0]} />
    </group>
  );
};

export default SoulPrison;
