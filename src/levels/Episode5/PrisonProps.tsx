import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * SoulPrison props — Ep5 "Annihilation of Joy" (Moon R3T8):
 * the Bardo Loop scale weighing heart vs feather,
 * soul strings with caged bird-souls, hieroglyph pillars.
 * "You cannot die in a soul prison. You can only be reborn."
 */

const GOLD = '#D4AF37';

/** The Bardo Loop — great Egyptian balance oscillating toward judgment */
export const BardoScale: React.FC<{ position?: [number, number, number] }> = ({ position = [0, -1.9, -14] }) => {
  const beamRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (beamRef.current) {
      // Slow eternal deliberation: heart side dips, feather side rises, swap
      beamRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.12;
    }
  });
  return (
    <group position={position}>
      {/* Base + column */}
      <mesh receiveShadow>
        <cylinderGeometry args={[2.2, 2.6, 0.4, 24]} />
        <meshStandardMaterial color="#3A3530" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 3.4, 0]}>
        <cylinderGeometry args={[0.22, 0.32, 6.6, 12]} />
        <meshStandardMaterial color="#4A4238" roughness={0.75} metalness={0.25} />
      </mesh>
      {/* Gold capital */}
      <mesh position={[0, 6.8, 0]}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.55} metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Oscillating crossbeam */}
      <group ref={beamRef} position={[0, 6.35, 0]}>
        <mesh castShadow rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 7.4, 10]} />
          <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.3} />
        </mesh>
        {/* Chains + pans */}
        {[-3.5, 3.5].map((x) => (
          <group key={x} position={[x, -0.15, 0]}>
            {[[-0.45], [0.45]].map(([z], ci) => (
              <mesh key={ci} position={[0, -0.9, z]} rotation={[0, 0, x > 0 ? 0.18 : -0.18]}>
                <cylinderGeometry args={[0.02, 0.02, 1.8, 6]} />
                <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.35} />
              </mesh>
            ))}
            <mesh position={[0, -1.9, 0]} castShadow>
              <cylinderGeometry args={[0.95, 0.75, 0.16, 20]} />
              <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* The Heart (left pan) */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.3}>
        <group position={[-3.5, 3.15, 0]}>
          <mesh scale={[1.15, 1, 0.9]}>
            <sphereGeometry args={[0.34, 16, 16]} />
            <meshStandardMaterial color="#C2185B" emissive="#E91E63" emissiveIntensity={1.4} roughness={0.3} />
          </mesh>
          {/* Aorta bumps */}
          <mesh position={[-0.12, 0.26, 0]} rotation={[0, 0, 0.6]}>
            <capsuleGeometry args={[0.07, 0.2, 4, 8]} />
            <meshStandardMaterial color="#C2185B" emissive="#E91E63" emissiveIntensity={1.2} />
          </mesh>
          <pointLight intensity={6} color="#E91E63" distance={6} />
        </group>
      </Float>

      {/* The Feather (right pan) */}
      <Float speed={1.6} rotationIntensity={0.8} floatIntensity={0.5}>
        <group position={[3.5, 4.35, 0]} rotation={[0, 0, 0.5]}>
          <mesh position={[0, 0.35, 0]}>
            <coneGeometry args={[0.13, 0.95, 4]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFF8E1" emissiveIntensity={0.9}
              transparent opacity={0.92} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.5, 4]} />
            <meshStandardMaterial color="#E0D7C4" />
          </mesh>
        </group>
      </Float>

      <pointLight position={[0, 7, 0]} intensity={26} color={GOLD} distance={17} />
    </group>
  );
};

/** Soul strings — glowing tethers from the void holding caged souls */
export const SoulStrings: React.FC<{ count?: number }> = ({ count = 7 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const souls = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        pos: [Math.sin(i * 2.3) * 11, 2.2 + ((i * 29) % 30) / 12, Math.cos(i * 1.8) * 9 - 3] as [number, number, number],
        color: ['#00E5FF', '#B388FF', '#FF80AB', '#FFF59D'][i % 4],
        bobSpeed: 0.5 + ((i * 13) % 10) / 12,
        phase: i * 1.7,
      })),
    [count]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const s = souls[i];
      if (s) child.position.y = s.pos[1] + Math.sin(state.clock.elapsedTime * s.bobSpeed + s.phase) * 0.28;
    });
  });

  return (
    <group ref={groupRef}>
      {souls.map((s, i) => (
        <group key={i} position={s.pos}>
          {/* Tether up into darkness */}
          <mesh position={[0, 4.2, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 8.4, 4]} />
            <meshBasicMaterial color={s.color} transparent opacity={0.35} />
          </mesh>
          {/* Caged soul */}
          <mesh>
            <icosahedronGeometry args={[0.26, 1]} />
            <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={2.2} roughness={0.15} />
          </mesh>
          {/* Cage bars */}
          <mesh rotation={[Math.PI / 2.4, i * 0.7, 0]}>
            <torusGeometry args={[0.36, 0.015, 6, 20]} />
            <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh rotation={[Math.PI / 1.6, i * 1.3, 0.5]}>
            <torusGeometry args={[0.36, 0.015, 6, 20]} />
            <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.4} />
          </mesh>
          <pointLight intensity={4.5} color={s.color} distance={5.5} />
        </group>
      ))}
    </group>
  );
};

/** Hieroglyph pillars with glowing glyph bands */
export const GlyphPillars: React.FC<{ count?: number }> = ({ count = 6 }) => {
  const pillars = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2 + 0.35;
        return {
          pos: [Math.sin(a) * 16, 0, Math.cos(a) * 14 - 4] as [number, number, number],
          h: 4.5 + ((i * 37) % 20) / 10,
        };
      }),
    [count]
  );
  return (
    <>
      {pillars.map((p, i) => (
        <group key={i} position={p.pos}>
          <mesh castShadow position={[0, p.h / 2, 0]}>
            <boxGeometry args={[0.9, p.h, 0.9]} />
            <meshStandardMaterial color="#33302B" roughness={0.88} />
          </mesh>
          {/* Glowing glyph bands */}
          {[0.35, 0.62, 0.86].map((f, b) => (
            <mesh key={b} position={[0, p.h * f, 0]}>
              <boxGeometry args={[0.94, 0.16, 0.94]} />
              <meshStandardMaterial
                color={GOLD}
                emissive={GOLD}
                emissiveIntensity={0.85}
                roughness={0.4}
                metalness={0.5}
              />
            </mesh>
          ))}
          {/* Pyramid capstone */}
          <mesh castShadow position={[0, p.h + 0.32, 0]}>
            <coneGeometry args={[0.72, 0.65, 4]} />
            <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.5} metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </>
  );
};
