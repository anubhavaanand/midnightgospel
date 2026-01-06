import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Procedural chromatic void shader.
 * Uses Perlin noise and domain warping for organic liquid feel.
 * Blends into pitch black at edges for depth.
 */
export const ChromaticVoidMaterial = shaderMaterial(
  {
    time: 0,
    colorA: new THREE.Color('#2E004F'),
    colorB: new THREE.Color('#FF007F'),
    colorC: new THREE.Color('#00FFFF'),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 colorA;
    uniform vec3 colorB;
    uniform vec3 colorC;
    varying vec2 vUv;
    varying vec3 vPosition;

    // Improved Perlin-like noise
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float n00 = hash(i);
      float n10 = hash(i + vec2(1.0, 0.0));
      float n01 = hash(i + vec2(0.0, 1.0));
      float n11 = hash(i + vec2(1.0, 1.0));
      
      float nx0 = mix(n00, n10, f.x);
      float nx1 = mix(n01, n11, f.x);
      return mix(nx0, nx1, f.y);
    }

    // Fractal Brownian Motion
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for (int i = 0; i < 5; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 uv = vUv;
      
      // Organic domain warping
      vec2 warp1 = vec2(
        noise(uv * 2.0 + vec2(time * 0.3, 0.0)),
        noise(uv * 2.0 + vec2(0.0, time * 0.3))
      );
      
      uv += warp1 * 0.15;
      
      // Multi-scale FBM for natural-looking patterns
      float pattern = fbm(uv * 3.0 + time * 0.1);
      float turbulence = fbm(uv * 8.0 - time * 0.2);
      
      // Create flowing liquid effect
      float liquid = sin(pattern * 6.28 + time * 0.5) * 0.5 + 0.5;
      float wave = sin(turbulence * 4.0 - time * 0.3) * 0.5 + 0.5;
      
      // Smooth interpolation between colors based on patterns
      vec3 col = colorA;
      col = mix(col, colorB, liquid);
      col = mix(col, colorC, wave * 0.6);
      
      // Calculate distance from center for vignette/fade effect
      float centerDist = length(vUv - 0.5) * 2.0;
      
      // Strong fade to black at edges - space is BLACK
      float edgeFade = smoothstep(0.3, 1.0, centerDist);
      col = mix(col, vec3(0.0), edgeFade);
      
      // Reduce overall brightness for darker feel
      col *= 0.6;
      
      // Add subtle pulsing energy (reduced)
      float pulse = sin(time * 0.8) * 0.05 + 0.05;
      col += vec3(pulse * 0.2, pulse * 0.05, pulse * 0.25);
      
      // Fade out alpha at edges too for transparent blend with black void
      float alpha = 1.0 - smoothstep(0.4, 1.0, centerDist);
      alpha = max(alpha, 0.2); // Minimum opacity to keep some color visible
      
      gl_FragColor = vec4(col, alpha);
    }
  `
);

