import React, { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  Float,
  Sparkles,
  MeshDistortMaterial,
  Text,
  useGLTF,
} from '@react-three/drei';
import * as THREE from 'three';
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { useDialogueStore } from '../../store/useDialogueStore';
import { useLevelStore } from '../../store/useLevelStore';
import { NPCAttentionCatcher } from '../../components/scene/NPCAttentionCatcher';
import { KineticDialogue } from '../../components/scene/KineticDialogue';
import './ZombieShader';
import { computeScale } from '../../lib/modelScales';

const MODEL_BASE = '/models/level1';

/**
 * Loads a GLTF, auto-scales it to target height, grounds it (min.y -> 0),
 * centers X/Z. Returns a memoized Object3D ready for <Clone>.
 */
function usePreparedModel(url: string, height: number): THREE.Object3D | null {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const clone = skeletonClone(scene);
    clone.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const s = computeScale(url, height, size.y);
    clone.scale.setScalar(s);
    const box2 = new THREE.Box3().setFromObject(clone);
    const center = box2.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, -box2.min.y, -center.z);
    return clone;
  }, [scene, height]);
}

const WhiteHouse: React.FC = () => {
  const model = usePreparedModel(`${MODEL_BASE}/white_house_2.glb`, 11);
  if (!model) return null;
  return (
    <>
      <primitive object={model} />
      <pointLight position={[0, 4, 0]} intensity={40} color="#c42030" distance={14} />
    </>
  );
};

const ZombieHorde: React.FC<{
  positions: { pos: [number, number, number]; rotY: number }[];
}> = ({ positions }) => {
  const warrior = usePreparedModel(`${MODEL_BASE}/zombie_warrior.glb`, 1.6);
  const instances = useMemo(
    () => (warrior ? positions.map(() => skeletonClone(warrior)) : []),
    [warrior, positions]
  );
  if (!instances.length) return null;
  return (
    <>
      {positions.map((z, idx) => (
        <group key={idx} position={z.pos} rotation={[0, z.rotY, 0]}>
          <primitive object={instances[idx]} />
        </group>
      ))}
    </>
  );
};

const ZombieDogs: React.FC<{
  positions: { pos: [number, number, number]; rotY: number }[];
}> = ({ positions }) => {
  const dog = usePreparedModel(`${MODEL_BASE}/zombie_dog.glb`, 0.9);
  const instances = useMemo(
    () => (dog ? positions.map(() => skeletonClone(dog)) : []),
    [dog, positions]
  );
  if (!instances.length) return null;
  return (
    <>
      {positions.map((d, idx) => (
        <group key={idx} position={d.pos} rotation={[0, d.rotY, 0]}>
          <primitive object={instances[idx]} />
        </group>
      ))}
    </>
  );
};

export const ZombieCapitol: React.FC = () => {
  const materialRef = useRef<any>(null);
  const coreRef = useRef<THREE.Group>(null);
  const clancyRef = useRef<THREE.Group>(null);
  const zombiesRef = useRef<THREE.Group>(null);
  const dogsRef = useRef<THREE.Group>(null);

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

  // Deterministic scatter positions for zombie warriors
  const zombiePositions = React.useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      pos: [
        Math.sin(i * 2.4) * 7 + (Math.random() - 0.5) * 3,
        -1.8,
        Math.cos(i * 1.7) * 5 - 5 + (Math.random() - 0.5) * 3,
      ] as [number, number, number],
      rotY: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.2,
      offset: Math.random() * Math.PI,
    }));
  }, []);

  const dogPositions = React.useMemo(
    () => [
      { pos: [-4, -1.8, 2] as [number, number, number], rotY: 0.8 },
      { pos: [5.5, -1.8, -2] as [number, number, number], rotY: -2.1 },
      { pos: [2, -1.8, 5] as [number, number, number], rotY: 3.4 },
    ],
    []
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (materialRef.current) {
      materialRef.current.uTime = time;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.3;
      coreRef.current.rotation.z = Math.sin(time * 0.5) * 0.2;
    }

    // Shamble animation on horde wrappers
    if (zombiesRef.current) {
      zombiesRef.current.children.forEach((child, idx) => {
        const zMeta = zombiePositions[idx];
        if (zMeta) {
          child.position.y = zMeta.pos[1] + Math.abs(Math.sin(time * zMeta.speed + zMeta.offset)) * 0.08;
          child.rotation.z = Math.sin(time * zMeta.speed + zMeta.offset) * 0.08;
          child.rotation.x = Math.sin(time * zMeta.speed * 0.7) * 0.05;
        }
      });
    }

    // Dogs trot in small circles
    if (dogsRef.current) {
      dogsRef.current.children.forEach((child, idx) => {
        const d = dogPositions[idx];
        if (d) {
          const r = 0.8;
          child.position.x = d.pos[0] + Math.cos(time * 0.5 + idx * 2) * r;
          child.position.z = d.pos[2] + Math.sin(time * 0.5 + idx * 2) * r;
          child.rotation.y = time * 0.5 + idx * 2 + Math.PI / 2;
          child.position.y = d.pos[1];
        }
      });
    }

    if (clancyRef.current) {
      clancyRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <group>
      <OrbitControls makeDefault maxDistance={25} minDistance={3} enablePan={false} maxPolarAngle={Math.PI / 2 - 0.05} />
      <Environment preset="sunset" />

      {/* Ambient & Point Lighting */}
      <ambientLight intensity={0.4} color="#8e24aa" />
      <pointLight position={[0, 8, 0]} intensity={100} color="#ffb300" distance={25} />
      <pointLight position={[0, -2, -5]} intensity={50} color="#2ecc71" distance={25} />
      <pointLight position={[-6, 4, -8]} intensity={60} color="#ff007f" distance={20} />
      <pointLight position={[6, 4, -8]} intensity={60} color="#00ffff" distance={20} />

      {/* 1. UNDULATING FLOOR LAND-PLATE */}
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
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
        <group
          ref={coreRef}
          position={[0, 0.5, 0]}
          onClick={(e) => { e.stopPropagation(); openDialogue(1); }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          <mesh>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#fff" emissive="#ffea00" emissiveIntensity={2} roughness={0} />
          </mesh>
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
          <mesh rotation={[Math.PI / 2.5, 0, 0]}>
            <torusGeometry args={[0.9, 0.04, 8, 48]} />
            <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={2} />
          </mesh>
        </group>
      </Float>

      {/* 3. BEACH BODY CLANCY AVATAR PLACEHOLDER (Fuchsia Glowing Capsule) */}
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

      {/* 4. WHITE HOUSE KEEP — real model, wireframe box as loading fallback */}
      <Suspense fallback={
        <mesh position={[0, 0.65, -15]}>
          <boxGeometry args={[10, 5, 6]} />
          <meshBasicMaterial color="#c42030" wireframe />
        </mesh>
      }>
        <group position={[0, -1.85, -15]}>
          <WhiteHouse />
        </group>
      </Suspense>

      {/* 5. CURE CANNONS PLACEHOLDERS (Neon Green Glowing Pillars) */}
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

      {/* 6. ZOMBIE HORDE — real warriors replace octahedrons */}
      <Suspense fallback={null}>
        <group ref={zombiesRef}>
          <ZombieHorde positions={zombiePositions} />
        </group>
      </Suspense>

      {/* 6b. CHARLOTTE'S KIN — roaming zombie dogs */}
      <Suspense fallback={null}>
        <group ref={dogsRef}>
          <ZombieDogs positions={dogPositions} />
        </group>
      </Suspense>

      {/* Dialogue Proximity & Text Billboards */}
      <NPCAttentionCatcher npcPosition={[0, 1.2, 0]} npcName="Glasses Man" targetLevelId={1} />
      <KineticDialogue position={[0, 3.2, 0]} />

      {/* High-quality air particles */}
      <Sparkles count={200} scale={24} size={4} speed={0.3} opacity={0.5} color="#2ecc71" />
      <Sparkles count={100} scale={24} size={6} speed={0.15} opacity={0.3} color="#8e24aa" />

      {/* Return to Hub Platform Portal */}
      <group position={[0, -1.0, 9]}>
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
          <mesh onClick={handleBackToHub} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
            <boxGeometry args={[3.2, 0.4, 1.2]} />
            <meshStandardMaterial color="#424242" emissive="#ffb300" emissiveIntensity={0.6} roughness={0.3} />
          </mesh>
          <Text position={[0, 0.5, 0]} fontSize={0.35} color="white" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000">
            Return to Hub
          </Text>
        </Float>
      </group>

      {/* Fallback Ground Grid Platform */}
      <gridHelper args={[60, 40, '#8e24aa', '#3b0066']} position={[0, -1.9, 0]} />
    </group>
  );
};

// Warm the GLTF cache as soon as this module is imported
useGLTF.preload(`${MODEL_BASE}/white_house_2.glb`);
useGLTF.preload(`${MODEL_BASE}/zombie_warrior.glb`);
useGLTF.preload(`${MODEL_BASE}/zombie_dog.glb`);

export default ZombieCapitol;
