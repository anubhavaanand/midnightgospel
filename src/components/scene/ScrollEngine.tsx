import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useLevelStore } from '../../store/useLevelStore';

export const ScrollEngine: React.FC = () => {
  const { camera } = useThree();
  const { activeLevelId, isTransitioning, setLevel, setTransitioning, setScrollProgress } = useLevelStore();

  // Z-position scroll targets
  const targetZRef = useRef(10);
  const currentZRef = useRef(10);

  // Initialize camera position based on level
  useEffect(() => {
    if (activeLevelId === 0) {
      targetZRef.current = 10;
      currentZRef.current = 10;
      camera.position.set(0, 0, 10);
    } else {
      // Spawn inside simulation levels closer in
      targetZRef.current = 5;
      currentZRef.current = 5;
      camera.position.set(0, 0, 5);
    }
  }, [activeLevelId, camera]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isTransitioning) return;

      // Sensitive delta multiplier to control scroll speed
      const scrollSpeed = 0.008;
      let nextZ = targetZRef.current + e.deltaY * scrollSpeed;

      if (activeLevelId === 0) {
        // Hub Limits: 10.0 (far) down to 2.5 (touching the VR simulator pod)
        nextZ = THREE.MathUtils.clamp(nextZ, 2.5, 10.0);
      } else {
        // Simulation Levels Limits: 2.0 (super deep exploration) up to 15.0 (retreat pullout threshold)
        nextZ = THREE.MathUtils.clamp(nextZ, 2.0, 15.0);
      }

      targetZRef.current = nextZ;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeLevelId, isTransitioning]);

  useFrame((_, delta) => {
    // 1. Smoothly damp the camera's Z position using standard Three MathUtils
    const lerpSpeed = 4.0; // Higher is faster damping
    currentZRef.current = THREE.MathUtils.damp(
      currentZRef.current,
      targetZRef.current,
      lerpSpeed,
      delta
    );
    camera.position.z = currentZRef.current;

    // 2. Compute and sync global scroll progress telemetry
    if (activeLevelId === 0) {
      // Hub progress bar: 10.0 = 0% progress, 2.5 = 100% progress
      const progress = (10.0 - currentZRef.current) / 7.5;
      setScrollProgress(THREE.MathUtils.clamp(progress, 0, 1));

      // 3. Transition Warp Trigger: If zoomed deep into the organic simulator centerpiece
      if (currentZRef.current <= 2.8 && !isTransitioning) {
        setTransitioning(true);
        // Play the portal circle expansion
        setTimeout(() => {
          setLevel(1); // Transition directly to Level 1
          setTransitioning(false);
        }, 1000);
      }
    } else {
      // Level 1 progress bar: 5.0 = 0% depth, 15.0 = 100% depth (pullout retreat)
      const progress = (currentZRef.current - 5.0) / 10.0;
      setScrollProgress(THREE.MathUtils.clamp(progress, 0, 1));

      // 4. Pullout Retreat Trigger: If user scrolls backwards past simulation boundary
      if (currentZRef.current >= 14.0 && !isTransitioning) {
        setTransitioning(true);
        setTimeout(() => {
          setLevel(0); // Exit back to Chromatic Ribbon Hub
          setTransitioning(false);
        }, 1000);
      }
    }
  });

  return null;
};
export default ScrollEngine;
