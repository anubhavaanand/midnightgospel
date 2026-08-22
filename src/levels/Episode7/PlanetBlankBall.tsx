import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sparkles, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useLevelStore } from '../../store/useLevelStore';
import { useDialogueStore } from '../../store/useDialogueStore';
import { NPCAttentionCatcher } from '../../components/scene/NPCAttentionCatcher';
import { KineticDialogue } from '../../components/scene/KineticDialogue';
import { TarotTower, ArcanaRing, PingPongRain } from './BlankBallProps';
import './PlanetBlankBallShader';

export const PlanetBlankBall: React.FC = () => {
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

    // Heavy floating cycle for Death NPC
    if (npcRef.current) {
      npcRef.current.rotation.y = time * 0.15;
      npcRef.current.position.y = 1.2 + Math.sin(time * 0.4) * 0.15;
    }

    // Wiggle Sphere Clancy
    if (clancyRef.current) {
      clancyRef.current.rotation.y = -time * 0.25;
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
      <Environment preset="night" />

      {/* Eerie cool blank ambient lights */}
      <ambientLight intensity={0.15} color="#e0f7fa" />
      <pointLight position={[0, 8, 0]} intensity={80} color="#ffffff" distance={25} />
      <pointLight position={[-6, 1, -6]} intensity={50} color="#00e5ff" distance={20} />
      <pointLight position={[6, 1, 6]} intensity={45} color="#ffea00" distance={20} />

      {/* Floating bone dust and eerie blue sparks */}
      <Sparkles count={140} scale={20} size={5} speed={0.2} opacity={0.5} color="#e0f7fa" />
      <Sparkles count={80} scale={20} size={7} speed={0.15} opacity={0.4} color="#ffe082" />

      {/* 1. BONE-WHITE SKETAL FLOOR (Terrain mesh like Level 2) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[112, 112, 128, 128]} />
        <planetBlankBallShaderMaterial 
          ref={materialRef} 
          side={THREE.DoubleSide} 
          uSpeed={0.5}
          uDistortion={0.8}
        />
      </mesh>

      {/* 2. DEATH NPC (Tall monolith black column with glowing gold trim) */}
      {/* Size: 1.0 x 2.5 x 1.0 */}
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.7}>
        <group 
          ref={npcRef}
          position={[0, 1.2, 0]}
          onClick={(e) => { e.stopPropagation(); openDialogue(7); }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          {/* Main Pillar */}
          <mesh castShadow>
            <boxGeometry args={[0.7, 2.2, 0.7]} />
            <meshStandardMaterial color="#212121" roughness={0.05} metalness={0.9} />
          </mesh>
          {/* Glowing Gold Halo Ring */}
          <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.6, 0.02, 8, 32]} />
            <meshStandardMaterial color="#ffea00" emissive="#ffea00" emissiveIntensity={2.5} />
          </mesh>
          {/* Internal glowing skull core */}
          <mesh position={[0, 0.6, 0.36]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffea00" emissiveIntensity={2.0} />
          </mesh>
        </group>
      </Float>

      {/* 3. SPHERE CLANCY AVATAR (Glowing Golden sphere inside Glass shell) */}
      {/* Size: 1.0 x 1.0 x 1.0 */}
      <group ref={clancyRef} position={[0, -0.6, 5.0]}>
        <Float speed={2.2} rotationIntensity={0.2} floatIntensity={0.3}>
          {/* Glass Outer Shell */}
          <mesh castShadow>
            <sphereGeometry args={[0.55, 32, 32]} />
            <MeshDistortMaterial
              color="#ffe082"
              emissive="#ffb300"
              emissiveIntensity={1.5}
              distort={0.2}
              speed={2.0}
              roughness={0.05}
              metalness={0.8}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Glowing Inner Soul Core */}
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffea00" emissiveIntensity={3} />
          </mesh>
        </Float>
      </group>

      {/* Return to Hub Monolith Portal */}
      <group position={[0, -1.0, 8.5]}>
        <Float speed={1.5} rotationIntensity={0.06} floatIntensity={0.2}>
          <mesh onClick={handleBackToHub} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
            <boxGeometry args={[3.2, 0.4, 1.2]} />
            <meshStandardMaterial color="#37474f" emissive="#ffea00" emissiveIntensity={0.6} roughness={0.3} />
          </mesh>
          <Text position={[0, 0.5, 0]} fontSize={0.35} color="white" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000">
            Return to Hub
          </Text>
        </Float>
      </group>

      {/* NPC Proximity Attention Catcher and Dialogue bills */}
      <NPCAttentionCatcher npcPosition={[0, 1.5, 0]} npcName="Death" targetLevelId={7} />
      <KineticDialogue position={[0, 3.2, 0]} />

      {/* Ep7 set dressing: tarot tower, arcana ring, ping-pong rain */}
      <TarotTower position={[-9, -1.9, -10]} />
      <ArcanaRing position={[0, 5.5, -14]} />
      <PingPongRain />

      <gridHelper args={[60, 40, '#ffe082', '#1c1c1c']} position={[0, -1.95, 0]} />
    </group>
  );
};

export default PlanetBlankBall;
