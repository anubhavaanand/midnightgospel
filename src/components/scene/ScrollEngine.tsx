import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useLevelStore } from '../../store/useLevelStore';

const HUB_POINTS: [number, number, number][] = [
  [0, 0, 10],
  [1.5, 0.5, 8.5],
  [-1, -0.3, 7],
  [0.5, 0.3, 5.5],
  [-0.5, -0.1, 4],
  [0, 0, 2.5],
];

export const ScrollEngine: React.FC = () => {
  const { camera } = useThree();
  const { activeLevelId, isTransitioning, setLevel, setTransitioning, setScrollProgress } = useLevelStore();

  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);

  const hubCurve = useMemo(() => new THREE.CatmullRomCurve3(
    HUB_POINTS.map(p => new THREE.Vector3(p[0], p[1], p[2]))
  ), []);

  useEffect(() => {
    targetProgressRef.current = 0;
    progressRef.current = 0;
  }, [activeLevelId]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) return;
    if (e.deltaY === 0) return;
    if (isTransitioning) return;
    if (activeLevelId !== 0) return;
    const speed = 0.002;
    let next = targetProgressRef.current + e.deltaY * speed;
    next = THREE.MathUtils.clamp(next, 0, 1);
    targetProgressRef.current = next;
  }, [isTransitioning, activeLevelId]);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  useFrame((state, delta) => {
    if (activeLevelId !== 0) return;

    const isScrolling = Math.abs(progressRef.current - targetProgressRef.current) > 0.001;

    progressRef.current = THREE.MathUtils.damp(
      progressRef.current,
      targetProgressRef.current,
      3.0,
      delta
    );

    const t = progressRef.current;
    const point = hubCurve.getPointAt(t);
    const lookAhead = hubCurve.getPointAt(Math.min(t + 0.1, 1));
    const controls = (state as any).controls;

    if (isScrolling) {
      camera.position.copy(point);
      camera.lookAt(lookAhead);
      if (controls) {
        controls.target.copy(lookAhead);
        controls.update();
      }
    }

    setScrollProgress(THREE.MathUtils.clamp(t, 0, 1));

    if (t >= 0.95 && !isTransitioning) {
      setTransitioning(true);
      setTimeout(() => {
        setLevel(1);
        setTransitioning(false);
      }, 1000);
    }
  });

  return null;
};

export default ScrollEngine;