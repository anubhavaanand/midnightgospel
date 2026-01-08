import { EffectComposer, Bloom, Noise, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useMemo } from 'react';

/**
 * PostProcessingEffects
 * 
 * Implements the "Midnight Gospel" simulator aesthetic:
 * - Bloom: For the glowing neons and magical elements.
 * - Noise: High-frequency grain to simulate analog tape/old simulation hardware.
 * - Chromatic Aberration: Simulates lens distortion or "glitch" in the simulation.
 * - Vignette: Focuses the view and darkens edges (space helmet/screen effect).
 */
export default function PostProcessingEffects() {
  const aberrationOffset = useMemo(() => new THREE.Vector2(0.002, 0.002), []);

  return (
    <EffectComposer disableNormalPass>
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={1.5}
        mipmapBlur
      />

      <Noise
        opacity={0.05}
        blendFunction={BlendFunction.OVERLAY}
      />

      <ChromaticAberration
        offset={aberrationOffset}
        radialModulation={false}
        modulationOffset={0}
      />

      <Vignette
        eskil={false}
        offset={0.1}
        darkness={1.1}
      />
    </EffectComposer>
  );
}
