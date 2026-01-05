/**
 * Global post-processing effects configuration.
 */
import { EffectComposer, Bloom, ChromaticAberration, Noise, Glitch } from '@react-three/postprocessing';
import { useSceneStore } from '@store/sceneStore';
import { useAdaptivePostProcessing } from '@hooks/useAdaptivePostProcessing';

export default function PostProcessingEffects() {
  const isTransitioning = useSceneStore((state) => state.isTransitioning);
  const quality = useAdaptivePostProcessing(60, 30);

  return (
    <EffectComposer>
      {[
        quality.bloom && (
          <Bloom key="bloom" intensity={2} kernelSize={3} luminanceThreshold={0.9} />
        ),
        quality.chromatic && (
          <ChromaticAberration key="chromatic" offset={[0.001, 0.001] as unknown as any} radialModulation={true} modulationOffset={0} />
        ),
        quality.noise && <Noise key="noise" opacity={0.2} />,
        quality.glitch && isTransitioning && (
          <Glitch key="glitch" delay={[0.5, 1.5] as unknown as any} duration={[0.1, 0.5] as unknown as any} strength={[0.3, 0.5] as unknown as any} />
        ),
      ].filter(Boolean) as any}
    </EffectComposer>
  ) as any;
}
