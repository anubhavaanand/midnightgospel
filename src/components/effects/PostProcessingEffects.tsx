/**
 * Global post-processing effects configuration.
 * Enhanced for cinematic, cosmic feel with level-specific adjustments.
 */
import { EffectComposer, Bloom, ChromaticAberration, Noise, Glitch, Vignette } from '@react-three/postprocessing';
import { useSceneStore } from '@store/sceneStore';
import { useAdaptivePostProcessing } from '@hooks/useAdaptivePostProcessing';

// Level-specific bloom intensities
const LEVEL_BLOOM_INTENSITY = [
  1.5,   // Level 0: Chromatic Void - moderate glow
  1.2,   // Level 1: Zombie - dimmer, decay
  2.0,   // Level 2: Clown Planet - bright carnival
  1.0,   // Level 3: Ass Cream - underwater, softer
  0.8,   // Level 4: Soul Prison - dark, oppressive
  2.5,   // Level 5: The Exit - transcendent, bright
];

export default function PostProcessingEffects() {
  const isTransitioning = useSceneStore((state) => state.isTransitioning);
  const activeLevel = useSceneStore((state) => state.activeLevel);
  const quality = useAdaptivePostProcessing(60, 30);

  const bloomIntensity = LEVEL_BLOOM_INTENSITY[activeLevel] || 1.5;

  return (
    <EffectComposer>
      {[
        // Bloom - enhanced glow for cosmic elements
        quality.bloom && (
          <Bloom
            key="bloom"
            intensity={bloomIntensity}
            kernelSize={3}
            luminanceThreshold={0.7}
            luminanceSmoothing={0.3}
          />
        ),

        // Chromatic Aberration - subtle color fringing
        quality.chromatic && (
          <ChromaticAberration
            key="chromatic"
            offset={[0.0008, 0.0008] as unknown as any}
            radialModulation={true}
            modulationOffset={0.2}
          />
        ),

        // Vignette - cinematic dark edges
        <Vignette
          key="vignette"
          offset={0.3}
          darkness={0.6}
          eskil={false}
        />,

        // Noise - subtle film grain
        quality.noise && (
          <Noise key="noise" opacity={0.08} />
        ),

        // Glitch - only during transitions
        quality.glitch && isTransitioning && (
          <Glitch
            key="glitch"
            delay={[0.5, 1.5] as unknown as any}
            duration={[0.1, 0.3] as unknown as any}
            strength={[0.2, 0.4] as unknown as any}
          />
        ),
      ].filter(Boolean) as any}
    </EffectComposer>
  ) as any;
}

