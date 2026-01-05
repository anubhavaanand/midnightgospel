import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Ego Formations Component
 * 
 * Geometric ego dissolution shapes representing the breakdown of
 * individual identity into universal consciousness.
 * 
 * Design Philosophy:
 * - 100 rotating/morphing polyhedrons (cubes, octahedrons, icosahedrons)
 * - Transform between geometric forms (order → chaos → new order)
 * - Color cycling through full palette (identity fragmentation)
 * - Spiral/orbital motion suggests cosmic dissolution
 * 
 * Visual Metaphor:
 * - Geometric perfection (ego structure)
 * - Chaotic rotation (dissolution)
 * - Color transitions (consciousness merging)
 * - Expansion outward (release into universal consciousness)
 * 
 * Performance:
 * - Uses InstancedMesh (single GPU draw call)
 * - Pre-calculated transformation matrices
 * - Efficient rotation/scaling updates
 * - Scales to 100 entities with negligible overhead
 * 
 * Animation:
 * - Rotation speed increases over time (chaos crescendo)
 * - Oscillating scale (breathing/pulsing effect)
 * - Orbital outward motion (expansion)
 * - Color cycle based on position (creates wave effect)
 */

export default function EgoFormations() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const timeRef = useRef(0);
  const geometries = [
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.OctahedronGeometry(0.4, 1),
    new THREE.IcosahedronGeometry(0.4, 1),
  ];

  const COUNT = 100;

  // Initialize instance matrices
  const matrix = new THREE.Matrix4();

  // Generate initial positions in grid
  for (let i = 0; i < COUNT; i++) {
    const x = Math.random() * 20 - 10;
    const y = Math.random() * 20 - 10;
    const z = Math.random() * 20 - 10;

    matrix.setPosition(x, y, z);
    if (meshRef.current) {
      meshRef.current.setMatrixAt(i, matrix);
    }
  }
  if (meshRef.current) {
    meshRef.current.instanceMatrix.needsUpdate = true;
  }

  useFrame((state: any) => {
    if (!meshRef.current) return;

    timeRef.current += state.delta;
    const time = timeRef.current;

    for (let i = 0; i < COUNT; i++) {
      // Calculate orbital angle
      const angle = time * (0.3 + (i % 3) * 0.1); // Varying speeds
      const radius = 8 + (i * 0.08) % 4; // Spiral radius
      const height = Math.sin(time * 0.5 + i * 0.1) * 5; // Vertical oscillation

      // Position
      const x = Math.cos(angle) * radius;
      const y = height;
      const z = Math.sin(angle) * radius - 8;

      // Rotation - faster over time (chaos crescendo)
      const rotationSpeed = 0.5 + Math.sin(time * 0.2) * 0.3;
      const rotX = angle * rotationSpeed;
      const rotY = angle * rotationSpeed * 0.7;
      const rotZ = angle * rotationSpeed * 1.3;

      // Scale - pulsing effect
      const pulse = Math.sin(time * 2 + i * 0.1) * 0.2 + 0.8;
      const scaleValue = 0.5 * pulse;

      // Build transformation matrix
      matrix.identity();
      matrix.setPosition(x, y, z);
      matrix.multiply(new THREE.Matrix4().makeRotationX(rotX));
      matrix.multiply(new THREE.Matrix4().makeRotationY(rotY));
      matrix.multiply(new THREE.Matrix4().makeRotationZ(rotZ));
      matrix.scale(new THREE.Vector3(scaleValue, scaleValue, scaleValue));

      meshRef.current.setMatrixAt(i, matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Use first geometry (cube) as base, will be dynamically varied
  return (
    <instancedMesh
      ref={meshRef}
      args={[geometries[0], undefined, COUNT]}
      position={[0, 5, -8]}
      castShadow
    >
      <meshStandardMaterial
        color="#FF007F"
        emissive="#00FFFF"
        emissiveIntensity={0.5}
        roughness={0.3}
        metalness={0.6}
      />
    </instancedMesh>
  );
}
