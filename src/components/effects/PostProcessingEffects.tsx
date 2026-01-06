/**
 * Global post-processing effects configuration.
 * Enhanced for cinematic, cosmic feel with level-specific adjustments.
 * FIXED: Removed Vignette and ChromeAberration to prevent blue edge glow.
 */
import { EffectComposer, Bloom, Glitch } from '@react-three/postprocessing';
import { useSceneStore } from '@store/sceneStore';
import { useAdaptivePostProcessing } from '@hooks/useAdaptivePostProcessing';

export default function PostProcessingEffects() {
  const isTransitioning = useSceneStore((state) => state.isTransitioning);
  const quality = useAdaptivePostProcessing(60, 30);

  return (
    <EffectComposer>
      {[
        // Bloom - reduced intensity to prevent screen takeover
        quality.bloom && (
          <Bloom
            key="bloom"
            intensity={0.2} // Drastically reduced from 1.5
            kernelSize={2}
            luminanceThreshold={0.8}
            luminanceSmoothing={0.1}
          />
        ),

        // Noise - REMOVED to ensure pitch black background
        /*
        quality.noise && (
          <Noise key="noise" opacity={0.05} />
        ),
        */

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
