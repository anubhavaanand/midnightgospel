/**
 * Frustum Culling Utility for Instanced Meshes
 * 
 * Optimizes rendering by only updating matrices for visible instances.
 * Skips rendering instances that are outside the camera frustum.
 */

import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

interface FrustumCullingOptions {
  expandRadius?: number; // Expand frustum for safety margin
  updateInterval?: number; // Update culling every N frames
}

/**
 * Hook for efficient frustum culling on instanced meshes
 */
export const useFrustumCulling = (
  meshRef: React.RefObject<THREE.InstancedMesh>,
  instancePositions: THREE.Vector3[],
  options: FrustumCullingOptions = {}
) => {
  const { expandRadius = 2, updateInterval = 2 } = options;
  const frustumRef = useRef(new THREE.Frustum());
  const cameraMatrixRef = useRef(new THREE.Matrix4());
  const frameCountRef = useRef(0);
  const visibleCountRef = useRef(0);

  useFrame(({ camera }) => {
    if (!meshRef.current || instancePositions.length === 0) return;

    frameCountRef.current++;
    if (frameCountRef.current % updateInterval !== 0) return;

    // Update frustum from camera
    cameraMatrixRef.current.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    frustumRef.current.setFromProjectionMatrix(cameraMatrixRef.current);

    const sphere = new THREE.Sphere();
    visibleCountRef.current = 0;

    // Check each instance
    for (let i = 0; i < instancePositions.length; i++) {
      const pos = instancePositions[i];
      sphere.center.copy(pos);
      sphere.radius = expandRadius;

      if (frustumRef.current.intersectsSphere(sphere)) {
        visibleCountRef.current++;
      }
    }

    // Update draw range to only visible instances
    if (meshRef.current.geometry) {
      meshRef.current.geometry.setDrawRange(0, visibleCountRef.current);
    }
  });

  return {
    getVisibleCount: () => visibleCountRef.current,
  };
};

/**
 * Simple distance-based LOD system
 */
export const useDistanceLOD = (
  meshRef: React.RefObject<THREE.InstancedMesh>,
  instancePositions: THREE.Vector3[],
  lodDistance: number = 50
) => {
  const lodRef = useRef(0);

  useFrame(({ camera }) => {
    if (!meshRef.current) return;

    // Calculate average distance to instances
    let totalDistance = 0;
    for (let i = 0; i < Math.min(instancePositions.length, 100); i++) {
      totalDistance += camera.position.distanceTo(instancePositions[i]);
    }

    const avgDistance = totalDistance / Math.min(instancePositions.length, 100);

    if (avgDistance > lodDistance) {
      lodRef.current = 1; // Low detail
      if (meshRef.current.material instanceof THREE.Material) {
        (meshRef.current.material as any).fog = false;
      }
    } else {
      lodRef.current = 0; // Full detail
      if (meshRef.current.material instanceof THREE.Material) {
        (meshRef.current.material as any).fog = true;
      }
    }
  });

  return {
    getLODLevel: () => lodRef.current,
  };
};
