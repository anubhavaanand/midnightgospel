import React, { Suspense, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Clone, Float } from '@react-three/drei';
import * as THREE from 'three';

const HUB_MODEL_BASE = '/models/hub';

function usePreparedModel(url: string, height: number): THREE.Object3D | null {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const s = height / (size.y || 1);
    clone.scale.setScalar(s);
    const box2 = new THREE.Box3().setFromObject(clone);
    const center = box2.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, -box2.min.y, -center.z);
    return clone;
  }, [scene, height]);
}

/** Mobius strip orbiting the hub island like a chromatic halo */
const MobiusHalo: React.FC = () => {
  const groupRef = React.useRef<THREE.Group>(null);
  const mobius = usePreparedModel(`${HUB_MODEL_BASE}/triple_twist_mobius_strip.glb`, 6);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.15;
    }
  });

  if (!mobius) return null;
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={1} rotationIntensity={0.4} floatIntensity={0.5}>
        <primitive object={mobius} />
      </Float>
    </group>
  );
};

/** Slow-drifting cyber orbs */
const CyberOrbs: React.FC = () => {
  const orb = usePreparedModel(`${HUB_MODEL_BASE}/cyber_orb.glb`, 0.8);
  const positions = useMemo(
    () => [
      { pos: [6, 3, -6] as [number, number, number], speed: 1.2 },
      { pos: [-7, -2, -9] as [number, number, number], speed: 0.8 },
      { pos: [3, -5, 8] as [number, number, number], speed: 1.5 },
    ],
    []
  );
  if (!orb) return null;
  return (
    <>
      {positions.map((p, i) => (
        <Float key={i} speed={p.speed} rotationIntensity={1} floatIntensity={2} position={p.pos}>
          <Clone object={orb} />
        </Float>
      ))}
    </>
  );
};

/** Distant gumball planets */
const MiniPlanets: React.FC = () => {
  const planet = usePreparedModel(`${HUB_MODEL_BASE}/mars_form_gumball.glb`, 2.5);
  if (!planet) return null;
  return (
    <>
      <Float speed={0.5} rotationIntensity={0.3} floatIntensity={0.8} position={[-14, 6, -18]}>
        <Clone object={planet} />
      </Float>
      <Float speed={0.4} rotationIntensity={0.3} floatIntensity={0.8} position={[16, -4, -20]}>
        <Clone object={planet} />
      </Float>
    </>
  );
};

/** Clancy's retro motorhome spaceship parked beside the island + satellite dish array */
const ClancyTrailer: React.FC = () => {
  const groupRef = React.useRef<THREE.Group>(null);
  const trailer = usePreparedModel(`${HUB_MODEL_BASE}/clancy_trailer.glb`, 3.2);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });

  if (!trailer) return null;
  return (
    <group ref={groupRef} position={[6.5, -1, 4]} rotation={[0, -0.7, 0]}>
      <primitive object={trailer} />
      <pointLight position={[0, 1.5, 0]} intensity={12} color="#00ffff" distance={8} />
    </group>
  );
};

const SatelliteDish: React.FC = () => {
  const dish = usePreparedModel(`${HUB_MODEL_BASE}/satellite_dish.glb`, 2.4);
  if (!dish) return null;
  return (
    <group position={[-6.5, -1.2, 5]} rotation={[0, 0.9, 0]}>
      <primitive object={dish} />
    </group>
  );
};

export const HubDecorations: React.FC = () => (
  <Suspense fallback={null}>
    <MobiusHalo />
    <CyberOrbs />
    <MiniPlanets />
    <ClancyTrailer />
    <SatelliteDish />
  </Suspense>
);

useGLTF.preload(`${HUB_MODEL_BASE}/triple_twist_mobius_strip.glb`);
useGLTF.preload(`${HUB_MODEL_BASE}/cyber_orb.glb`);
useGLTF.preload(`${HUB_MODEL_BASE}/mars_form_gumball.glb`);
useGLTF.preload(`${HUB_MODEL_BASE}/clancy_trailer.glb`);
useGLTF.preload(`${HUB_MODEL_BASE}/satellite_dish.glb`);

export default HubDecorations;
