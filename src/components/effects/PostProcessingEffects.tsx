/**
 * Global post-processing effects configuration.
 * Enhanced for cinematic, cosmic feel with level-specific adjustments.
 * Features: Bloom, Chromatic Aberration, Glitch, and theme-aware effects
 */
import { EffectComposer, Bloom, Glitch, Noise, DepthOfField } from '@react-three/postprocessing';
import { useSceneStore } from '@store/sceneStore';
import { useAdaptivePostProcessing } from '@hooks/useAdaptivePostProcessing';

// Level-specific effect intensities to match Midnight Gospel theme
const LEVEL_EFFECTS = [
  { bloom: 0.6, aberration: 0.002, noise: 0.03 },    // Level 0: Chromatic Void - neon glow
  { bloom: 0.4, aberration: 0.003, noise: 0.04 },    // Level 1: Zombie - decay effect
  { bloom: 0.8, aberration: 0.002, noise: 0.02 },    // Level 2: Clown - vibrant carnival
  { bloom: 0.3, aberration: 0.004, noise: 0.02 },    // Level 3: Ass Cream - dreamlike
  { bloom: 0.5, aberration: 0.002, noise: 0.03 },    // Level 4: Blinded by My End - warm/healing
  { bloom: 0.2, aberration: 0.001, noise: 0.05 },    // Level 5: Soul Prison - oppressive
  { bloom: 1.2, aberration: 0.005, noise: 0.03 },    // Level 6: The Exit - transcendent
];

export default function PostProcessingEffects() {
  const isTransitioning = useSceneStore((state) => state.isTransitioning);
  const activeLevel = useSceneStore((state) => state.activeLevel);
  const quality = useAdaptivePostProcessing(60, 30);

  // Get level-specific effects
  const levelEffect = LEVEL_EFFECTS[activeLevel] || LEVEL_EFFECTS[0];
  const bloomIntensity = isTransitioning ? 1.5 : levelEffect.bloom;
  const noiseOpacity = levelEffect.noise;

  return (
    <EffectComposer>
      {[
        // Depth of Field - Cinematic focus (blur background/foreground)
        quality.bloom && (
          <DepthOfField
            key="dof"
            focusDistance={0.02} /* Focus on near objects/planets */
            focalLength={0.5}   /* Camera focal length */
            bokehScale={3}      /* Blur intensity */
            height={480}        /* Resolution */
          />
        ),

        // Bloom - neon glow for psychedelic aesthetic
        quality.bloom && (
          <Bloom
            key="bloom"
            intensity={bloomIntensity * 1.5}
            kernelSize={4}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.25}
          />
        ),

        // Film Grain - analog tactile feel (chromatic effect simulated via noise)
        quality.noise && (
          <Noise
            key="noise"
            opacity={noiseOpacity}
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
