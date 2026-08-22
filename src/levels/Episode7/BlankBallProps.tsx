import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * PlanetBlankBall props — Ep7 "Turtles of the Eclipse":
 * minimalist white void + tarot-card dreamworld surrealism.
 * The Fool chase, Death's fun eyeball, ping-pong prophecy.
 */

/** Tower of tarot cards — slowly spiraling stacked majors */
export const TarotTower: React.FC<{ position?: [number, number, number] }> = ({ position = [-9, -1.9, -10] }) => {
  const cards = useMemo(() => {
    const suits = ['#C62828', '#1A237E', '#2E7D32', '#F9A825'];
    return Array.from({ length: 14 }).map((_, i) => ({
      y: i * 0.34,
      rotY: i * 0.42,
      tiltZ: Math.sin(i * 1.7) * 0.06,
      color: suits[i % 4],
    }));
  }, []);
  return (
    <group position={position}>
      {cards.map((c, i) => (
        <group key={i} position={[Math.sin(i * 0.42) * 0.12, c.y, Math.cos(i * 0.42) * 0.12]} rotation={[0, c.rotY, c.tiltZ]}>
          <mesh castShadow>
            <boxGeometry args={[1.05, 0.02, 1.7]} />
            <meshStandardMaterial color="#F5F0DC" roughness={0.55} />
          </mesh>
          {/* Card face inset */}
          <mesh position={[0, 0.013, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.85, 1.45]} />
            <meshStandardMaterial color={c.color} roughness={0.5} />
          </mesh>
        </group>
      ))}
      {/* Roman numeral 0 — The Fool marker */}
      <Float speed={1.4} floatIntensity={0.5} rotationIntensity={0.3}>
        <mesh position={[0, 5.4, 0]}>
          <torusGeometry args={[0.35, 0.07, 10, 28]} />
          <meshStandardMaterial color="#F9A825" emissive="#F9A825" emissiveIntensity={0.7} metalness={0.7} roughness={0.25} />
        </mesh>
      </Float>
      <pointLight position={[0, 3, 0]} intensity={16} color="#FFF8E1" distance={11} />
    </group>
  );
};

/** Giant floating tarot arcana ring orbiting the scene */
export const ArcanaRing: React.FC<{ position?: [number, number, number] }> = ({ position = [0, 5.5, -14] }) => {
  const ringRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ringRef.current) ringRef.current.rotation.y = state.clock.elapsedTime * 0.12;
  });
  const cards = useMemo(() => Array.from({ length: 10 }), []);
  return (
    <group position={position} rotation={[0.25, 0, 0]}>
      <group ref={ringRef}>
        {cards.map((_, i) => {
          const a = (i / cards.length) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.sin(a) * 7, Math.cos(a * 2) * 0.5, Math.cos(a) * 7]}
              rotation={[0, a + Math.PI / 2, 0]}
            >
              <boxGeometry args={[0.04, 1.6, 1.0]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#F5F0DC' : '#37474F'}
                emissive={i % 2 === 0 ? '#FFF8E1' : '#000000'}
                emissiveIntensity={i % 2 === 0 ? 0.25 : 0}
                roughness={0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

/** Ping-pong ball shower — Death's execution method, now ambient weather */
export const PingPongRain: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const balls = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        x: (Math.sin(i * 3.1) * 13),
        z: (Math.cos(i * 1.9) * 11 - 2),
        speed: 0.5 + ((i * 17) % 10) / 8,
        phase: i,
      })),
    []
  );
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const b = balls[i];
      if (b) child.position.y = 7 - ((state.clock.elapsedTime * b.speed + b.phase * 1.37) % 10);
    });
  });
  return (
    <group ref={groupRef}>
      {balls.map((b, i) => (
        <mesh key={i} position={[b.x, 0, b.z]}>
          <sphereGeometry args={[0.09, 10, 10]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
};
