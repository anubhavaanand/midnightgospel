import React, { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * TheCore props — Ep9 simulator sanctum:
 * deep-space skybox sphere, orbiting psx solar system,
 * satellite uplink dish, transcendent light pillars.
 */

/** Deep space skybox — inverted optimized GLB sphere wrapping the level */
const SkyboxModel: React.FC = () => {
  const { scene } = useGLTF('/models/shared/deep_space_skybox.glb');
  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    // Force backside rendering so it acts as a skybox
    clone.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.material) {
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        mats.forEach((mat) => {
          (mat as THREE.MeshStandardMaterial).side = THREE.BackSide;
        });
      }
    });
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    clone.scale.setScalar(120 / Math.max(size.x, size.y, size.z));
    return clone;
  }, [scene]);
  return <primitive object={prepared} />;
};

export const DeepSpaceSky: React.FC = () => (
  <Suspense fallback={null}>
    <SkyboxModel />
  </Suspense>
);

const SolarModel: React.FC = () => {
  const { scene } = useGLTF('/models/hub/psx_solar_system.glb');
  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    clone.scale.setScalar(6 / Math.max(size.x, size.y, size.z));
    const center = box.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, -center.y, -center.z);
    return clone;
  }, [scene]);
  return <primitive object={prepared} />;
};

/** PSX solar system slowly rotating as a cosmic centerpiece */
export const SolarOrbit: React.FC<{ position?: [number, number, number] }> = ({ position = [0, 9, -18] }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.05;
  });
  return (
    <group position={position}>
      <group ref={ref}>
        <Suspense fallback={null}>
          <SolarModel />
        </Suspense>
      </group>
    </group>
  );
};

/** Satellite uplink dish beaming data to the core */
const DishModel: React.FC = () => {
  const { scene } = useGLTF('/models/hub/satellite_dish.glb');
  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    clone.scale.setScalar(3 / Math.max(size.x, size.y, size.z));
    const box2 = new THREE.Box3().setFromObject(clone);
    const center = box2.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, -box2.min.y, -center.z);
    return clone;
  }, [scene]);
  return <primitive object={prepared} />;
};

export const UplinkDish: React.FC<{ position?: [number, number, number] }> = ({ position = [11, -8.5, -6] }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.4;
  });
  return (
    <Suspense fallback={null}>
      <group position={position} rotation={[0, 0.6, 0]}>
        <group ref={ref}>
          <DishModel />
        </group>
        {/* Beam to the core */}
        <mesh position={[-1.2, 3, 0]} rotation={[0, 0, 0.35]}>
          <cylinderGeometry args={[0.03, 0.09, 7, 8]} />
          <meshBasicMaterial color="#00FFCC" transparent opacity={0.28} />
        </mesh>
      </group>
    </Suspense>
  );
};

/** Transcendent ascending light pillars marking unity points */
export const LightPillars: React.FC<{ count?: number }> = ({ count = 6 }) => {
  const pillarRefs = useRef<(THREE.Mesh | null)[]>([]);
  const spots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        return [Math.sin(a) * 17, 0, Math.cos(a) * 15] as [number, number, number];
      }),
    [count]
  );
  useFrame((state) => {
    pillarRefs.current.forEach((m, i) => {
      if (!m) return;
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.12 + Math.abs(Math.sin(state.clock.elapsedTime * 0.7 + i * 1.05)) * 0.22;
    });
  });
  return (
    <>
      {spots.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => { pillarRefs.current[i] = el; }}
          position={[p[0], 10, p[2]]}
        >
          <cylinderGeometry args={[0.35, 0.55, 40, 10, 1, true]} />
          <meshBasicMaterial color="#FF007F" transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </>
  );
};

useGLTF.preload('/models/shared/deep_space_skybox.glb');
useGLTF.preload('/models/hub/psx_solar_system.glb');
useGLTF.preload('/models/hub/satellite_dish.glb');
