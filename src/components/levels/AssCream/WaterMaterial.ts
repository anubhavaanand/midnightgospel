import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Water Shader for Ass Cream Level
 * 
 * Creates an animated liquid effect suggesting the "ass cream" bowl.
 * Uses wave distortion and refraction-like effects to create sense of movement.
 * 
 * Visual Philosophy:
 * - Flowing, organic water
 * - Cyan/turquoise color (#00FFFF dominates)
 * - Suggests deep space liquid, alien ocean
 * - Wave interactions create sense of life/movement
 */
export const WaterMaterial = shaderMaterial(
  {
    time: 0,
    colorDeep: new THREE.Color('#001a4d'),
    colorShallow: new THREE.Color('#00FFFF'),
    waveAmplitude: 0.3,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying float vWave;
    uniform float time;
    uniform float waveAmplitude;
    
    void main() {
      vUv = uv;
      
      // Optimized wave displacement (reduced from 3 octaves to 2)
      float wave1 = sin(position.x * 2.0 + time * 0.5) * 0.5;
      float wave2 = sin(position.y * 1.5 - time * 0.3) * 0.3;
      // Removed expensive noise calculation: float wave3 = noise(position.xy * 3.0 + time * 0.2) * 0.4;
      
      vWave = (wave1 + wave2) * waveAmplitude; // Simplified from 3-term sum
      
      vec3 displaced = position;
      displaced.z += vWave;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
  `,
  // Fragment shader
  `
    varying vec2 vUv;
    varying float vWave;
    uniform vec3 colorDeep;
    uniform vec3 colorShallow;
    
    void main() {
      // Color based on wave height (deeper = darker)
      float height = vWave * 0.5 + 0.5;
      vec3 col = mix(colorDeep, colorShallow, height);
      
      // Add subtle shimmer/reflection
      float shimmer = sin(vUv.x * 10.0 + vWave * 5.0) * 0.1 + 0.9;
      col *= shimmer;
      
      // Opacity transparency based on depth
      float alpha = 0.7 + height * 0.3;
      
      gl_FragColor = vec4(col, alpha);
    }
  `
);
