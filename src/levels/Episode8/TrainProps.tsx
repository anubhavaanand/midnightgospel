import React, { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, useGLTF } from '@react-three/drei';
import { computeScale } from '../../lib/modelScales';
import * as THREE from 'three';

/**
 * Trainworld props — Ep8 "Mouse of Silver" finale:
 * the infinitely long Afterlife Express carrying every dead character,
 * steampunk plane flyby, cosmic teddy-bear scientists.
 */


/** The Afterlife Express — endless train passing on a parallel track */
export const AfterlifeExpress: React.FC<{ position?: [number, number, number] }> = ({ position = [-16, -1.6, -12] }) => {
  const trainRef = useRef<THREE.Group>(null);
  const cars = useMemo(() => Array.from({ length: 9 }), []);

  useFrame((state) => {
    if (!trainRef.current) return;
    // Endless scroll: cars recycle through a loop
    trainRef.current.children.forEach((car, i) => {
      car.position.x = ((state.clock.elapsedTime * 2.2 + i * 4.4) % 44) - 22;
    });
  });

  return (
    <group position={position} rotation={[0, 0.35, 0]}>
      {/* Track */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, -0.55, 0]}>
        <planeGeometry args={[60, 1.6]} />
        <meshStandardMaterial color="#26201E" roughness={0.85} />
      </mesh>
      <group ref={trainRef}>
        {cars.map((_, i) => {
          const isEngine = i % 3 === 0;
          return (
            <group key={i}>
              {/* Car body */}
              <mesh castShadow position={[0, 0.75, 0]}>
                <boxGeometry args={[isEngine ? 3.4 : 3.8, 1.5, 1.7]} />
                <meshStandardMaterial
                  color={isEngine ? '#4A148C' : i % 2 === 0 ? '#6A1B9A' : '#4E342E'}
                  roughness={0.55}
                  metalness={0.25}
                />
              </mesh>
              {/* Roof */}
              <mesh position={[0, 1.62, 0]} castShadow rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.85, 0.85, isEngine ? 3.4 : 3.8, 12, 1, false, 0, Math.PI]} />
                <meshStandardMaterial color="#311B92" roughness={0.5} metalness={0.35} />
              </mesh>
              {/* Warm windows — souls inside */}
              {[-1.2, 0, 1.2].map((wx) => (
                <mesh key={wx} position={[wx, 0.95, 0.86]}>
                  <planeGeometry args={[0.55, 0.5]} />
                  <meshStandardMaterial color="#FFCC80" emissive="#FFB300" emissiveIntensity={1.6} />
                </mesh>
              ))}
              {/* Wheels hint */}
              {[-1.2, 1.2].map((wx) => (
                <mesh key={wx} position={[wx, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.32, 0.32, 1.9, 12]} />
                  <meshStandardMaterial color="#1A1A1A" metalness={0.6} roughness={0.4} />
                </mesh>
              ))}
            </group>
          );
        })}
      </group>
      <pointLight position={[0, 2.5, 3]} intensity={18} color="#FFB300" distance={14} />
    </group>
  );
};

/** Steampunk plane circling overhead (optimized GLB) */
const PlaneModel: React.FC = () => {
  const { scene } = useGLTF('/models/shared/steampunk_plane.glb');
  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    clone.scale.setScalar(computeScale('/models/shared/steampunk_plane.glb', 2.6, size.y));
    const center = box.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, -center.y, -center.z);
    return clone;
  }, [scene]);
  return <primitive object={prepared} />;
};

export const SteampunkFlyby: React.FC = () => {
  const orbitRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!orbitRef.current) return;
    const t = state.clock.elapsedTime * 0.14;
    orbitRef.current.position.set(Math.cos(t) * 20, 6.5 + Math.sin(t * 2.3) * 1.2, Math.sin(t) * 20);
    orbitRef.current.rotation.y = -t + Math.PI / 2;
    orbitRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.9) * 0.08;
  });
  return (
    <SuspenseWrapper>
      <group ref={orbitRef}>
        <PlaneModel />
      </group>
    </SuspenseWrapper>
  );
};

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={null}>{children}</Suspense>
);

/** Teddy-bear scientist observatory — love & happiness research station */
export const BearObservatory: React.FC<{ position?: [number, number, number] }> = ({ position = [10, -1.9, -8] }) => {
  return (
    <group position={position} rotation={[0, -0.5, 0]}>
      {/* Dome */}
      <mesh castShadow position={[0, 1.1, 0]}>
        <sphereGeometry args={[2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#8D6E63" roughness={0.65} transparent opacity={0.92} side={THREE.DoubleSide} />
      </mesh>
      {/* Telescope */}
      <mesh position={[0.6, 1.6, 0.6]} rotation={[0.7, 0.4, 0]}>
        <cylinderGeometry args={[0.14, 0.2, 1.9, 10]} />
        <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Three teddy bears */}
      {[[-0.8, 0, 0.4], [0.2, 0, -0.5], [1.1, 0, 0.1]].map((p, i) => (
        <Float key={i} speed={1.5 + i * 0.3} floatIntensity={0.3} rotationIntensity={0.15}>
          <group position={[p[0], 0.45, p[2]]}>
            <mesh castShadow>
              <sphereGeometry args={[0.28, 14, 14]} />
              <meshStandardMaterial color={['#8D6E63', '#A1887F', '#6D4C41'][i]} roughness={0.8} />
            </mesh>
            {/* Ears */}
            {[-0.16, 0.16].map((ex) => (
              <mesh key={ex} position={[ex, 0.24, 0]}>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshStandardMaterial color={['#8D6E63', '#A1887F', '#6D4C41'][i]} />
              </mesh>
            ))}
            {/* Lab coat hint */}
            <mesh position={[0, -0.28, 0]}>
              <coneGeometry args={[0.26, 0.42, 10]} />
              <meshStandardMaterial color="#ECEFF1" roughness={0.7} />
            </mesh>
          </group>
        </Float>
      ))}
      <pointLight position={[0, 2.4, 0]} intensity={12} color="#FFAB91" distance={10} />
      <Text
        position={[0, 3.1, 0]}
        fontSize={0.24}
        color="#FFCC80"
        anchorX="center"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        LOVE RESEARCH STATION
      </Text>
    </group>
  );
};

useGLTF.preload('/models/shared/steampunk_plane.glb');
