import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * SpaceCat Crowd Component
 * 
 * Space cats floating in the bowl/tank environment.
 * Uses InstancedMesh for efficient rendering of 200+ floating entities.
 * 
 * Design:
 * - Low-poly sphere body with cone head (minimal cat geometry)
 * - Floating animation (gentle sine waves, no fast movement)
 * - Colors: Mix of pink (#FF007F) and cyan (#00FFFF)
 * - Suggests alien yet familiar presence
 * 
 * Animation:
 * - Smooth floating in 3D space
 * - Gentle rotation
 * - Orbital/swirling pattern rather than chaotic
 * - Suggests contentment/peace (matches episode theme: escape)
 * 
 * Performance:
 * - 200 instances = single draw call
 * - Minimal transform updates (smooth floats)
 */

const SPACE_CAT_COUNT = 200;

export default function SpaceCatCrowd() {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const timeRef = useRef(0);

  // Pre-calculate spawn positions (floating in a sphere)
  const { scales } = useMemo(() => {
    const pos: [number, number, number][] = [];
    const scl: [number, number, number][] = [];
    const idx: number[] = [];

    for (let i = 0; i < SPACE_CAT_COUNT; i++) {
      // Fibonacci sphere distribution (even spacing)
      const phi = Math.acos(-1 + (2 * i) / SPACE_CAT_COUNT);
      const theta = Math.sqrt(SPACE_CAT_COUNT * Math.PI) * phi;

      const radius = 12 + Math.random() * 8;
      const x = Math.cos(theta) * Math.sin(phi) * radius;
      const y = Math.sin(theta) * Math.sin(phi) * radius - 2;
      const z = Math.cos(phi) * radius - 5;

      pos.push([x, y, z]);

      // Size variation - some larger, some smaller
      const scale = 0.6 + Math.random() * 0.4;
      scl.push([scale, scale, scale]);

      idx.push(i);
    }

    return { positions: pos, scales: scl, indices: idx };
  }, []);

  // Animate cats floating through space
  useFrame((state: any) => {
    if (!instancedMeshRef.current) return;

    timeRef.current += state.delta;

    for (let i = 0; i < SPACE_CAT_COUNT; i++) {
      const matrix = new THREE.Matrix4();
      const time = timeRef.current + i * 0.02;

      // Gentle orbital motion
      const theta = time * 0.3 + i * 0.03;
      const phi = Math.sin(time * 0.2 + i) * 0.3;

      // Vertical breathing motion
      const verticalBob = Math.sin(time * 0.7 + i) * 1.5;

      // Calculate position
      const orbitRadius = 15 + Math.sin(time * 0.1 + i) * 2;
      const x = Math.cos(theta) * Math.cos(phi) * orbitRadius;
      const y = Math.sin(phi) * orbitRadius + verticalBob - 2;
      const z = Math.sin(theta) * Math.cos(phi) * orbitRadius - 5;

      matrix.compose(
        new THREE.Vector3(x, y, z),
        new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            Math.sin(time * 0.5 + i) * 0.3,
            theta + Math.sin(time * 0.4 + i) * 0.2,
            Math.cos(time * 0.6 + i) * 0.2
          )
        ),
        new THREE.Vector3(...scales[i])
      );

      instancedMeshRef.current.setMatrixAt(i, matrix);
    }

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[undefined, undefined, SPACE_CAT_COUNT]}
      position={[0, 0, 0]}
      castShadow
      receiveShadow
    >
      {/* Cat body - sphere */}
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshStandardMaterial
        color="#FF007F"
        emissive="#00FFFF"
        emissiveIntensity={0.15}
        roughness={0.4}
        metalness={0.2}
      />
    </instancedMesh>
  );
}
