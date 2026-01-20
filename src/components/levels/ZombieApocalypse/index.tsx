import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import DistortedBuilding from './DistortedBuilding';
import ZombieCrowd from './ZombieCrowd';
import VoxelArtifact from '../../interactive/VoxelArtifact';

/**
 * Level 1: Zombie Apocalypse (Taste of the King)
 * 
 * Theme: Drugs, Spirituality, Governmental Decay
 * Visual: Decaying White House with zombie crowd
 * Enhanced with interactive elements and sound-reactive features
 */

interface ZombieApocalypseProps {
  isActive: boolean;
  scrollProgress?: number;
}

// Interactive Drug Capsule - Click to "consume" for visual effect
function DrugCapsule({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [consumed, setConsumed] = useState(false);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current || consumed) return;

    const time = state.clock.elapsedTime;
    // Floating animation
    meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.3;
    meshRef.current.rotation.y = time * 0.5;
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;

    // Hover scale
    const targetScale = hovered ? 1.3 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  const handleClick = () => {
    setConsumed(true);
    // Reset after effect duration
    setTimeout(() => setConsumed(false), 3000);
  };

  if (consumed) {
    // Explosion effect when consumed
    return (
      <group position={position}>
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial color={color} transparent opacity={0.8} />
            </mesh>
          );
        })}
        <pointLight color={color} intensity={3} distance={10} />
      </group>
    );
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={handleClick}
    >
      <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 1 : 0.5}
        roughness={0.3}
        metalness={0.5}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// Decay Particle System - Enhanced with animation
function DecayParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 300;

  // Initialize velocities once
  const velocities = useMemo(() => {
    const vel = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = -0.01 - Math.random() * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return vel;
  }, []);

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = Math.random() * 15 - 1;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;

    // Color variation: purple to pink
    const mix = Math.random();
    colors[i * 3] = 0.18 + mix * 0.82;     // R: 0.18 -> 1.0
    colors[i * 3 + 1] = mix * 0.5;          // G: 0 -> 0.5
    colors[i * 3 + 2] = 0.31 + mix * 0.2;   // B: 0.31 -> 0.51
  }

  useFrame((state) => {
    if (!particlesRef.current) return;

    const posAttr = particlesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < particleCount; i++) {
      // Update position
      posAttr.array[i * 3] += velocities[i * 3] + Math.sin(time + i) * 0.002;
      posAttr.array[i * 3 + 1] += velocities[i * 3 + 1];
      posAttr.array[i * 3 + 2] += velocities[i * 3 + 2];

      // Reset if below ground or too far
      if (posAttr.array[i * 3 + 1] < -2) {
        posAttr.array[i * 3] = (Math.random() - 0.5) * 30;
        posAttr.array[i * 3 + 1] = 15;
        posAttr.array[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Apocalypse Atmosphere with animated gradient
function ApocalypseAtmosphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
  });

  return (
    <mesh ref={meshRef} position={[0, 10, -25]} scale={[60, 30, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#2E004F"
        emissive="#FF007F"
        emissiveIntensity={0.1}
        roughness={1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Floating Warning Sign - Interactive
function WarningSign({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
    groupRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.2;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* Sign board */}
      <mesh>
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial
          color={hovered ? "#ff0000" : "#DAA520"}
          emissive={hovered ? "#ff0000" : "#DAA520"}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          roughness={0.5}
        />
      </mesh>
      {/* Skull symbol */}
      <mesh position={[0, 0, 0.06]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Pole */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#4A3728" roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function ZombieApocalypse({ isActive }: ZombieApocalypseProps) {
  const { scene } = useThree();

  useEffect(() => {
    if (isActive) {
      scene.fog = new THREE.Fog(0x2E004F, 20, 60);
    }
  }, [isActive, scene]);

  if (!isActive) return null;

  return (
    <group>
      {/* Background atmosphere */}
      <ApocalypseAtmosphere />

      {/* == LIGHTING == */}
      <ambientLight intensity={0.5} color="#FF007F" />

      {/* Main overhead light */}
      <pointLight
        position={[0, 12, 0]}
        intensity={1.5}
        color="#DAA520"
        castShadow
        distance={50}
      />

      {/* Accent lights */}
      <pointLight position={[-10, 3, -5]} intensity={1} color="#FF007F" distance={35} />
      <pointLight position={[10, 2, -5]} intensity={0.8} color="#00FFFF" distance={30} />
      <pointLight position={[0, 5, 5]} intensity={0.5} color="#ffffff" distance={25} />

      {/* == MAIN ELEMENTS == */}
      <DistortedBuilding />
      <ZombieCrowd />

      {/* == INTERACTIVE ELEMENTS == */}

      {/* Drug Capsules - representing the episode theme */}
      <DrugCapsule position={[-4, 2, -2]} color="#FF007F" />
      <DrugCapsule position={[5, 3, -4]} color="#00FFFF" />
      <DrugCapsule position={[0, 4, -6]} color="#9900ff" />
      <DrugCapsule position={[-6, 1.5, -3]} color="#DAA520" />

      {/* Voxel Artifacts */}
      {/* Mega Pill: Neon Capsule Artifact (Updated) */}
      <VoxelArtifact position={[-2, 3, -5]} scale={0.10} type="capsule" />

      {/* Mutated Flesh Block: Zombie Artifact */}
      <VoxelArtifact position={[6, 0, 3]} scale={0.08} type="flesh" />

      {/* Warning Signs */}
      <WarningSign position={[-8, 2, -1]} />
      <WarningSign position={[8, 2.5, -2]} />

      {/* == PARTICLE SYSTEMS == */}
      <DecayParticles />

      {/* == ENVIRONMENT == */}

      {/* Ground plane */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#3A2718"
          roughness={0.9}
          emissive="#2E004F"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Blood pools - decorative */}
      {[[-5, -0.48, 2], [3, -0.48, -3], [-2, -0.48, -5]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1 + Math.random(), 16]} />
          <meshStandardMaterial
            color="#4A0000"
            emissive="#FF0000"
            emissiveIntensity={0.2}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}
