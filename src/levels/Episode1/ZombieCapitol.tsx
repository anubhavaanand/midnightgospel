import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sparkles, MeshDistortMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useDialogueStore } from '../../store/useDialogueStore';
import { useLevelStore } from '../../store/useLevelStore';
import { NPCAttentionCatcher } from '../../components/scene/NPCAttentionCatcher';
import { KineticDialogue } from '../../components/scene/KineticDialogue';
import './ZombieShader';

export const ZombieCapitol: React.FC = () => {
  const materialRef = useRef<any>(null);
  const coreRef = useRef<THREE.Group>(null);
  const clancyRef = useRef<THREE.Group>(null);
  const zombiesRef = useRef<THREE.Group>(null);
  
  const openDialogue = useDialogueStore((state) => state.openDialogue);
  
  const setLevel = useLevelStore((state) => state.setLevel);
  const setTransitioning = useLevelStore((state) => state.setTransitioning);
  const isTransitioning = useLevelStore((state) => state.isTransitioning);

  const handleBackToHub = (e: any) => {
    e.stopPropagation();
    if (isTransitioning) return;
    setTransitioning(true);
    setTimeout(() => { 
      setLevel(0); 
      setTransitioning(false); 
    }, 800);
  };

  // Generate deterministic random positions for the Zombie Horde placeholders
  const zombiePositions = React.useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      pos: [
        (Math.random() - 0.5) * 20, // x: -10 to 10
        -1.8 + Math.random() * 0.2,  // y: wiggling on top of undulating land plate
        (Math.random() - 0.5) * 16 - 5 // z: -13 to 3
      ] as [number, number, number],
      speed: 0.5 + Math.random() * 1.5,
      offset: Math.random() * Math.PI
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (materialRef.current) {
      materialRef.current.uTime = time;
    }
    
    // Animate Glasses Man (distorted orange centerpiece)
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.3;
      coreRef.current.rotation.z = Math.sin(time * 0.5) * 0.2;
    }

    // Animate wiggling green Zombie Horde placeholders
    if (zombiesRef.current) {
      zombiesRef.current.children.forEach((child, idx) => {
        const zMeta = zombiePositions[idx];
        if (zMeta) {
          child.position.y = zMeta.pos[1] + Math.sin(time * zMeta.speed + zMeta.offset) * 0.15;
          child.rotation.x = Math.sin(time * zMeta.speed) * 0.1;
        }
      });
    }

    // Pulse fuchsia Clancy avatar glow
    if (clancyRef.current) {
      clancyRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <group>
      {/* OrbitControls configured for high-quality, restricted angle spatial review */}
      <OrbitControls makeDefault maxDistance={25} minDistance={3} enablePan={false} maxPolarAngle={Math.PI / 2 - 0.05} />
      <Environment preset="sunset" />
      
      {/* Ambient & Point Lighting */}
      <ambientLight intensity={0.4} color="#8e24aa" />
      <pointLight position={[0, 8, 0]} intensity={100} color="#ffb300" distance={25} />
      <pointLight position={[0, -2, -5]} intensity={50} color="#2ecc71" distance={25} />
      <pointLight position={[-6, 4, -8]} intensity={60} color="#ff007f" distance={20} />
      <pointLight position={[6, 4, -8]} intensity={60} color="#00ffff" distance={20} />

      {/* 1. UNDULATING FLOOR LAND-PLATE (Terrain mesh like Level 2) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2, 0]} 
        receiveShadow
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
        <planeGeometry args={[120, 120, 128, 128]} />
        <zombieShaderMaterial 
          ref={materialRef} 
          side={THREE.DoubleSide} 
          uSpeed={0.6}
          uDistortion={1.2}
        />
      </mesh>
      
      {/* 2. GLASSES MAN NPC (Orange Distorted Sphere Centerpiece - Clickable!) */}
      {/* Size: 0.6 x 1.2 x 0.6 */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
        <group 
          ref={coreRef} 
          position={[0, 0.5, 0]} 
          onClick={(e) => { e.stopPropagation(); openDialogue(1); }} 
          onPointerOver={() => document.body.style.cursor = 'pointer'} 
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          {/* Inner Glowing Core */}
          <mesh>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#fff" emissive="#ffea00" emissiveIntensity={2} roughness={0} />
          </mesh>
          {/* Distorted Outer shell */}
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <MeshDistortMaterial 
              color="#ff7a00" 
              emissive="#ff3c00"
              emissiveIntensity={1.5}
              distort={0.4} 
              speed={2.5} 
              roughness={0.1} 
              metalness={0.9}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Floating Orbiting Ring */}
          <mesh rotation={[Math.PI / 2.5, 0, 0]}>
            <torusGeometry args={[0.9, 0.04, 8, 48]} />
            <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={2} />
          </mesh>
        </group>
      </Float>

      {/* 3. BEACH BODY CLANCY AVATAR PLACEHOLDER (Fuchsia Glowing Capsule) */}
      {/* Size: 0.8 x 2.0 x 0.8 */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3} position={[0, -0.6, 4]}>
        <group ref={clancyRef}>
          <mesh castShadow>
            <cylinderGeometry args={[0.4, 0.4, 1.4, 16]} />
            <meshStandardMaterial 
              color="#ff007f" 
              emissive="#ff007f" 
              emissiveIntensity={2.5}
              roughness={0.1}
              metalness={0.8}
              transparent
              opacity={0.9}
            />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial 
              color="#ff007f" 
              emissive="#ff007f" 
              emissiveIntensity={3}
              roughness={0}
            />
          </mesh>
          {/* Orbiting wireframe rings */}
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[0.65, 0.02, 8, 32]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]}>
            <torusGeometry args={[0.7, 0.02, 8, 32]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
          </mesh>
        </group>
      </Float>

      {/* 4. WHITE HOUSE KEEP PLACEHOLDER (Glowing Red Frame Box) */}
      {/* Size: 10.0 x 5.0 x 6.0 */}
      <group position={[0, 2.5, -15]}>
        {/* Wireframe Outer Boundary */}
        <mesh>
          <boxGeometry args={[10, 5, 6]} />
          <meshBasicMaterial color="#c42030" wireframe />
        </mesh>
        {/* Glowing Inner Core */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[9.5, 4.0, 5.5]} />
          <meshStandardMaterial 
            color="#b00c22" 
            emissive="#9b0319" 
            emissiveIntensity={1.5}
            transparent
            opacity={0.35}
          />
        </mesh>
      </group>

      {/* 5. CURE CANNONS PLACEHOLDERS (Neon Green Glowing Pillars) */}
      {/* Size: 1.0 x 6.0 x 1.0 */}
      {/* Left Cannon */}
      <group position={[-7, 1.0, -8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.5, 6.0, 16]} />
          <meshStandardMaterial 
            color="#388e3c" 
            emissive="#2ecc71" 
            emissiveIntensity={2.0}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
      {/* Right Cannon */}
      <group position={[7, 1.0, -8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.5, 6.0, 16]} />
          <meshStandardMaterial 
            color="#388e3c" 
            emissive="#2ecc71" 
            emissiveIntensity={2.0}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* 6. ZOMBIE HORDES PLACEHOLDERS (Green Wiggling Octahedrons) */}
      {/* Size: 0.4 x 1.2 x 0.4 */}
      <group ref={zombiesRef}>
        {zombiePositions.map((z, idx) => (
          <group key={idx} position={z.pos}>
            <mesh castShadow>
              <octahedronGeometry args={[0.3, 0]} />
              <meshStandardMaterial 
                color="#A5D74A" 
                emissive="#5c9314" 
                emissiveIntensity={1.5}
                roughness={0.4}
                flatShading
              />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <octahedronGeometry args={[0.15, 0]} />
              <meshStandardMaterial color="#88b53c" flatShading />
            </mesh>
          </group>
        ))}
      </group>

      {/* Dialogue Proximity & Text Bilboards */}
      <NPCAttentionCatcher npcPosition={[0, 1.2, 0]} npcName="Glasses Man" targetLevelId={1} />
      <KineticDialogue position={[0, 3.2, 0]} />

      {/* High-quality air particles */}
      <Sparkles 
        count={200} 
        scale={24} 
        size={4} 
        speed={0.3} 
        opacity={0.5} 
        color="#2ecc71" 
      />
      <Sparkles 
        count={100} 
        scale={24} 
        size={6} 
        speed={0.15} 
        opacity={0.3} 
        color="#8e24aa" 
      />

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

      {/* Fallback Ground Grid Platform */}
      <gridHelper args={[60, 40, '#8e24aa', '#3b0066']} position={[0, -1.9, 0]} />
    </group>
  );
};

export default ZombieCapitol;
