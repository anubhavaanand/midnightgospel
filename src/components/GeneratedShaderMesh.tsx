/**
 * Example shader generator component.
 * Demonstrates Gemini 3 integration for runtime shader creation.
 */
import { useGeneratedShader } from '@hooks/useGeneratedShader';
import { ShaderPromptTemplate } from '@utils/gemini';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GeneratedShaderMeshProps {
  prompt: ShaderPromptTemplate;
  position?: [number, number, number];
  scale?: number;
}

export default function GeneratedShaderMesh({ prompt, position = [0, 0, 0], scale = 1 }: GeneratedShaderMeshProps) {
  const { glslCode, loading } = useGeneratedShader(prompt);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    if (!glslCode || !meshRef.current) return;

    try {
      const material = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: glslCode,
        uniforms: {
          time: { value: 0 },
        },
        side: THREE.DoubleSide,
      });

      materialRef.current = material;
      meshRef.current.material = material;
    } catch (err) {
      console.error('Failed to compile generated shader:', err);
    }
  }, [glslCode]);

  useFrame(({ clock }) => {
    if (materialRef.current && 'uniforms' in materialRef.current) {
      (materialRef.current.uniforms.time as any).value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial color={loading ? '#666' : '#000'} />
    </mesh>
  );
}
