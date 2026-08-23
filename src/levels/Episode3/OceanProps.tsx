import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Suspense } from 'react';
import { Sparkles, useGLTF } from '@react-three/drei';
import { computeScale } from '../../lib/modelScales';
import * as THREE from 'three';

/**
 * CreamOcean props — Ep3 "Hunters Without a Home":
 * flooded water world with ice floes, Darryl's cat-crew ship,
 * and the sleeping giant Barry rising from the deep.
 */

/** Drifting ice floes on the cream ocean */
export const IceFloes: React.FC<{ count?: number }> = ({ count = 9 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const floes = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        pos: [Math.sin(i * 2.7) * 14 + (i % 3), -1.55 + ((i * 13) % 10) / 40, Math.cos(i * 1.9) * 12 - 4] as [number, number, number],
        scale: 0.6 + ((i * 17) % 10) / 8,
        rot: (i * 31) % 628 / 100,
        drift: 0.05 + ((i * 7) % 10) / 60,
        phase: i,
      })),
    [count]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const f = floes[i];
      if (f) {
        child.position.x = f.pos[0] + Math.sin(state.clock.elapsedTime * f.drift + f.phase) * 0.6;
        child.position.y = f.pos[1] + Math.sin(state.clock.elapsedTime * 0.5 + f.phase) * 0.06;
        child.rotation.y = f.rot + state.clock.elapsedTime * f.drift * 0.2;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {floes.map((f, i) => (
        <group key={i} position={f.pos} rotation={[0, f.rot, 0]} scale={f.scale}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1, 0.75, 0.28, 7]} />
            <meshStandardMaterial color="#E8F8FF" roughness={0.25} metalness={0.05} envMapIntensity={1.4} />
          </mesh>
          <mesh position={[0.2, 0.2, -0.15]} rotation={[0.3, 0.5, 0.1]}>
            <coneGeometry args={[0.22, 0.5, 6]} />
            <meshStandardMaterial color="#D6EEFF" roughness={0.2} transparent opacity={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/** Real galleon model (Poly Pizza) — replaces procedural hull, cats stay on deck */
const SailShipHull: React.FC = () => {
  const { scene } = useGLTF('/models/level3/sail_ship.glb');
  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    clone.scale.setScalar(computeScale('/models/level3/sail_ship.glb', 5.2, size.y));
    const box2 = new THREE.Box3().setFromObject(clone);
    const center = box2.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, -box2.min.y, -center.z);
    return clone;
  }, [scene]);
  return <primitive object={prepared} />;
};

/** Darryl the fish-man's ship with an all-cat crew (procedural) */
export const CatShip: React.FC<{ position?: [number, number, number] }> = ({ position = [8, -1.4, -6] }) => {
  const shipRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!shipRef.current) return;
    shipRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
    shipRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.45) * 0.04;
    shipRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.38 + 1) * 0.03;
  });

  return (
    <group>
      <group ref={shipRef} position={position} rotation={[0, -0.6, 0]}>
        {/* Real galleon hull + sails */}
        <Suspense fallback={null}>
          <SailShipHull />
        </Suspense>
        {/* Deck plate for cat crew */}
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[1.4, 0.12, 3.6]} />
          <meshStandardMaterial color="#A0714F" roughness={0.65} />
        </mesh>
        {/* Cat crew — three tiny cats on deck */}
        {[[-0.5, 1.15, 0.9], [0.4, 1.15, 0.2], [0, 1.15, -0.8]].map((p, i) => (
          <group key={i} position={p as [number, number, number]}>
            <mesh>
              <sphereGeometry args={[0.18, 10, 10]} />
              <meshStandardMaterial color={['#FFA500', '#333333', '#DDDDDD'][i]} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.16, 0.12]}>
              <coneGeometry args={[0.07, 0.12, 4]} />
              <meshStandardMaterial color={['#FFA500', '#333333', '#DDDDDD'][i]} />
            </mesh>
            <mesh position={[0, 0.16, -0.12]}>
              <coneGeometry args={[0.07, 0.12, 4]} />
              <meshStandardMaterial color={['#FFA500', '#333333', '#DDDDDD'][i]} />
            </mesh>
          </group>
        ))}
        {/* Lantern glow */}
        <pointLight position={[0, 1.6, 0]} intensity={10} color="#FFB347" distance={8} />
      </group>
    </group>
  );
};

/** Barry the sleeping giant — torso island rising from the ocean */
export const SleepingGiant: React.FC<{ position?: [number, number, number] }> = ({ position = [-14, -2, -16] }) => {
  const chestRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    // Slow breathing
    if (chestRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.35) * 0.02;
      chestRef.current.scale.set(s, s, s);
    }
  });
  return (
    <group position={position} rotation={[0, 0.7, 0]}>
      {/* Torso emerging from water */}
      <mesh ref={chestRef} position={[0, 2.2, 0]} castShadow>
        <capsuleGeometry args={[2.2, 2.4, 8, 20]} />
        <meshStandardMaterial color="#7EA88C" roughness={0.75} />
      </mesh>
      {/* Head resting */}
      <mesh position={[0, 4.9, 0.4]} rotation={[0.35, 0, 0.1]} castShadow>
        <sphereGeometry args={[1.15, 20, 20]} />
        <meshStandardMaterial color="#87B295" roughness={0.75} />
      </mesh>
      {/* Closed eyes */}
      {[-0.42, 0.42].map((x, i) => (
        <mesh key={i} position={[x, 5.05, 1.42]} rotation={[0, 0, i === 0 ? 0.25 : -0.25]}>
          <torusGeometry args={[0.16, 0.03, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#3E5C48" />
        </mesh>
      ))}
      {/* Arm draped into water */}
      <mesh position={[2.1, 0.9, 0.3]} rotation={[0, 0, -0.5]} castShadow>
        <capsuleGeometry args={[0.55, 2.6, 8, 16]} />
        <meshStandardMaterial color="#82AA90" roughness={0.75} />
      </mesh>
      {/* Snore bubbles */}
      <Sparkles count={30} scale={[2, 3, 2]} size={5} speed={0.25} opacity={0.5} color="#FFFFFF" position={[0, 5.6, 1.2]} />
      {/* Zzz text handled by parent via KineticDialogue; keep pure geometry here */}
    </group>
  );
};
