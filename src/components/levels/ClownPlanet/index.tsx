import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useSoundEffects } from '@hooks/useSoundEffects';
import GrindingMechanism from './GrindingMechanism';
import ClownCrowd from './ClownCrowd';

/**
 * Level 2: Clown Planet (Officers & Wolves)
 * 
 * Theme: Death, Acceptance, Institutional Grinding
 * Visual: Carnival-esque meat grinder with clown crowd
 * Enhanced with interactive carnival games and effects
 */

interface ClownPlanetProps {
  isActive: boolean;
  scrollProgress?: number;
}

// Interactive Balloon - Click to pop with confetti
function CarnivalBalloon({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const stringRef = useRef<THREE.Mesh>(null);
  const [popped, setPopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { playClick, playChime } = useSoundEffects();

  useFrame((state) => {
    if (!meshRef.current || popped) return;

    const time = state.clock.elapsedTime;

    // Gentle swaying
    meshRef.current.position.x = position[0] + Math.sin(time * 2 + position[2]) * 0.3;
    meshRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.2;

    // Hover effect
    const scale = hovered ? 1.3 : 1;
    meshRef.current.scale.setScalar(scale);

    // String follows
    if (stringRef.current) {
      stringRef.current.position.x = meshRef.current.position.x;
      stringRef.current.position.y = meshRef.current.position.y - 1;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setPopped(true);
    playClick();
    setTimeout(() => playChime(), 100);
    setTimeout(() => setPopped(false), 3000);
  };

  if (popped) {
    // Confetti explosion
    return (
      <group position={position}>
        {[...Array(20)].map((_, i) => {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 2;
          const height = Math.random() * 2 - 0.5;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * dist,
                height,
                Math.sin(angle) * dist
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
            >
              <boxGeometry args={[0.1, 0.1, 0.02]} />
              <meshBasicMaterial
                color={['#FF007F', '#00FFFF', '#FFD700', '#FF4500', '#9900FF'][i % 5]}
              />
            </mesh>
          );
        })}
      </group>
    );
  }

  return (
    <group>
      {/* Balloon */}
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          roughness={0.3}
        />
      </mesh>

      {/* String */}
      <mesh ref={stringRef} position={[position[0], position[1] - 1, position[2]]}>
        <cylinderGeometry args={[0.01, 0.01, 1.5, 4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// Spinning Prize Wheel
function SpinningWheel({ position }: { position: [number, number, number] }) {
  const wheelRef = useRef<THREE.Mesh>(null);
  const [spinning, setSpinning] = useState(false);
  const spinVelocityRef = useRef(0);

  useFrame((_state, delta) => {
    if (!wheelRef.current) return;

    if (spinning) {
      spinVelocityRef.current *= 0.98; // Slow down
      wheelRef.current.rotation.z += spinVelocityRef.current;

      if (spinVelocityRef.current < 0.01) {
        setSpinning(false);
      }
    } else {
      // Gentle idle rotation
      wheelRef.current.rotation.z += delta * 0.1;
    }
  });

  const handleClick = () => {
    if (!spinning) {
      setSpinning(true);
      spinVelocityRef.current = 0.3 + Math.random() * 0.3;
    }
  };

  const segments = 8;
  const colors = ['#FF007F', '#00FFFF', '#FFD700', '#9900FF', '#FF4500', '#00FF00', '#FF69B4', '#4169E1'];

  return (
    <group position={position}>
      {/* Wheel segments */}
      <mesh
        ref={wheelRef}
        onClick={handleClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <cylinderGeometry args={[2, 2, 0.2, segments]} />
        <meshStandardMaterial color="#2E004F" />
      </mesh>

      {/* Colored segments */}
      {colors.map((color, i) => {
        const angle = (i / segments) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 1.2,
              Math.sin(angle) * 1.2,
              0.15
            ]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.4, 6]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}

      {/* Center pin */}
      <mesh position={[0, 0, 0.2]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.5}
          metalness={0.8}
        />
      </mesh>

      {/* Pointer */}
      <mesh position={[0, 2.3, 0.15]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.2, 0.5, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// Enhanced Grinding Particles
function GrindingParticles({ count = 350 }: { count?: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef(new Float32Array(count * 3));

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.5 + Math.random() * 2;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random() * 3;
    positions[i * 3 + 2] = Math.sin(angle) * radius - 5;

    // Velocity
    velocitiesRef.current[i * 3] = (Math.random() - 0.5) * 0.1;
    velocitiesRef.current[i * 3 + 1] = -0.02 - Math.random() * 0.03;
    velocitiesRef.current[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

    // Color: pink to red meat colors
    const mix = Math.random();
    colors[i * 3] = 1.0;
    colors[i * 3 + 1] = mix * 0.4;
    colors[i * 3 + 2] = mix * 0.5;
  }

  useFrame(() => {
    if (!particlesRef.current) return;

    const posAttr = particlesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const vel = velocitiesRef.current;

    for (let i = 0; i < count; i++) {
      // Update position
      posAttr.array[i * 3] += vel[i * 3];
      posAttr.array[i * 3 + 1] += vel[i * 3 + 1];
      posAttr.array[i * 3 + 2] += vel[i * 3 + 2];

      // Reset if fallen
      if (posAttr.array[i * 3 + 1] < -2) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.5 + Math.random() * 2;
        posAttr.array[i * 3] = Math.cos(angle) * radius;
        posAttr.array[i * 3 + 1] = 3;
        posAttr.array[i * 3 + 2] = Math.sin(angle) * radius - 5;
      }
    }

    posAttr.needsUpdate = true;
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
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Carnival Atmosphere
function CarnivalAtmosphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    mat.emissiveIntensity = 0.15 + pulse;
  });

  return (
    <mesh ref={meshRef} position={[0, 8, -25]} scale={[60, 30, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#FF7F7F"
        emissive="#FF007F"
        emissiveIntensity={0.15}
        roughness={1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function ClownPlanet({ isActive }: ClownPlanetProps) {
  const { scene } = useThree();

  useEffect(() => {
    if (isActive) {
      scene.fog = new THREE.Fog(0x2E004F, 15, 50);
    }
  }, [isActive, scene]);

  if (!isActive) return null;

  return (
    <group>
      {/* Atmosphere */}
      <CarnivalAtmosphere />

      {/* == LIGHTING == */}
      <ambientLight intensity={0.6} color="#FF007F" />

      <pointLight position={[0, 10, 0]} intensity={1.5} color="#FF007F" distance={50} />
      <pointLight position={[-12, 2, -5]} intensity={1} color="#00FFFF" distance={40} />
      <pointLight position={[12, 2, -5]} intensity={0.8} color="#FFD700" distance={35} />
      <pointLight position={[0, 5, 5]} intensity={0.5} color="#ffffff" distance={25} />

      {/* == MAIN ELEMENTS == */}
      <GrindingMechanism />
      <ClownCrowd />

      {/* == INTERACTIVE ELEMENTS == */}

      {/* Balloons */}
      <CarnivalBalloon position={[-6, 4, -2]} color="#FF007F" />
      <CarnivalBalloon position={[5, 5, -3]} color="#00FFFF" />
      <CarnivalBalloon position={[-3, 6, -5]} color="#FFD700" />
      <CarnivalBalloon position={[7, 3, -1]} color="#9900FF" />
      <CarnivalBalloon position={[0, 7, -6]} color="#FF4500" />

      {/* Spinning Prize Wheel */}
      <SpinningWheel position={[-10, 3, -3]} />
      <SpinningWheel position={[10, 3, -3]} />

      {/* == PARTICLE SYSTEMS == */}
      <GrindingParticles count={400} />

      {/* == ENVIRONMENT == */}

      {/* Ground */}
      <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#2E004F"
          roughness={0.85}
          emissive="#2E004F"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Stage lights */}
      {[[-8, 8, -10], [8, 8, -10], [0, 10, -8]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial
            color={['#FF007F', '#00FFFF', '#FFD700'][i]}
            emissive={['#FF007F', '#00FFFF', '#FFD700'][i]}
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}
