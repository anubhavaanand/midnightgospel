import React, { useEffect, useMemo, useRef } from 'react';
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

const LEVEL_POINTS: [number, number, number][] = [
  [0, 0, 5],
  [0, 0.5, 7],
  [-0.3, 0.2, 10],
  [0, 0, 15],
];

export const ScrollEngine: React.FC = () => {
  const { camera } = useThree();
  const { activeLevelId, isTransitioning, setLevel, setTransitioning, setScrollProgress } = useLevelStore();

  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);

  const hubCurve = useMemo(() => new THREE.CatmullRomCurve3(
    HUB_POINTS.map(p => new THREE.Vector3(p[0], p[1], p[2]))
  ), []);

  const levelCurve = useMemo(() => new THREE.CatmullRomCurve3(
    LEVEL_POINTS.map(p => new THREE.Vector3(p[0], p[1], p[2]))
  ), []);

  const curveRef = useRef(hubCurve);

  useEffect(() => {
    curveRef.current = activeLevelId === 0 ? hubCurve : levelCurve;
    if (activeLevelId === 0) {
      targetProgressRef.current = 0;
      progressRef.current = 0;
    } else {
      targetProgressRef.current = 0;
      progressRef.current = 0;
    }
  }, [activeLevelId, hubCurve, levelCurve]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isTransitioning) return;
      const speed = 0.002;
      let next = targetProgressRef.current + e.deltaY * speed;
      next = THREE.MathUtils.clamp(next, 0, 1);
      targetProgressRef.current = next;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isTransitioning]);

  useFrame((_, delta) => {
    const lerpSpeed = 3.0;
    progressRef.current = THREE.MathUtils.damp(
      progressRef.current,
      targetProgressRef.current,
      lerpSpeed,
      delta
    );

    const t = progressRef.current;
    const curve = curveRef.current;
    const point = curve.getPointAt(t);
    const lookAhead = curve.getPointAt(Math.min(t + 0.1, 1));

    camera.position.copy(point);
    camera.lookAt(lookAhead);

    if (activeLevelId === 0) {
      setScrollProgress(THREE.MathUtils.clamp(t, 0, 1));

      if (t >= 0.95 && !isTransitioning) {
        setTransitioning(true);
        setTimeout(() => {
          setLevel(1);
          setTransitioning(false);
        }, 1000);
      }
    } else {
      setScrollProgress(THREE.MathUtils.clamp(t, 0, 1));

      if (t >= 0.95 && !isTransitioning) {
        setTransitioning(true);
        setTimeout(() => {
          setLevel(0);
          setTransitioning(false);
        }, 1000);
      }
    }
  });

  return null;
};

export default ScrollEngine;
