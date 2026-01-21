import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { useFBX } from '@react-three/drei';
import { useSoundEffects } from '@hooks/useSoundEffects';
import * as THREE from 'three';
import ParticleExplosion from './ParticleExplosion';
import EgoFormations from './EgoFormations';
import FallenAngel from '@components/models/FallenAngel';
import SoulShard from '@components/gameplay/SoulShard';

/**
 * The Exit - Level 6 (Final Transcendence)
 * 
 * Theme: Ego Death, Rebirth, Cosmic Unity
 * Visual: Spectacular particle explosion with consciousness expansion
 * Enhanced with interactive third eye portal and transcendent effects
 */

// Interactive Third Eye Portal - The center of transcendence
function ThirdEyePortal() {
  const portalRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const [activated, setActivated] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { playHover, playActivate, playDeactivate, playPulse } = useSoundEffects();

  useFrame((state) => {
    if (!portalRef.current) return;
    const time = state.clock.elapsedTime;

    // Rotation
    portalRef.current.rotation.z = time * 0.3;

    if (innerRef.current) {
      innerRef.current.rotation.z = -time * 0.5;
      const scale = activated ? 1.5 : 1 + Math.sin(time * 2) * 0.1;
      innerRef.current.scale.setScalar(scale);

      const mat = innerRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = activated ? 2 : 0.8 + Math.sin(time * 4) * 0.4;
    }

    if (outerRef.current) {
      const pulse = 1 + Math.sin(time * 1.5) * 0.15;
      outerRef.current.scale.setScalar(activated ? 2 : pulse);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setActivated(!activated);
    if (!activated) {
      playActivate();
      // Add a delayed pulse sound
      setTimeout(() => playPulse(), 500);
    } else {
      playDeactivate();
    }
  };

  return (
    <group ref={portalRef} position={[0, 5, -8]}>
      {/* Inner eye - The consciousness core */}
      <mesh
        ref={innerRef}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
          playHover();
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={handleClick}
      >
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial
          color={activated ? "#ffffff" : "#00FFFF"}
          emissive={activated ? "#00FFFF" : "#FF007F"}
          emissiveIntensity={0.8}
          side={THREE.DoubleSide}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Iris rings */}
      {[1, 2, 3].map((i) => (
        <mesh key={i} scale={[i * 0.6, i * 0.6, 1]}>
          <torusGeometry args={[1.5, 0.08, 8, 64]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#FF007F" : "#00FFFF"}
            transparent
            opacity={0.6 - i * 0.15}
          />
        </mesh>
      ))}

      {/* Outer aura */}
      <mesh ref={outerRef}>
        <ringGeometry args={[2, 3.5, 64]} />
        <meshBasicMaterial
          color="#FF007F"
          transparent
          opacity={hovered ? 0.5 : 0.25}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Radiant light when activated */}
      <pointLight
        color={activated ? "#00FFFF" : "#FF007F"}
        intensity={activated ? 5 : 2}
        distance={50}
        decay={2}
      />

      {/* Spiral energy lines */}
      {activated && [0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={`spiral-${i}`}
            position={[Math.cos(angle) * 4, Math.sin(angle) * 4, 0]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[0.1, 3, 0.1]} />
            <meshBasicMaterial
              color="#00FFFF"
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Consciousness Waves - Rippling outward from center
function ConsciousnessWaves() {
  const waveRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    waveRefs.current.forEach((wave, i) => {
      if (!wave) return;
      const phase = (time * 0.5 + i * 0.3) % 3;
      wave.scale.setScalar(1 + phase * 3);
      (wave.material as THREE.MeshBasicMaterial).opacity = 0.3 * (1 - phase / 3);
    });
  });

  return (
    <group position={[0, 5, -8]}>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(ref) => { if (ref) waveRefs.current[i] = ref; }}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[2, 0.3, 8, 64]} />
          <meshBasicMaterial
            color="#00FFFF"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// Floating Consciousness Fragments - Interactive geometric shapes
function ConsciousnessFragments() {
  const fragmentsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!fragmentsRef.current) return;
    fragmentsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  const fragments = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const radius = 12 + Math.random() * 8;
    const height = (Math.random() - 0.5) * 15;
    return {
      position: [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius - 5
      ] as [number, number, number],
      scale: 0.3 + Math.random() * 0.5,
      color: i % 3 === 0 ? "#FF007F" : i % 3 === 1 ? "#00FFFF" : "#F0F0F0"
    };
  });

  return (
    <group ref={fragmentsRef}>
      {fragments.map((frag, i) => (
        <mesh key={i} position={frag.position} scale={frag.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={frag.color}
            emissive={frag.color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

// Cosmic Dust - Gentle ambient particles
function CosmicDust({ count = 300 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 80);
  const positionsArray = new Float32Array(positions);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positionsArray}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Black Hole Model - Massive singularity
function BlackHoleModel() {
  const fbx = useFBX('/models/black-hole/source/black_hole.fbx');

  useFrame((state) => {
    // Slow rotation of the accretion disk
    fbx.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group position={[0, 0, -40]}>
      <primitive
        object={fbx}
        scale={0.05}
        rotation={[0.5, 0, 0]}
      />
      {/* Additional glow for the event horizon */}
      <pointLight color="#8B00FF" intensity={2} distance={100} decay={2} />
    </group>
  );
}

export default function TheExit({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const { scene } = useThree();

  useEffect(() => {
    if (isActive) {
      // Deep cosmic void fog
      scene.fog = new THREE.Fog(0x0a0e27, 15, 80);
    }
  }, [isActive, scene]);

  useFrame((_state, delta) => {
    if (groupRef.current && isActive) {
      timeRef.current += delta;

      // Lighting crescendo - builds toward transcendence
      const crescendo = Math.min(timeRef.current / 5.0, 1.0);
      const lightChildren = groupRef.current.children.filter(
        (c) => c instanceof THREE.PointLight || c instanceof THREE.AmbientLight
      );

      lightChildren.forEach((light) => {
        if (light instanceof THREE.Light) {
          light.intensity = 0.3 + crescendo * 0.7;
        }
      });
    }
  });

  if (!isActive) return null;

  return (
    <group ref={groupRef}>
      {/* == LIGHTING SETUP == */}

      {/* Ambient - Cosmic glow */}
      <ambientLight color="#2E004F" intensity={0.4} />

      {/* Main consciousness light */}
      <pointLight position={[0, 10, 0]} color="#00FFFF" intensity={1.5} distance={60} />

      {/* Pink energy - Ego dissolution */}
      <pointLight position={[15, 5, 5]} color="#FF007F" intensity={1.2} distance={50} />

      {/* Purple grounding */}
      <pointLight position={[-15, 5, -5]} color="#9900ff" intensity={0.8} distance={45} />

      {/* White transcendence */}
      <pointLight position={[0, 20, -5]} color="#ffffff" intensity={0.6} distance={40} />

      {/* == NEW ASSETS == */}
      <BlackHoleModel />

      {/* == INTERACTIVE ELEMENTS == */}

      {/* Third Eye Portal - Main interactive element */}
      <ThirdEyePortal />

      {/* == PARTICLE SYSTEMS == */}

      {/* Main particle explosion */}
      <ParticleExplosion />

      {/* Consciousness waves rippling outward */}
      <ConsciousnessWaves />

      {/* Floating geometric fragments */}
      <ConsciousnessFragments />

      {/* Ambient cosmic dust */}
      <CosmicDust count={400} />

      {/* == GEOMETRIC ELEMENTS == */}

      {/* Ego Formations - Dissolving structures */}
      <EgoFormations />

      {/* Fallen Angel - Final Gatekeeper (only in this level to save memory) */}
      <FallenAngel position={[12, 2, -15]} rotation={[0, -0.8, 0]} scale={0.02} />

      {/* Soul Shards - Final Collectibles */}
      <SoulShard id="exit-shard-1" position={[-8, 4, 3]} value={200} color="#00ffff" />
      <SoulShard id="exit-shard-2" position={[10, 6, -5]} value={250} color="#ff007f" />
      <SoulShard id="exit-shard-3" position={[0, 15, -20]} value={500} color="#ffd700" />

      {/* == ENVIRONMENT == */}

      {/* Void sphere - Infinite backdrop */}
      <mesh position={[0, 0, 0]} scale={[200, 200, 200]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#050510"
          emissive="#2E004F"
          emissiveIntensity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Upper light plane */}
      <mesh position={[0, 25, -10]} rotation={[-0.3, 0, 0]} scale={[80, 40, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#00FFFF"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Lower grounding plane */}
      <mesh position={[0, -10, -8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#0A0E27"
          emissive="#FF007F"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}
