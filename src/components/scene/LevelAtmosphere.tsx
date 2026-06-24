import React from 'react';
import { useThree } from '@react-three/fiber';
import { useLevelStore } from '../../store/useLevelStore';
import * as THREE from 'three';

const fogConfig: Record<number, { color: string; near: number; far: number }> = {
  0: { color: '#050014', near: 5, far: 25 },
  1: { color: '#1A0F14', near: 3, far: 30 },
  2: { color: '#87CEEB', near: 5, far: 35 },
  3: { color: '#191970', near: 4, far: 28 },
  4: { color: '#2F4F4F', near: 3, far: 25 },
  5: { color: '#000000', near: 3, far: 30 },
  6: { color: '#2F4F4F', near: 4, far: 28 },
  7: { color: '#000000', near: 3, far: 35 },
  8: { color: '#8B0000', near: 5, far: 25 },
  9: { color: '#000000', near: 5, far: 30 },
};

export const LevelAtmosphere: React.FC = () => {
  const activeLevelId = useLevelStore((state) => state.activeLevelId);
  const { scene } = useThree();

  React.useEffect(() => {
    if (activeLevelId === 0) {
      scene.fog = null;
      return;
    }
    const config = fogConfig[activeLevelId] ?? fogConfig[0];
    const color = new THREE.Color(config.color);
    scene.fog = new THREE.Fog(color, config.near, config.far);

    return () => {
      scene.fog = null;
    };
  }, [activeLevelId, scene]);

  return null;
};
