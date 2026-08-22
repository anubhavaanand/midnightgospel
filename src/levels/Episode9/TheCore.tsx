
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Float, Text, Sparkles } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';
import { useLevelStore } from '../../store/useLevelStore';
import { useDialogueStore } from '../../store/useDialogueStore';
import { NPCAttentionCatcher } from '../../components/scene/NPCAttentionCatcher';
import { KineticDialogue } from '../../components/scene/KineticDialogue';
import { DeepSpaceSky, SolarOrbit, UplinkDish, LightPillars } from './CoreProps';
import { FluidFloor } from './FluidFloor';
import { RaymarchedFractal } from './RaymarchedFractal';
import { PhysicsOrbs } from './PhysicsOrbs';

const TheCore: React.FC = () => {
  const clancyRef = useRef<THREE.Group>(null);
  
  const setLevel = useLevelStore((state) => state.setLevel);
  const setTransitioning = useLevelStore((state) => state.setTransitioning);
  const isTransitioning = useLevelStore((state) => state.isTransitioning);
  const openDialogue = useDialogueStore((state) => state.openDialogue);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (clancyRef.current) {
      clancyRef.current.rotation.y = time * 0.4;
      clancyRef.current.rotation.x = time * 0.2;
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
    <>
      <OrbitControls makeDefault maxDistance={30} minDistance={2} />
      <Environment preset="night" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={2} color="#00FFCC" />
      <pointLight position={[0, -10, 0]} intensity={2} color="#FF007F" />

      {/* Physics Sandbox Wrapper */}
      <Physics gravity={[0, 0, 0]}>
        
        {/* The Central Artifact (4D Raymarched SDF + Spatial Audio) */}
        <group onClick={(e) => { e.stopPropagation(); openDialogue(9); }} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
          <RaymarchedFractal />
        </group>

        {/* Floating Physics Orbs */}
        <PhysicsOrbs count={30} />

        {/* The Liquid Consciousness Floor */}
        <FluidFloor />

      </Physics>

      {/* 3. FUTURE HOLO-CUBE CLANCY AVATAR (Glowing Cosmic Prism form) */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5} position={[0, -8.0, 5.0]}>
        <group ref={clancyRef}>
          {/* Inner Glowing Core */}
          <mesh>
            <octahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial color="#FF007F" emissive="#FF007F" emissiveIntensity={2.5} roughness={0} />
          </mesh>
          {/* Outer Glass Prism */}
          <mesh>
            <icosahedronGeometry args={[0.55, 0]} />
            <meshStandardMaterial 
              color="#00FFCC" 
              emissive="#00FFCC" 
              emissiveIntensity={1.0}
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.7}
              wireframe
            />
          </mesh>
          {/* Outer transparent boundary */}
          <mesh>
            <sphereGeometry args={[0.65, 16, 16]} />
            <meshStandardMaterial 
              color="#00FFCC"
              transparent
              opacity={0.3}
              roughness={0}
            />
          </mesh>
          {/* Orbiting ring */}
          <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <torusGeometry args={[0.9, 0.02, 8, 32]} />
            <meshBasicMaterial color="#FF007F" transparent opacity={0.6} />
          </mesh>
        </group>
      </Float>

      {/* Return to Hub Platform Portal */}
      <group position={[0, -9.0, 9]}>
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
          <mesh onClick={handleBackToHub} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
            <boxGeometry args={[3.2, 0.4, 1.2]} />
            <meshStandardMaterial color="#222" emissive="#00FFCC" emissiveIntensity={0.8} roughness={0.3} />
          </mesh>
          <Text position={[0, 0.5, 0]} fontSize={0.35} color="white" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000">
            Return to Hub
          </Text>
        </Float>
      </group>

      {/* Dialogue Proximity & Text Billboards */}
      <NPCAttentionCatcher npcPosition={[0, 5, 0]} npcName="The Simulator" targetLevelId={9} />
      <KineticDialogue position={[0, 7.5, 0]} />

      {/* High-quality atmosphere particles */}
      <Sparkles count={200} scale={30} size={5} speed={0.5} opacity={0.6} color="#00FFCC" />
      <Sparkles count={100} scale={30} size={7} speed={0.3} opacity={0.4} color="#FF007F" />

      {/* Fallback Ground Grid Platform */}
      {/* Ep9 set dressing: deep space skybox, solar orbit, uplink dish, light pillars */}
      <DeepSpaceSky />
      <SolarOrbit position={[0, 9, -18]} />
      <UplinkDish position={[11, -8.5, -6]} />
      <LightPillars count={6} />

      <gridHelper args={[60, 40, '#00FFCC', '#FF007F']} position={[0, -9.95, 0]} />
    </>
  );
};

export default TheCore;
