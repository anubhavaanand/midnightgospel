import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import SkeletalLandscape from './SkeletalLandscape';
import SoulBird from './SoulBird';

/**
 * Blinded by My End - Level 4 (Episode 4)
 * 
 * Theme: Forgiveness, Listening, Warmth
 * Visual: Warm, healing glow against the darkness with animated embers
 * Enhanced with interactive elements and dynamic particle systems
 */

// Animated Ember Particles - Rising flames of healing
function HealingEmbers({ count = 200 }: { count?: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array>(new Float32Array(count * 3));

  const [positions, sizes, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const vel = velocitiesRef.current;

    for (let i = 0; i < count; i++) {
      // Spread embers around the scene
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = Math.random() * 15 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;

      // Upward velocity with some horizontal drift
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = 0.02 + Math.random() * 0.04;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      // Varying sizes - mostly small with some larger ones
      siz[i] = 0.05 + Math.random() * 0.15;

      // Color gradient: orange -> gold -> white
      const colorMix = Math.random();
      if (colorMix > 0.8) {
        // White-hot embers
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.95;
        col[i * 3 + 2] = 0.8;
      } else if (colorMix > 0.4) {
        // Gold embers
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.8;
        col[i * 3 + 2] = 0.2;
      } else {
        // Orange embers
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.5;
        col[i * 3 + 2] = 0.1;
      }
    }

    return [pos, siz, col];
  }, [count]);

  useFrame((state) => {
    if (!particlesRef.current) return;

    const posAttr = particlesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const sizeAttr = particlesRef.current.geometry.getAttribute('size') as THREE.BufferAttribute;
    const vel = velocitiesRef.current;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      // Update position
      posAttr.array[i * 3] += vel[i * 3] + Math.sin(time + i) * 0.003;
      posAttr.array[i * 3 + 1] += vel[i * 3 + 1];
      posAttr.array[i * 3 + 2] += vel[i * 3 + 2];

      // Flicker effect
      const flicker = 0.7 + Math.sin(time * 4 + i * 2) * 0.3;
      sizeAttr.array[i] = sizes[i] * flicker;

      // Reset if too high
      if (posAttr.array[i * 3 + 1] > 15) {
        posAttr.array[i * 3] = (Math.random() - 0.5) * 40;
        posAttr.array[i * 3 + 1] = -2;
        posAttr.array[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
      }
    }

    posAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
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
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Interactive Healing Orb - Pulses when hovered
function HealingOrb({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const scale = hovered ? 1.3 : 1 + Math.sin(time * 2) * 0.1;
    meshRef.current.scale.setScalar(scale);

    // Rotation
    meshRef.current.rotation.y = time * 0.5;
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;

    // Update emissive intensity
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = hovered ? 1.5 : 0.8 + Math.sin(time * 3) * 0.3;
  });

  const handleClick = () => {
    setClicked(!clicked);
    // Could trigger audio or other effects here
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color={clicked ? "#ffffff" : "#ff9900"}
          emissive={clicked ? "#ffcc00" : "#ff6600"}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh scale={hovered ? 1.8 : 1.5}>
        <torusGeometry args={[1, 0.05, 8, 32]} />
        <meshBasicMaterial
          color="#ffcc00"
          transparent
          opacity={hovered ? 0.6 : 0.3}
        />
      </mesh>

      {/* Point light that intensifies on hover */}
      <pointLight
        color="#ff9900"
        intensity={hovered ? 3 : 1.5}
        distance={10}
        decay={2}
      />
    </group>
  );
}

// Healing Rays - Volumetric light beams
function HealingRays() {
  const raysRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!raysRef.current) return;
    raysRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={raysRef} position={[0, 5, -10]}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 8;
        const z = Math.sin(angle) * 8;

        return (
          <mesh
            key={i}
            position={[x, -3, z]}
            rotation={[0.2 * Math.sin(angle), angle, 0]}
          >
            <coneGeometry args={[0.5, 12, 8, 1, true]} />
            <meshBasicMaterial
              color="#ffcc00"
              transparent
              opacity={0.08}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Ground with animated gradient
function WarmGround() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, -2, -8]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[80, 80, 32, 32]} />
      <meshStandardMaterial
        color="#441100"
        emissive="#ff4400"
        emissiveIntensity={0.2}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}

export default function BlindedByEnd({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const { scene } = useThree();

  useFrame((_state, delta) => {
    if (groupRef.current && isActive) {
      timeRef.current += delta;

      // Very subtle breathing effect
      const pulse = Math.sin(timeRef.current * 1.5) * 0.02 + 1;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  useEffect(() => {
    if (isActive) {
      // Warm atmospheric fog
      scene.fog = new THREE.Fog(0x331100, 20, 80);
    }
  }, [isActive, scene]);

  if (!isActive) return null;

  return (
    <group ref={groupRef}>
      {/* == LIGHTING SETUP == */}

      {/* Main warm ambient */}
      <ambientLight color="#ff9900" intensity={0.5} />

      {/* Key light - Golden sun feel */}
      <directionalLight
        position={[15, 20, 10]}
        color="#ffcc00"
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Rim light - Orange accent */}
      <pointLight position={[10, 5, 5]} color="#ffcc00" intensity={1.2} distance={50} />

      {/* Fill light - Soft pink warmth */}
      <pointLight position={[-10, 8, -5]} color="#ff8866" intensity={0.8} distance={50} />

      {/* Central radiance */}
      <pointLight position={[0, 3, -5]} color="#ffffff" intensity={0.6} distance={30} />

      {/* Backlight for depth */}
      <pointLight position={[0, 0, -20]} color="#ff6600" intensity={0.5} distance={40} />

      {/* == ENVIRONMENT == */}

      {/* Skeletal Landscape - transformed by warm lighting */}
      <SkeletalLandscape />

      {/* Soul Bird - the listener/guide */}
      <SoulBird />

      {/* Healing Rays - volumetric light effect */}
      <HealingRays />

      {/* == INTERACTIVE ELEMENTS == */}

      {/* Healing Orbs - clickable/hoverable */}
      <HealingOrb position={[-6, 3, -3]} />
      <HealingOrb position={[7, 4, -6]} />
      <HealingOrb position={[0, 6, -12]} />

      {/* == PARTICLE SYSTEMS == */}

      {/* Animated healing embers rising */}
      <HealingEmbers count={250} />

      {/* == GROUND == */}

      {/* Warm reflective ground */}
      <WarmGround />

      {/* Fog plane for atmosphere */}
      <mesh position={[0, 8, -30]} scale={[100, 40, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
