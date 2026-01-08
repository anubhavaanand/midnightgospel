import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Ribbon.tsx - Thinner, more elegant version of ChromaticRibbon
 * Fixed geometry to ensure it doesn't block the view
 */

interface RibbonProps {
  position?: [number, number, number];
  scale?: number;
  color1?: string;
  color2?: string;
  speed?: number;
}

export default function Ribbon({
  position = [0, 0, -15],
  scale = 1,
  color1 = '#ff007f',
  color2 = '#00ffff',
  speed = 1
}: RibbonProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(color1) },
    uColor2: { value: new THREE.Color(color2) },
    uSpeed: { value: speed },
  }), [color1, color2, speed]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime * speed;

      // Gentle floating motion
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.15) * 0.5;
    }
  });

  const vertexShader = `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Fast hash-based noise
    float hash(vec3 p) {
      p = fract(p * 0.3183099 + 0.1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }
    
    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
    }
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      // Apply noise-based displacement for organic ribbon movement
      vec3 pos = position;
      float n = noise(vec3(pos.x * 0.5 + uTime * 0.3, pos.y * 0.3, uTime * 0.2));
      pos.z += (n - 0.5) * 3.0;
      pos.y += sin(pos.x * 0.5 + uTime) * 0.3;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      // Create flowing gradient along ribbon
      float gradient = sin(vUv.x * 6.28318 + uTime) * 0.5 + 0.5;
      gradient += sin(vUv.y * 3.14159 + uTime * 0.5) * 0.3;
      gradient = clamp(gradient, 0.0, 1.0);
      
      // Mix colors
      vec3 color = mix(uColor1, uColor2, gradient);
      
      // Add shimmer effect
      float shimmer = sin(vUv.x * 20.0 + uTime * 3.0) * 0.1 + 0.9;
      color *= shimmer;
      
      // Edge glow
      float edge = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
      float alpha = edge * 0.9;
      
      // Add sparkle
      float sparkle = pow(sin(vUv.x * 50.0 + uTime * 5.0) * 0.5 + 0.5, 8.0);
      color += vec3(sparkle * 0.3);
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <group position={position}>
      {/* Main thinner ribbon */}
      <mesh ref={meshRef} scale={scale}>
        <planeGeometry args={[60, 0.5, 64, 8]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
