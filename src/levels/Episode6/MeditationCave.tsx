import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sparkles, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useLevelStore } from '../../store/useLevelStore';
import { useDialogueStore } from '../../store/useDialogueStore';
import { NPCAttentionCatcher } from '../../components/scene/NPCAttentionCatcher';
import { KineticDialogue } from '../../components/scene/KineticDialogue';
import { SingingBowls, CandleLanterns, CrystalClusters } from './CaveProps';
import './MeditationCaveShader';

export const MeditationCave: React.FC = () => {
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

    // Slow, serene floating cycle for David NPC
    if (npcRef.current) {
      npcRef.current.rotation.y = time * 0.12;
      npcRef.current.position.y = 0.8 + Math.sin(time * 0.3) * 0.12;
    }

    // Serene Zen Clancy rotation
    if (clancyRef.current) {
      clancyRef.current.rotation.y = -time * 0.1;
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
      {/* High-fidelity orbital review constraints */}
      <OrbitControls makeDefault maxDistance={22} minDistance={4} maxPolarAngle={Math.PI / 2 - 0.05} />
      <Environment preset="forest" />

      {/* Serene cave ambient warm lights */}
      <ambientLight intensity={0.2} color="#311b92" />
      <pointLight position={[0, 6, 0]} intensity={90} color="#ffb300" distance={25} />
      <pointLight position={[-6, 2, -6]} intensity={40} color="#8e24aa" distance={20} />
      <pointLight position={[6, -1, 6]} intensity={45} color="#1b5e20" distance={20} />

      {/* Flickering warm cavern sparks */}
      <Sparkles count={150} scale={20} size={5} speed={0.25} opacity={0.6} color="#ffb300" />
      <Sparkles count={70} scale={20} size={7} speed={0.12} opacity={0.3} color="#a1887f" />

      {/* 1. ROCKY ZEN CAVERN FLOOR (Terrain mesh like Level 2) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[114, 114, 128, 128]} />
        <meditationCaveShaderMaterial 
          ref={materialRef} 
          side={THREE.DoubleSide} 
          uSpeed={0.4}
          uDistortion={0.7}
        />
      </mesh>

      {/* 2. TEACHER DAVID NPC (Serene double cone shape with a glowing ring) */}
      {/* Size: 1.0 x 1.8 x 1.0 */}
      <Float speed={1.0} rotationIntensity={0.2} floatIntensity={0.6}>
        <group 
          ref={npcRef}
          position={[0, 0.8, 0]}
          onClick={(e) => { e.stopPropagation(); openDialogue(6); }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          {/* Main Cone (Body) */}
          <mesh castShadow>
            <coneGeometry args={[0.6, 1.4, 16]} />
            <meshStandardMaterial color="#8e24aa" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Inverted Cone (Crest) */}
          <mesh position={[0, 0.7, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.35, 0.6, 16]} />
            <meshStandardMaterial color="#ba68c8" roughness={0.2} />
          </mesh>
          {/* Golden floating ring of energy */}
          <mesh rotation={[Math.PI / 2.2, 0, 0]} position={[0, -0.2, 0]}>
            <torusGeometry args={[0.9, 0.03, 8, 36]} />
            <meshStandardMaterial color="#ffb300" emissive="#ffb300" emissiveIntensity={2.0} />
          </mesh>
        </group>
      </Float>

      {/* 3. ZEN CLANCY AVATAR (Glowing Violet & Orange Cylinder with floating meditation ring) */}
      {/* Size: 0.8 x 1.8 x 0.8 */}
      <group ref={clancyRef} position={[0, -0.6, 5.2]}>
        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh castShadow>
            <cylinderGeometry args={[0.34, 0.34, 1.3, 16]} />
            <MeshDistortMaterial
              color="#ffb300"
              emissive="#8e24aa"
              emissiveIntensity={1.8}
              distort={0.22}
              speed={1.5}
              roughness={0.3}
              metalness={0.6}
            />
          </mesh>
          {/* Meditation ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
            <torusGeometry args={[0.55, 0.015, 6, 24]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
        </Float>
      </group>

      {/* Return to Hub Wooden Deck Portal */}
      <group position={[0, -1.0, 8.6]}>
        <Float speed={1.5} rotationIntensity={0.06} floatIntensity={0.2}>
          <mesh onClick={handleBackToHub} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
            <boxGeometry args={[3.2, 0.4, 1.2]} />
            <meshStandardMaterial color="#5d4037" emissive="#ffb300" emissiveIntensity={0.5} roughness={0.6} />
          </mesh>
          <Text position={[0, 0.5, 0]} fontSize={0.35} color="white" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000" font="https://fonts.gstatic.com/s/outfit/v11/0oWkYn31adA7zp0t7TxB6H8.woff">
            Return to Hub
          </Text>
        </Float>
      </group>

      {/* NPC Proximity Attention Catcher and Dialogue bills */}
      <NPCAttentionCatcher npcPosition={[0, 1.2, 0]} npcName="Teacher" targetLevelId={6} />
      <KineticDialogue position={[0, 3.0, 0]} />

      {/* Ep6 set dressing: singing bowls, candle lanterns, crystals */}
      <SingingBowls />
      <CandleLanterns count={8} />
      <CrystalClusters count={5} />

      <gridHelper args={[60, 40, '#8e24aa', '#1b0033']} position={[0, -1.95, 0]} />
    </group>
  );
};

export default MeditationCave;
