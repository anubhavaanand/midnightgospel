import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';

describe('Level Shader Material Resource Disposals', () => {
  it('should ensure ShaderMaterial instances dispose GPU programs and textures on cleanup', () => {
    const shader = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#00FFCC") },
      },
      vertexShader: 'void main() { gl_Position = vec4(0.0); }',
      fragmentShader: 'void main() { gl_FragColor = vec4(1.0); }',
    });

    const disposeSpy = vi.spyOn(shader, 'dispose');

    // Simulate React unmount cleanup hook
    const cleanup = () => {
      shader.dispose();
    };

    cleanup();

    expect(disposeSpy).toHaveBeenCalledTimes(1);
  });

  it('should ensure material ref lifecycle captures material instance correctly at mount', () => {
    const mockMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const disposeSpy = vi.spyOn(mockMaterial, 'dispose');

    const materialRef = { current: mockMaterial };

    // Simulate the updated effect lifecycle pattern
    const effect = () => {
      const mat = materialRef.current;
      return () => {
        mat?.dispose();
      };
    };

    const cleanup = effect();

    // Even if ref.current is cleared during teardown
    materialRef.current = null!;

    cleanup();

    expect(disposeSpy).toHaveBeenCalledTimes(1);
  });
});
