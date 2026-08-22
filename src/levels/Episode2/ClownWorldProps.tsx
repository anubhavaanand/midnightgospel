import React, { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Clown World props — Ep2 "Officers and Wolves" atmosphere:
 * circus tent centerpiece, Billy-Roll meat-clown cylinders,
 * balloon clusters, rotating carousel ring, and the mystery egg.
 */

const CARNIVAL_COLORS = ['#FF69B4', '#FFD700', '#00CED1', '#FF6347', '#9370DB'];

/** Striped big-top tent (procedural) */
export const CircusTent: React.FC<{ position?: [number, number, number] }> = ({ position = [-10, -2, -12] }) => {
  const stripes = useMemo(() => Array.from({ length: 12 }), []);
  return (
    <group position={position}>
      {/* Tent cone roof */}
      <mesh position={[0, 4, 0]} castShadow>
        <coneGeometry args={[5, 5, 12]} />
        <meshStandardMaterial color="#FF69B4" roughness={0.6} />
      </mesh>
      {stripes.map((_, i) => {
        const angle = (i / stripes.length) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(angle) * 3.4, 3.8, Math.cos(angle) * 3.4]} rotation={[0, angle, 0.35]}>
            <boxGeometry args={[1.1, 4.6, 0.15]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#FFFACD' : '#FF6347'} roughness={0.7} />
          </mesh>
        );
      })}
      {/* Tent wall */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[5, 5.2, 2.6, 12, 1, true]} />
        <meshStandardMaterial color="#FFFACD" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Flag */}
      <mesh position={[0, 7, 0]}>
        <coneGeometry args={[0.3, 0.8, 4]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.5} />
      </mesh>
      <pointLight position={[0, 3, 0]} intensity={30} color="#FFD700" distance={16} />
    </group>
  );
};

/** Billy-Roll style meat-clown cylinders wandering the plain */
export const MeatClowns: React.FC<{ count?: number }> = ({ count = 6 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const clowns = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        pos: [Math.sin(i * 2.1) * 9 + 2, -1.7, Math.cos(i * 1.3) * 7 - 3] as [number, number, number],
        color: CARNIVAL_COLORS[i % CARNIVAL_COLORS.length],
        speed: 0.4 + ((i * 7) % 10) / 10,
        offset: i * 1.3,
      })),
    [count]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const meta = clowns[i];
      if (meta) {
        child.position.y = meta.pos[1] + Math.abs(Math.sin(state.clock.elapsedTime * meta.speed + meta.offset)) * 0.15;
        child.rotation.y = state.clock.elapsedTime * meta.speed * 0.3 + meta.offset;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {clowns.map((c, i) => (
        <group key={i} position={c.pos}>
          {/* Body cylinder */}
          <mesh castShadow>
            <cylinderGeometry args={[0.45, 0.45, 1.1, 16]} />
            <meshStandardMaterial color="#F5CBA7" roughness={0.5} />
          </mesh>
          {/* Face band */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.46, 0.46, 0.4, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
          </mesh>
          {/* Nose */}
          <mesh position={[0, 0.28, 0.46]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.4} />
          </mesh>
          {/* Party hat */}
          <mesh position={[0, 0.75, 0]}>
            <coneGeometry args={[0.22, 0.5, 12]} />
            <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/** Balloon clusters bobbing on invisible strings */
export const Balloons: React.FC = () => {
  const clusters = useMemo(
    () =>
      [
        [8, 2, -6],
        [-6, 3, 2],
        [4, 2.5, 7],
      ].map((p, i) => ({ pos: p as [number, number, number], seed: i * 3 })),
    []
  );
  return (
    <>
      {clusters.map((c, ci) => (
        <group key={ci} position={c.pos}>
          {[0, 1, 2].map((b) => (
            <Float key={b} speed={1.5 + b * 0.3} rotationIntensity={0.2} floatIntensity={1.5}>
              <mesh position={[b * 0.5 - 0.5, b * 0.6, b * 0.2]} castShadow>
                <sphereGeometry args={[0.35, 16, 16]} />
                <meshStandardMaterial
                  color={CARNIVAL_COLORS[(ci * 3 + b) % CARNIVAL_COLORS.length]}
                  roughness={0.15}
                  metalness={0.1}
                  emissive={CARNIVAL_COLORS[(ci * 3 + b) % CARNIVAL_COLORS.length]}
                  emissiveIntensity={0.25}
                />
              </mesh>
              {/* String */}
              <mesh position={[b * 0.5 - 0.5, b * 0.6 - 0.8, b * 0.2]}>
                <cylinderGeometry args={[0.01, 0.01, 1.4, 4]} />
                <meshBasicMaterial color="#FFFFFF" transparent opacity={0.4} />
              </mesh>
            </Float>
          ))}
        </group>
      ))}
    </>
  );
};

/** Rotating carousel ring with mini clown-head seats */
export const CarouselRing: React.FC<{ position?: [number, number, number] }> = ({ position = [9, -1.6, 4] }) => {
  const ringRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ringRef.current) ringRef.current.rotation.y = state.clock.elapsedTime * 0.4;
  });
  return (
    <group position={position}>
      {/* Base disc */}
      <mesh receiveShadow>
        <cylinderGeometry args={[2.6, 2.8, 0.3, 24]} />
        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Center pole */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 4, 12]} />
        <meshStandardMaterial color="#FF69B4" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Cone top */}
      <mesh position={[0, 4.2, 0]}>
        <coneGeometry args={[2.4, 1.2, 16]} />
        <meshStandardMaterial color="#FF6347" roughness={0.5} />
      </mesh>
      {/* Rotating ring of heads */}
      <group ref={ringRef} position={[0, 0.3, 0]}>
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2;
          return (
            <group key={i} position={[Math.sin(angle) * 2, 1.2, Math.cos(angle) * 2]} rotation={[0, angle, 0]}>
              <mesh>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0, 0.38]}>
                <sphereGeometry args={[0.1, 10, 10]} />
                <meshStandardMaterial color="#FF0000" />
              </mesh>
              <mesh position={[0, 0.55, 0]}>
                <coneGeometry args={[0.25, 0.55, 10]} />
                <meshStandardMaterial color={CARNIVAL_COLORS[i % CARNIVAL_COLORS.length]} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

/** The Mystery Egg — clickable prop using optimized GLB */
const EggModel: React.FC = () => {
  const { scene } = useGLTF('/models/shared/mystery_egg.glb');
  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    clone.scale.setScalar(1.4 / (size.y || 1));
    const box2 = new THREE.Box3().setFromObject(clone);
    const center = box2.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, -box2.min.y, -center.z);
    return clone;
  }, [scene]);
  return <primitive object={prepared} />;
};

export const MysteryEgg: React.FC<{ position?: [number, number, number] }> = ({ position = [-4, -1.7, 3] }) => (
  <Suspense fallback={
    <mesh position={position}>
      <sphereGeometry args={[0.7, 16, 16]} />
      <meshStandardMaterial color="#FFFACD" wireframe />
    </mesh>
  }>
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4} position={position}>
      <EggModel />
      <pointLight position={[0, 1, 0]} intensity={8} color="#FFFACD" distance={6} />
      <Text
        position={[0, 1.6, 0]}
        fontSize={0.22}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
        font="https://fonts.gstatic.com/s/outfit/v11/0oWkYn31adA7zp0t7TxB6H8.woff"
      >
        ???
      </Text>
    </Float>
  </Suspense>
);

useGLTF.preload('/models/shared/mystery_egg.glb');
