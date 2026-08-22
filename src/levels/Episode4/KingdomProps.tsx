import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * VengeanceKingdom props — Ep4 "Blinded By My End" fusion:
 * medieval duel arena + volcanic forge (project's theme),
 * Trudy's healing rose, heraldic banners, stone arches.
 */

/** Circular duel arena with stone pillars and torches */
export const DuelArena: React.FC<{ position?: [number, number, number] }> = ({ position = [-10, -1.9, -10] }) => {
  const pillars = useMemo(() => Array.from({ length: 8 }), []);
  return (
    <group position={position}>
      {/* Arena floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[5.2, 32]} />
        <meshStandardMaterial color="#4A4A48" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
        <ringGeometry args={[3.8, 4.2, 32]} />
        <meshStandardMaterial color="#c62828" emissive="#c62828" emissiveIntensity={0.35} roughness={0.5} />
      </mesh>
      {pillars.map((_, i) => {
        const a = (i / pillars.length) * Math.PI * 2;
        const lit = i % 2 === 0;
        return (
          <group key={i} position={[Math.sin(a) * 5, 1.4, Math.cos(a) * 5]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.28, 0.34, 2.8, 8]} />
              <meshStandardMaterial color="#55524E" roughness={0.85} />
            </mesh>
            <mesh position={[0, 1.55, 0]}>
              <boxGeometry args={[0.75, 0.4, 0.75]} />
              <meshStandardMaterial color="#605C57" roughness={0.8} />
            </mesh>
            {lit && (
              <>
                <mesh position={[0, 1.95, 0]}>
                  <sphereGeometry args={[0.16, 10, 10]} />
                  <meshStandardMaterial color="#FF9800" emissive="#FF9800" emissiveIntensity={3} />
                </mesh>
                <pointLight position={[0, 2, 0]} intensity={14} color="#FF9800" distance={9} />
              </>
            )}
          </group>
        );
      })}
    </group>
  );
};

/** Heraldic banners fluttering in the heat */
export const Banners: React.FC = () => {
  const bannerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const spots = useMemo<[number, number, number][]>(
    () => [
      [7, 2.2, -7],
      [-7, 2.2, -7],
      [0, 2.6, -11],
      [11, 2.2, 2],
    ],
    []
  );
  useFrame((state) => {
    bannerRefs.current.forEach((m, i) => {
      if (m) m.rotation.y = Math.sin(state.clock.elapsedTime * 1.2 + i * 1.4) * 0.18;
    });
  });
  return (
    <>
      {spots.map((p, i) => (
        <group key={i} position={p}>
          {/* Pole */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 3.4, 8]} />
            <meshStandardMaterial color="#3B2F2F" metalness={0.4} roughness={0.6} />
          </mesh>
          {/* Cloth */}
          <mesh
            ref={(el) => { bannerRefs.current[i] = el; }}
            position={[0.42, 0.15, 0]}
          >
            <planeGeometry args={[0.8, 2.1, 1, 1]} />
            <meshStandardMaterial
              color={['#8B0000', '#2b0036', '#8B0000', '#361a00'][i % 4]}
              roughness={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Sigil disc */}
          <mesh position={[0.42, 0.45, 0.01]}>
            <circleGeometry args={[0.22, 16]} />
            <meshStandardMaterial color="#FFB300" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </>
  );
};

/** Trudy's healing rose — glowing relic on a stone plinth */
export const HealingRose: React.FC<{ position?: [number, number, number] }> = ({ position = [4, -1.9, 3] }) => {
  return (
    <group position={position}>
      {/* Plinth */}
      <mesh castShadow>
        <cylinderGeometry args={[0.45, 0.55, 0.9, 8]} />
        <meshStandardMaterial color="#55524E" roughness={0.85} />
      </mesh>
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={0.8} position={[0, 1.15, 0]}>
        {/* Stem */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 0.5, 6]} />
          <meshStandardMaterial color="#2E7D32" />
        </mesh>
        {/* Petals */}
        {[0, 1, 2].map((r) => (
          <mesh key={r} rotation={[Math.PI / 2, (r / 3) * Math.PI * 2, 0]}>
            <torusGeometry args={[0.16 - r * 0.03, 0.055, 8, 20]} />
            <meshStandardMaterial
              color="#FF4081"
              emissive="#FF4081"
              emissiveIntensity={1.6}
              roughness={0.3}
            />
          </mesh>
        ))}
        {/* Core */}
        <mesh>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#FFF" emissive="#FF80AB" emissiveIntensity={2.5} />
        </mesh>
        <pointLight intensity={9} color="#FF4081" distance={7} />
      </Float>
    </group>
  );
};

/** Forge cauldron with lava glow */
export const ForgeCauldron: React.FC<{ position?: [number, number, number] }> = ({ position = [0, -1.9, -13] }) => {
  const lavaRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (lavaRef.current) {
      const mat = lavaRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.6 + Math.sin(state.clock.elapsedTime * 2.2) * 0.5;
    }
  });
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[1.3, 20, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#26221F" metalness={0.75} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={lavaRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <circleGeometry args={[1.22, 24]} />
        <meshStandardMaterial color="#FF5722" emissive="#FF3D00" emissiveIntensity={1.8} roughness={0.4} />
      </mesh>
      <pointLight position={[0, 0.8, 0]} intensity={30} color="#FF3D00" distance={13} />
    </group>
  );
};
