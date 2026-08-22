import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sparkles, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useLevelStore } from '../../store/useLevelStore';
import { useDialogueStore } from '../../store/useDialogueStore';
import { NPCAttentionCatcher } from '../../components/scene/NPCAttentionCatcher';
import { KineticDialogue } from '../../components/scene/KineticDialogue';
import { AfterlifeExpress, SteampunkFlyby, BearObservatory } from './TrainProps';
import './TrainworldShader';

export const Trainworld: React.FC = () => {
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

    // Warm clockwork floating cycle for Mom NPC
    if (npcRef.current) {
      npcRef.current.rotation.y = time * 0.18;
      npcRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }

    // Wiggle Heart Clancy
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
      {/* High-fidelity orbital review constraints */}
      <OrbitControls makeDefault maxDistance={22} minDistance={4} maxPolarAngle={Math.PI / 2 - 0.05} />
      <Environment preset="sunset" />

      {/* Warm retro/techno ambient lights */}
      <ambientLight intensity={0.2} color="#ad1457" />
      <pointLight position={[0, 7, 0]} intensity={110} color="#ffea00" distance={25} />
      <pointLight position={[-6, 1, -6]} intensity={50} color="#e65100" distance={20} />
      <pointLight position={[6, 1, 6]} intensity={45} color="#d500f9" distance={20} />

      {/* Floating retro golden pixels and sparks */}
      <Sparkles count={150} scale={20} size={5} speed={0.3} opacity={0.6} color="#ffea00" />
      <Sparkles count={80} scale={20} size={7} speed={0.15} opacity={0.4} color="#ad1457" />

      {/* 1. RETRO-TECHNO CIRCUITS PLATFORM (Terrain mesh like Level 2) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[112, 112, 128, 128]} />
        <trainworldShaderMaterial 
          ref={materialRef} 
          side={THREE.DoubleSide} 
          uSpeed={0.5}
          uDistortion={0.9}
        />
      </mesh>

      {/* 2. MOM NPC (Double overlapping glowing golden spheres with orbiting clockwork ring) */}
      {/* Size: 1.2 x 1.8 x 1.2 */}
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
        <group 
          ref={npcRef}
          position={[0, 0.9, 0]}
          onClick={(e) => { e.stopPropagation(); openDialogue(8); }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          {/* Main Sphere (Body) */}
          <mesh castShadow>
            <sphereGeometry args={[0.55, 32, 32]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffea00" emissiveIntensity={1.8} roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Top Sphere (Head) */}
          <mesh position={[0, 0.65, 0]}>
            <sphereGeometry args={[0.38, 24, 24]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffc107" emissiveIntensity={1.5} roughness={0.1} />
          </mesh>
          {/* Outer glowing clockwork ring */}
          <mesh rotation={[Math.PI / 2.2, 0, 0]}>
            <torusGeometry args={[0.9, 0.025, 8, 36]} />
            <meshStandardMaterial color="#ff5722" emissive="#ff5722" emissiveIntensity={2.0} />
          </mesh>
        </group>
      </Float>

      {/* 3. GOLDEN HEART CLANCY AVATAR (Glowing Golden cylinder with red core) */}
      {/* Size: 0.8 x 1.8 x 0.8 */}
      <group ref={clancyRef} position={[0, -0.6, 5.0]}>
        <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh castShadow>
            <cylinderGeometry args={[0.33, 0.33, 1.3, 16]} />
            <MeshDistortMaterial
              color="#ffea00"
              emissive="#ad1457"
              emissiveIntensity={2.0}
              distort={0.26}
              speed={1.6}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
          {/* Orbiting clock ring */}
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[0.6, 0.015, 6, 24]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
        </Float>
      </group>

      {/* Return to Hub Retro Station Portal */}
      <group position={[0, -1.0, 8.5]}>
        <Float speed={1.5} rotationIntensity={0.06} floatIntensity={0.2}>
          <mesh onClick={handleBackToHub} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
            <boxGeometry args={[3.2, 0.4, 1.2]} />
            <meshStandardMaterial color="#3e2723" emissive="#ffea00" emissiveIntensity={0.5} roughness={0.5} />
          </mesh>
          <Text position={[0, 0.5, 0]} fontSize={0.35} color="white" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000">
            Return to Hub
          </Text>
        </Float>
      </group>

      {/* NPC Proximity Attention Catcher and Dialogue bills */}
      <NPCAttentionCatcher npcPosition={[0, 1.4, 0]} npcName="Mom" targetLevelId={8} />
      <KineticDialogue position={[0, 3.1, 0]} />

      {/* Ep8 set dressing: Afterlife Express, plane flyby, bear observatory */}
      <AfterlifeExpress position={[-16, -1.6, -12]} />
      <SteampunkFlyby />
      <BearObservatory position={[10, -1.9, -8]} />

      <gridHelper args={[60, 40, '#ad1457', '#3c0022']} position={[0, -1.95, 0]} />
    </group>
  );
};

export default Trainworld;
