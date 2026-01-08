/**
 * Global post-processing effects configuration.
 * Enhanced for cinematic, cosmic feel with level-specific adjustments.
 * Features: Bloom, Chromatic Aberration, Vignette, Glitch, Color Grading, and theme-aware effects
 */
import { EffectComposer, Bloom, Glitch, Noise, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useSceneStore } from '@store/sceneStore';
import { useAdaptivePostProcessing } from '@hooks/useAdaptivePostProcessing';
import { Vector2 } from 'three';
import { useMemo } from 'react';

// Level-specific effect intensities to match Midnight Gospel theme
// E1: Chromatic Aberration, E3: Vignette, E5: Color Grading (via tint)
const LEVEL_EFFECTS = [
  { bloom: 0.6, aberration: 0.003, noise: 0.03, vignette: 0.4, tint: '#00ffff' },    // Level 0: Chromatic Void - cyan neon
  { bloom: 0.4, aberration: 0.005, noise: 0.04, vignette: 0.5, tint: '#ff3333' },    // Level 1: Zombie - red decay
  { bloom: 0.8, aberration: 0.004, noise: 0.02, vignette: 0.35, tint: '#ffcc00' },   // Level 2: Clown - yellow carnival
  { bloom: 0.3, aberration: 0.006, noise: 0.02, vignette: 0.45, tint: '#00aaff' },   // Level 3: Ass Cream - blue dreamlike
  { bloom: 0.5, aberration: 0.003, noise: 0.03, vignette: 0.4, tint: '#ff9900' },    // Level 4: Blinded - orange warm
  { bloom: 0.2, aberration: 0.002, noise: 0.05, vignette: 0.6, tint: '#9900ff' },    // Level 5: Soul Prison - purple oppressive
  { bloom: 1.2, aberration: 0.008, noise: 0.03, vignette: 0.2, tint: '#ffffff' },    // Level 6: The Exit - white transcendent
];

export default function PostProcessingEffects() {
  const isTransitioning = useSceneStore((state) => state.isTransitioning);
  const activeLevel = useSceneStore((state) => state.activeLevel);
  const quality = useAdaptivePostProcessing(60, 30);

  // Get level-specific effects
  const levelEffect = LEVEL_EFFECTS[activeLevel] || LEVEL_EFFECTS[0];
  const bloomIntensity = isTransitioning ? 1.5 : levelEffect.bloom;
  const noiseOpacity = levelEffect.noise;

  // E1: Chromatic Aberration - RGB channel separation for trippy lens effect
  const aberrationOffset = useMemo(() => {
    const intensity = isTransitioning ? levelEffect.aberration * 2 : levelEffect.aberration;
    return new Vector2(intensity, intensity);
  }, [levelEffect.aberration, isTransitioning]);

  // E3: Vignette - darker edges for immersion
  const vignetteIntensity = isTransitioning ? levelEffect.vignette * 1.5 : levelEffect.vignette;

  return (
    <EffectComposer>
      {[
        // Bloom - neon glow for psychedelic aesthetic
        quality.bloom && (
          <Bloom
            key="bloom"
            intensity={bloomIntensity}
            kernelSize={3}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.15}
          />
        ),

        // E1: Chromatic Aberration - RGB split for trippy effect
        quality.bloom && (
          <ChromaticAberration
            key="chromatic"
            offset={aberrationOffset}
            radialModulation={true}
            modulationOffset={0.5}
          />
        ),

        // E3: Vignette - cinematic dark edges
        (
          <Vignette
            key="vignette"
            offset={0.3}
            darkness={vignetteIntensity}
            blendFunction={BlendFunction.NORMAL}
          />
        ),

        // Film Grain - analog tactile feel
        quality.noise && (
          <Noise
            key="noise"
            opacity={noiseOpacity}
            blendFunction={BlendFunction.OVERLAY}
          />
        ),

        // Glitch - triggered on level transitions for digital instability
        quality.glitch && isTransitioning && (
          <Glitch
            key="glitch"
            delay={[0.5, 1.5] as unknown as any}
            duration={[0.1, 0.3] as unknown as any}
            strength={[0.3, 0.6] as unknown as any}
          />
        ),
      ].filter(Boolean) as any}
    </EffectComposer>
  ) as any;
}
