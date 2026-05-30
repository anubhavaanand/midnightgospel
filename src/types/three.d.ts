import type { ThreeElements } from '@react-three/fiber';

declare module '@react-three/fiber' {
  interface ThreeElements {
    creamOceanShaderMaterial: ThreeElements['shaderMaterial'] & {
      side?: number;
      uSpeed?: number;
      uDistortion?: number;
      transparent?: boolean;
    };
    zombieShaderMaterial: ThreeElements['shaderMaterial'] & {
      side?: number;
      uSpeed?: number;
      uDistortion?: number;
    };
    babyClownShaderMaterial: ThreeElements['shaderMaterial'] & {
      side?: number;
    };
    vengeanceKingdomShaderMaterial: ThreeElements['shaderMaterial'] & {
      side?: number;
      uSpeed?: number;
      uDistortion?: number;
    };
    soulPrisonShaderMaterial: ThreeElements['shaderMaterial'] & {
      side?: number;
      uSpeed?: number;
      uDistortion?: number;
    };
    meditationCaveShaderMaterial: ThreeElements['shaderMaterial'] & {
      side?: number;
      uSpeed?: number;
      uDistortion?: number;
    };
    planetBlankBallShaderMaterial: ThreeElements['shaderMaterial'] & {
      side?: number;
      uSpeed?: number;
      uDistortion?: number;
    };
    trainworldShaderMaterial: ThreeElements['shaderMaterial'] & {
      side?: number;
      uSpeed?: number;
      uDistortion?: number;
    };
    chromaticShaderMaterial: ThreeElements['shaderMaterial'] & {
      side?: number;
    };
  }
}
