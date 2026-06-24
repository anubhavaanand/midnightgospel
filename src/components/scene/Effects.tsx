import React from 'react';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { useLevelStore } from '../../store/useLevelStore';
import * as THREE from 'three';

const levelBloomConfig: Record<number, { intensity: number; luminanceThreshold: number; luminanceSmoothing: number }> = {
  0: { intensity: 0.8, luminanceThreshold: 0.1, luminanceSmoothing: 0.6 },
  1: { intensity: 1.2, luminanceThreshold: 0.15, luminanceSmoothing: 0.7 },
  2: { intensity: 0.6, luminanceThreshold: 0.1, luminanceSmoothing: 0.5 },
  3: { intensity: 1.0, luminanceThreshold: 0.08, luminanceSmoothing: 0.6 },
  4: { intensity: 1.5, luminanceThreshold: 0.2, luminanceSmoothing: 0.8 },
  5: { intensity: 1.0, luminanceThreshold: 0.05, luminanceSmoothing: 0.5 },
  6: { intensity: 0.5, luminanceThreshold: 0.1, luminanceSmoothing: 0.4 },
  7: { intensity: 0.9, luminanceThreshold: 0.12, luminanceSmoothing: 0.6 },
  8: { intensity: 1.3, luminanceThreshold: 0.1, luminanceSmoothing: 0.7 },
  9: { intensity: 1.8, luminanceThreshold: 0.0, luminanceSmoothing: 0.9 },
};

export const Effects: React.FC = () => {
  const activeLevelId = useLevelStore((state) => state.activeLevelId);

  if (activeLevelId === 0) return null;

  const config = levelBloomConfig[activeLevelId] ?? levelBloomConfig[0];

  return (
    <EffectComposer>
      <Bloom
        intensity={config.intensity}
        luminanceThreshold={config.luminanceThreshold}
        luminanceSmoothing={config.luminanceSmoothing}
        mipmapBlur
      />
      <ChromaticAberration
        offset={new THREE.Vector2(0.002, 0.0005)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise opacity={0.03} />
    </EffectComposer>
  );
};
