import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SkeletalLandscape from './SkeletalLandscape';
import SoulBird from './SoulBird';
// TEMPORARILY DISABLED: 29MB model causing WebGL crash
// import FallenAngel from '@components/models/FallenAngel';

/**
 * Soul Prison Level - Level 4
 * 
 * Location: 0.75-0.90 of scroll journey (descending spiral)
 * Episode Theme: "Annihilation of Joy" (spiritual ego death)
 * 
 * Visual Philosophy:
 * - Hellscape inspired by Hieronymus Bosch's depictions of purgatory
 * - Isolated soul (represented by Soul Bird)
 * - Skeletal remains of ego (bone landscape)
 * - Existential dread + transcendence juxtaposition
 * - High-contrast lighting emphasizes horror-beauty balance
 * 
 * Design Elements:
 * 1. SkeletalLandscape: Central visual (skull, bone formations, fragments)
 * 2. SoulBird: Moving focal point (escape/transcendence symbol)
 * 3. Lighting: Harsh rim lights (existential exposure) + soft ambient
 * 4. Atmosphere: Fog + darkness for oppressive mood
 * 5. Particle System: Sparse soul particles (distressed energy)
 * 
 * Color Palette (Strict Enforcement):
 * - Bone White: #F0F0F0 (80% - main landscape)
 * - Deep Purple: #2E004F (15% - shadows, base tone)
 * - Cyan Energy: #00FFFF (5% - soul/spiritual aspect)
 * - Black Void: #0A0E27 (background darkness)
 * 
 * Performance Target: 8-12ms GPU time (60 FPS achievable)
 * 
 * Animation Techniques:
 * - Skeletal oscillation: Subtle movement (unease)
 * - Soul Bird orbiting: Graceful flight pattern
 * - Particle spawning: Random emission from skull
 * - Lighting flicker: Subtle pulsing (distressed)
 * - Camera fog: Atmospheric depth
 */

export default function SoulPrison({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const particlePositions = useMemo(() => {
    const count = 80;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 8;
    }
    return positions;
  }, []);

  const particleGeometry = useMemo(
    () => new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(particlePositions, 3)),
    [particlePositions]
  );

  useFrame((state: any) => {
    if (groupRef.current && isActive) {
      timeRef.current += state.delta;

      // Update camera fog
      state.camera.fog = new THREE.Fog(0x0a0e27, 40, 80);

      // Subtle flickering of scene to enhance distress
      const flicker = Math.sin(timeRef.current * 3.5) * 0.02 + 0.98;
      if (groupRef.current.children[3] instanceof THREE.Light) {
        const ambientLight = groupRef.current.children[3] as THREE.Light;
        ambientLight.intensity = 0.3 * flicker;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient Light - Subtle existential glow */}
      <ambientLight color="#2E004F" intensity={0.3} />

      {/* Rim Light 1 - Cyan (Soul/Spiritual) */}
      <pointLight position={[12, 6, 0]} color="#00FFFF" intensity={0.6} distance={30} />

      {/* Rim Light 2 - Purple (Ego/Shadow) */}
      <pointLight position={[-12, 6, 0]} color="#2E004F" intensity={0.5} distance={30} />

      {/* Spotlight on landscape center */}
      <pointLight position={[0, 8, -8]} color="#F0F0F0" intensity={0.4} distance={25} />

      {/* Skeletal Landscape - Main visual centerpiece */}
      <SkeletalLandscape />

      {/* Soul Bird - Mystical escape entity */}
      <SoulBird />

      {/* Fallen Angel - TEMPORARILY DISABLED (29MB model causing WebGL crash)
      <FallenAngel position={[-8, 0, -12]} rotation={[0, 0.5, 0]} scale={0.015} />
      */}

      {/* Atmosphere Plane - Fog effect layer */}
      <mesh position={[0, 8, 0]} scale={[40, 1, 40]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#0A0E27"
          transparent
          opacity={0.15}
          emissive="#2E004F"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Distant void plane - Background nothingness */}
      <mesh position={[0, 5, -25]} scale={[60, 30, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#0A0E27"
          emissive="#2E004F"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Prison Bars - Vertical light beams representing confinement */}
      <PrisonBars />

      {/* Soul Particles - Distressed energy */}
      <points geometry={particleGeometry} position={[0, 0, 0]}>
        <pointsMaterial
          color="#00FFFF"
          size={0.3}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.6}
        />
      </points>

      {/* Ground reference plane - Subtle gradient */}
      <mesh position={[0, -1, -8]} rotation={[-Math.PI / 2, 0, 0]} scale={[50, 50, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#2E004F"
          emissive="#2E004F"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Rim light plane - Cyan spiritual glow */}
      <mesh position={[0, 15, 5]} rotation={[-0.2, 0, 0]} scale={[50, 30, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#00FFFF"
          transparent
          opacity={0.08}
          emissive="#00FFFF"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

// Interactive Prison Bars
function PrisonBars() {
  const barsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!barsRef.current) return;
    // Subtle breathing motion of the cage
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    barsRef.current.scale.set(scale, 1, scale);
  });

  return (
    <group ref={barsRef} position={[0, 0, 0]}>
      {/* Circle of light bars */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 15;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, 10, Math.sin(angle) * radius]}
            rotation={[0, -angle, 0]}
          >
            <cylinderGeometry args={[0.2, 0.2, 40, 8]} />
            <meshStandardMaterial
              color="#00FFFF"
              emissive="#00FFFF"
              emissiveIntensity={2}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}
