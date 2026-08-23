import React, { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { computeScale } from '../../lib/modelScales';

/** Hero tram — real train model (Poly Pizza) parked on a parallel track */
const TramModel: React.FC = () => {
  const { scene } = useGLTF('/models/level8/tram.glb');
  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    // Native is 224 units long in Z; fit length to ~26
    clone.scale.setScalar(computeScale('/models/level8/tram.glb', 26, size.z));
    const center = box.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, -center.y, -center.z);
    return clone;
  }, [scene]);
  return <primitive object={prepared} />;
};

export const HeroTram: React.FC<{ position?: [number, number, number] }> = ({ position = [16, -1.2, -14] }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    // Slow arrival loop: eases toward the station, resets, repeats
    const t = (state.clock.elapsedTime * 0.06) % 1;
    ref.current.position.x = position[0] + Math.sin(t * Math.PI * 2) * 6;
  });
  return (
    <Suspense fallback={null}>
      <group ref={ref} position={position} rotation={[0, Math.PI / 2, 0]}>
        <TramModel />
        <pointLight position={[0, 2, 0]} intensity={20} color="#FFCC80" distance={12} />
      </group>
    </Suspense>
  );
};

/** The Swirling Red Orb — glowing vortex outside the train windows */
const OrbModel: React.FC = () => {
  const { scene } = useGLTF('/models/level8/red_orb.glb');
  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    clone.scale.setScalar(computeScale('/models/level8/red_orb.glb', 7, size.y));
    const center = box.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, -center.y, -center.z);
    return clone;
  }, [scene]);
  return <primitive object={prepared} />;
};

export const RedVortex: React.FC<{ position?: [number, number, number] }> = ({ position = [-24, 9, -30] }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.25) * 0.8;
    }
  });
  return (
    <Suspense fallback={null}>
      <group ref={ref} position={position}>
        <OrbModel />
        <pointLight intensity={40} color="#FF1744" distance={30} />
      </group>
    </Suspense>
  );
};

useGLTF.preload('/models/level8/tram.glb');
useGLTF.preload('/models/level8/red_orb.glb');

/** Pink planet with orbiting moon — Clancy's transcendent fate in the finale */
export const PinkFatePlanet: React.FC<{ position?: [number, number, number] }> = ({ position = [8, 14, -34] }) => {
  const moonRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (moonRef.current) {
      const t = state.clock.elapsedTime * 0.35;
      moonRef.current.position.set(Math.cos(t) * 3.2, Math.sin(t * 1.3) * 0.6, Math.sin(t) * 3.2);
    }
  });
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial color="#FF9EC4" emissive="#FF6FA8" emissiveIntensity={0.55} roughness={0.55} />
      </mesh>
      <mesh ref={moonRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#FCE4EC" emissive="#F8BBD0" emissiveIntensity={0.4} />
      </mesh>
      <pointLight intensity={25} color="#FF80AB" distance={28} />
    </group>
  );
};
