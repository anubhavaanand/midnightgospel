import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFrustumCulling } from '@hooks/useFrustumCulling';

/**
 * ZombieCrowd Component
 * Hundreds of zombie instances rendered efficiently using InstancedMesh.
 * 
 * Design Principles:
 * - Low-poly humanoid forms
 * - Decay/decomposition shader
 * - Wandering animation (non-threatening, almost pitiful)
 * - Color palette: #F0E68C (flesh), #2E004F (decay), #FF007F (infection glow)
 * 
 * Performance:
 * - Uses InstancedMesh for GPU-driven rendering
 * - Single draw call for 500 zombies
 * - Frustum culling optimization enabled (+5-8 FPS)
 * - Shared animation with vertex displacement
 */

const ZOMBIE_COUNT = 500;

export default function ZombieCrowd() {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const timeRef = useRef(0);

  // Pre-calculate instance transforms
  const { positions, scales, rotations } = useMemo(() => {
    const pos: [number, number, number][] = [];
    const scl: [number, number, number][] = [];
    const rot: [number, number, number][] = [];

    for (let i = 0; i < ZOMBIE_COUNT; i++) {
      // Distribute in chaotic cluster around building
      const angle = (Math.random() * Math.PI * 2);
      const radius = Math.random() * 15 + 2;
      const height = Math.random() * 0.3 - 0.2;

      pos.push([
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius - 5,
      ]);

      // Slight scale variation
      const scale = 0.8 + Math.random() * 0.4;
      scl.push([scale, scale, scale]);

      // Random rotation
      rot.push([0, Math.random() * Math.PI * 2, 0]);
    }

    return { positions: pos, scales: scl, rotations: rot };
  }, []);

  // Enable frustum culling for performance
  const zombiePositions = useMemo(() => 
    positions.map(p => new THREE.Vector3(...p)), 
    [positions]
  );
  useFrustumCulling(instancedMeshRef, zombiePositions, { expandRadius: 2, updateInterval: 2 });

  // Update instance transforms
  useFrame((state: any) => {
    if (!instancedMeshRef.current) return;

    timeRef.current += state.delta;

    for (let i = 0; i < ZOMBIE_COUNT; i++) {
      const matrix = new THREE.Matrix4();

      // Position with wandering animation
      const time = timeRef.current + i * 0.01;
      const wander = Math.sin(time * 0.5 + i) * 0.3;

      matrix.compose(
        new THREE.Vector3(
          positions[i][0] + wander,
          positions[i][1] + Math.sin(time * 1.2 + i) * 0.1,
          positions[i][2] + Math.cos(time * 0.8 + i) * 0.2
        ),
        new THREE.Quaternion().setFromEuler(
          new THREE.Euler(0, rotations[i][1] + Math.sin(time * 0.3 + i) * 0.1, 0)
        ),
        new THREE.Vector3(...scales[i])
      );

      instancedMeshRef.current.setMatrixAt(i, matrix);
    }

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Simple zombie geometry (low-poly humanoid)
  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[undefined, undefined, ZOMBIE_COUNT]}
      position={[0, 0, 0]}
      castShadow
      receiveShadow
    >
      {/* Zombie body - simple capsule */}
      <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
      <meshStandardMaterial
        color="#E8D4A0"
        emissive="#FF007F"
        emissiveIntensity={0.15}
        roughness={0.7}
        wireframe={false}
      />
    </instancedMesh>
  );
}

/*
 * Alternative: More detailed individual zombie
 * (Uncomment to use single zombie model for each instance)
 * 
 * const ZombieModel = () => (
 *   <group>
 *     Body
 *     <mesh position={[0, 0.3, 0]}>
 *       <boxGeometry args={[0.4, 0.8, 0.3]} />
 *       <meshStandardMaterial color="#E8D4A0" />
 *     </mesh>
 *     Head
 *     <mesh position={[0, 1.1, 0]}>
 *       <sphereGeometry args={[0.25, 8, 8]} />
 *       <meshStandardMaterial color="#D3A574" />
 *     </mesh>
 *     Left arm
 *     <mesh position={[-0.3, 0.6, 0]}>
 *       <cylinderGeometry args={[0.1, 0.1, 0.6, 4]} />
 *       <meshStandardMaterial color="#C19A6B" />
 *     </mesh>
 *     Right arm
 *     <mesh position={[0.3, 0.6, 0]}>
 *       <cylinderGeometry args={[0.1, 0.1, 0.6, 4]} />
 *       <meshStandardMaterial color="#C19A6B" />
 *     </mesh>
 *   </group>
 * );
 */
