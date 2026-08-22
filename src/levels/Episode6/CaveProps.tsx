import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * MeditationCave props — Ep6 calm resonance theme:
 * Tibetan singing bowls with ripple rings, candle lanterns,
 * bioluminescent crystal clusters, still reflection pool.
 */

/** Singing bowl that hums — emits expanding resonance rings */
export const SingingBowls: React.FC = () => {
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);
  const bowls = useMemo(
    () => [
      { pos: [-5, -1.85, -2] as [number, number, number], color: '#FFD700' },
      { pos: [4.5, -1.85, 1.5] as [number, number, number], color: '#B388FF' },
      { pos: [-1, -1.85, 6] as [number, number, number], color: '#4DD0E1' },
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ringRefs.current.forEach((m, i) => {
      if (!m) return;
      // Each bowl pings on its own cycle; ring expands + fades
      const cycle = (t * 0.22 + i / bowls.length) % 1;
      m.scale.setScalar(0.4 + cycle * 3.2);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.55 * (1 - cycle));
    });
  });

  return (
    <>
      {bowls.map((b, i) => (
        <group key={i} position={b.pos}>
          {/* Bowl */}
          <mesh castShadow>
            <sphereGeometry args={[0.55, 24, 16, 0, Math.PI * 2, Math.PI * 0.42, Math.PI * 0.58]} />
            <meshStandardMaterial color="#8C7853" metalness={0.92} roughness={0.18} side={THREE.DoubleSide} />
          </mesh>
          <pointLight position={[0, 0.4, 0]} intensity={5} color={b.color} distance={5} />
          {/* Resonance rings (shared refs array) */}
          {[0, 1].map((r) => (
            <mesh
              key={r}
              ref={(el) => { if (r === 0) ringRefs.current[i] = el; }}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0.03, 0]}
            >
              <ringGeometry args={[0.5, 0.56, 32]} />
              <meshBasicMaterial color={b.color} transparent opacity={0} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
};

/** Floating candle lanterns rising through the cave */
export const CandleLanterns: React.FC<{ count?: number }> = ({ count = 8 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const candles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        pos: [Math.sin(i * 2.9) * 10, -1 + ((i * 41) % 35) / 10, Math.cos(i * 2.1) * 8 - 2] as [number, number, number],
        riseSpeed: 0.12 + ((i * 7) % 10) / 40,
        phase: i * 2.2,
        hue: ['#FFB74D', '#FFCC80', '#FFE0B2'][i % 3],
      })),
    [count]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const c = candles[i];
      if (c) child.position.y = ((c.pos[1] + state.clock.elapsedTime * c.riseSpeed + c.phase) % 9) - 1;
    });
  });

  return (
    <group ref={groupRef}>
      {candles.map((c, i) => (
        <Float key={i} speed={2} rotationIntensity={0.25} floatIntensity={0.6} position={c.pos}>
          {/* Paper shade */}
          <mesh>
            <cylinderGeometry args={[0.22, 0.26, 0.45, 8]} />
            <meshStandardMaterial color={c.hue} emissive={c.hue} emissiveIntensity={0.75} roughness={0.5} transparent opacity={0.92} />
          </mesh>
          {/* Flame core */}
          <mesh position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFB300" emissiveIntensity={4} />
          </mesh>
          <pointLight intensity={3.5} color="#FFA726" distance={5.5} />
        </Float>
      ))}
    </>
  );
};

/** Bioluminescent crystal clusters */
export const CrystalClusters: React.FC<{ count?: number }> = ({ count = 5 }) => {
  const clusters = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2 + 1.2;
        const shards = Array.from({ length: 4 + (i % 3) });
        return {
          pos: [Math.sin(a) * 13, -1.95, Math.cos(a) * 11 - 3] as [number, number, number],
          color: ['#80DEEA', '#CE93D8', '#A5D6A7', '#90CAF9'][i % 4],
          shards,
          seed: i,
        };
      }),
    [count]
  );

  return (
    <>
      {clusters.map((cl, ci) => (
        <group key={ci} position={cl.pos} rotation={[0, cl.seed * 1.3, 0]}>
          {cl.shards.map((_, si) => {
            const h = 0.7 + (((ci * 7 + si * 13) % 10) / 10) * 1.6;
            return (
              <mesh
                key={si}
                castShadow
                position={[
                  Math.sin(si * 2.4 + cl.seed) * 0.4,
                  h / 2 - 0.05,
                  Math.cos(si * 2.4 + cl.seed) * 0.4,
                ]}
                rotation={[
                  Math.sin(si + cl.seed) * 0.28,
                  si,
                  Math.cos(si * 1.7) * 0.28,
                ]}
              >
                <coneGeometry args={[0.14 + (si % 3) * 0.04, h, 5]} />
                <meshStandardMaterial
                  color={cl.color}
                  emissive={cl.color}
                  emissiveIntensity={0.65}
                  roughness={0.12}
                  metalness={0.15}
                  transparent
                  opacity={0.85}
                />
              </mesh>
            );
          })}
          <pointLight position={[0, 0.8, 0]} intensity={7} color={cl.color} distance={7} />
        </group>
      ))}
    </>
  );
};
