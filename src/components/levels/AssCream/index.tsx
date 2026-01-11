import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import FishBowl from './FishBowl';
import SpaceCatCrowd from './SpaceCatCrowd';

/**
 * Level 3: Ass Cream (Hunters Without Home)
 * 
 * Theme: Magic, Enlightenment, Cosmic Wandering
 * Visual: Underwater/space dreamscape with floating cats
 * Enhanced with interactive bubbles and mystical elements
 */

interface AssCreamProps {
  isActive: boolean;
  scrollProgress?: number;
}

// Interactive Magic Bubble - Click to pop with sparkles
function MagicBubble({ position, size = 0.5 }: { position: [number, number, number]; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [popped, setPopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const popTimeRef = useRef(0);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    if (!popped) {
      // Floating wobble
      meshRef.current.position.y = position[1] + Math.sin(time * 1.5 + position[0]) * 0.5;
      meshRef.current.position.x = position[0] + Math.sin(time * 0.8 + position[2]) * 0.3;

      // Wobble deformation
      const wobble = 1 + Math.sin(time * 3) * 0.05;
      meshRef.current.scale.set(
        (hovered ? 1.2 : 1) * wobble * size,
        (hovered ? 1.2 : 1) * (2 - wobble) * size,
        (hovered ? 1.2 : 1) * size
      );
    }
  });

  const handleClick = () => {
    if (!popped) {
      setPopped(true);
      popTimeRef.current = Date.now();
      // Reset after animation
      setTimeout(() => setPopped(false), 2000);
    }
  };

  if (popped) {
    // Sparkle explosion
    const sparkles = 15;
    return (
      <group position={position}>
        {[...Array(sparkles)].map((_, i) => {
          const angle = (i / sparkles) * Math.PI * 2;
          const elevation = (Math.random() - 0.5) * 2;
          const dist = 0.5 + Math.random() * 1;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * dist,
                elevation,
                Math.sin(angle) * dist
              ]}
            >
              <octahedronGeometry args={[0.08, 0]} />
              <meshBasicMaterial
                color={i % 2 === 0 ? "#00FFFF" : "#FF007F"}
                transparent
                opacity={0.8}
              />
            </mesh>
          );
        })}
        <pointLight color="#00FFFF" intensity={2} distance={5} />
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
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#88DDFF"
        emissive="#00FFFF"
        emissiveIntensity={hovered ? 0.5 : 0.2}
        roughness={0}
        metalness={0.1}
        transparent
        opacity={0.4}
        envMapIntensity={1}
      />
    </mesh>
  );
}

// Floating Crystal - Mystical artifact
function MysticCrystal({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [activated, setActivated] = useState(false);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    // Rotation
    meshRef.current.rotation.y = time * 0.5;
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.3;

    // Float
    meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.2;

    // Pulse when activated
    if (activated) {
      const pulse = 1 + Math.sin(time * 8) * 0.2;
      meshRef.current.scale.setScalar(pulse);
    } else {
      meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={() => setActivated(!activated)}
      >
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color={activated ? "#FF007F" : "#9900FF"}
          emissive={activated ? "#FF007F" : "#9900FF"}
          emissiveIntensity={activated ? 1.5 : 0.5}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.03, 8, 32]} />
        <meshBasicMaterial
          color={activated ? "#FF007F" : "#00FFFF"}
          transparent
          opacity={hovered ? 0.6 : 0.3}
        />
      </mesh>

      {/* Light source */}
      <pointLight
        color={activated ? "#FF007F" : "#9900FF"}
        intensity={activated ? 3 : 1}
        distance={15}
      />
    </group>
  );
}

// Underwater Caustics Effect
function UnderwaterCaustics() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.05 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
  });

  return (
    <mesh ref={meshRef} position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50, 32, 32]} />
      <meshBasicMaterial
        color="#00FFFF"
        transparent
        opacity={0.05}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Rising Bubbles Particle System
function RisingBubbles({ count = 100 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = Math.random() * 20 - 5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    sizes[i] = 0.05 + Math.random() * 0.15;
  }

  useFrame((state) => {
    if (!pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      // Rise upward
      posAttr.array[i * 3 + 1] += 0.02 + Math.sin(time + i) * 0.01;

      // Horizontal wobble
      posAttr.array[i * 3] += Math.sin(time * 2 + i * 0.5) * 0.005;

      // Reset if too high
      if (posAttr.array[i * 3 + 1] > 15) {
        posAttr.array[i * 3 + 1] = -5;
        posAttr.array[i * 3] = (Math.random() - 0.5) * 30;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#88DDFF"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function AssCream({ isActive }: AssCreamProps) {
  const { scene } = useThree();

  useEffect(() => {
    if (isActive) {
      // Dreamy underwater fog
      scene.fog = new THREE.Fog(0x001133, 15, 50);
    }
  }, [isActive, scene]);

  if (!isActive) return null;

  return (
    <group>
      {/* == LIGHTING == */}

      {/* Ambient - underwater mood */}
      <ambientLight intensity={0.4} color="#00FFFF" />

      {/* Primary light from above */}
      <directionalLight
        position={[0, 20, 10]}
        intensity={1.2}
        color="#00FFFF"
        castShadow
      />

      {/* Side accents */}
      <pointLight position={[-15, 0, -5]} intensity={1} color="#FF007F" distance={40} />
      <pointLight position={[15, 0, -5]} intensity={1} color="#FF007F" distance={40} />

      {/* Mystical glow from below */}
      <pointLight position={[0, -5, 0]} intensity={0.5} color="#9900FF" distance={30} />

      {/* == MAIN ELEMENTS == */}
      <FishBowl />
      <SpaceCatCrowd />

      {/* == INTERACTIVE ELEMENTS == */}

      {/* Magic Bubbles - pop for sparkles */}
      <MagicBubble position={[-5, 3, -3]} size={0.8} />
      <MagicBubble position={[4, 5, -5]} size={1.0} />
      <MagicBubble position={[-3, 7, -7]} size={0.6} />
      <MagicBubble position={[6, 2, -2]} size={0.5} />
      <MagicBubble position={[0, 8, -8]} size={1.2} />

      {/* Mystic Crystals */}
      <MysticCrystal position={[-8, 4, -6]} />
      <MysticCrystal position={[7, 6, -8]} />

      {/* == PARTICLE SYSTEMS == */}
      <RisingBubbles count={150} />

      {/* == ENVIRONMENT == */}

      {/* Caustics effect */}
      <UnderwaterCaustics />

      {/* Void background */}
      <mesh position={[0, 0, -30]} scale={[80, 60, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#000022"
          emissive="#2E004F"
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ocean floor */}
      <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#001133"
          emissive="#00FFFF"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}
