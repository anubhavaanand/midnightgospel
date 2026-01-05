import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { SPLINE_POINTS, CAMERA_CONFIG, LEVEL_RANGES } from '@utils/constants';
import { useSceneStore } from '@store/sceneStore';

/**
 * Spline-based camera hook that drives camera along Catmull-Rom curve.
 * Implements look-ahead rig for natural banking through curves.
 */
export const useCameraPath = (scrollProgress: number) => {
  const { camera } = useThree();
  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const setActiveLevel = useSceneStore((state) => state.setActiveLevel);

  // Initialize spline
  useEffect(() => {
    curveRef.current = new THREE.CatmullRomCurve3(SPLINE_POINTS, false);
  }, []);

  useFrame(() => {
    if (!curveRef.current) return;

    const curve = curveRef.current;
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

    // Current position on curve
    const point = curve.getPointAt(clampedProgress);

    // Look-ahead point (natural banking into curves)
    const lookAheadDistance = CAMERA_CONFIG.lookAheadDistance;
    const aheadProgress = Math.min(clampedProgress + lookAheadDistance, 1);
    const aheadPoint = curve.getPointAt(aheadProgress);

    // Smooth damped interpolation
    camera.position.lerp(point, 1 - Math.pow(0.9, CAMERA_CONFIG.dampingFactor));
    camera.lookAt(aheadPoint);

    // Detect active level
    const currentLevel = LEVEL_RANGES.find(
      (level) => clampedProgress >= level.scrollStart && clampedProgress < level.scrollEnd
    );
    if (currentLevel) {
      setActiveLevel(currentLevel.level);
    }
  });
};
