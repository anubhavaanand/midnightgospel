import * as THREE from 'three';

/**
 * Zombie Apocalypse Decay Shader
 * 
 * Creates a vertex displacement effect suggesting decay, rot, and institutional breakdown.
 * Used for the distorted building to add organic warping to its geometry.
 * 
 * Parameters:
 * - time: Animation progression
 * - decayAmount: How much vertices are displaced (0-1)
 * - colorDecay: Blend between institutional gold and decay purple
 */
export const createDecayShaderMaterial = (): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      decayAmount: { value: 0.3 },
      colorDecay: { value: 0.5 },
      colorBase: { value: new THREE.Color('#DAA520') },
      colorDecayed: { value: new THREE.Color('#2E004F') },
    },
    vertexShader: `
      uniform float time;
      uniform float decayAmount;
      
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      // Noise function for organic displacement
      float hash(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
      }
      
      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float n000 = hash(i);
        float n100 = hash(i + vec3(1.0, 0.0, 0.0));
        float n010 = hash(i + vec3(0.0, 1.0, 0.0));
        float n110 = hash(i + vec3(1.0, 1.0, 0.0));
        float n001 = hash(i + vec3(0.0, 0.0, 1.0));
        float n101 = hash(i + vec3(1.0, 0.0, 1.0));
        float n011 = hash(i + vec3(0.0, 1.0, 1.0));
        float n111 = hash(i + vec3(1.0, 1.0, 1.0));
        
        float nx00 = mix(n000, n100, f.x);
        float nx10 = mix(n010, n110, f.x);
        float nx0 = mix(nx00, nx10, f.y);
        float nx01 = mix(n001, n101, f.x);
        float nx11 = mix(n011, n111, f.x);
        float nx1 = mix(nx01, nx11, f.y);
        
        return mix(nx0, nx1, f.z);
      }
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        
        // Organic decay displacement
        vec3 displaced = position;
        float decay = noise(position * 2.0 + time * 0.3) * decayAmount;
        displaced += normal * decay * 0.5;
        
        // Additional turbulence for cracks
        float turbulence = noise(position * 5.0 - time * 0.5) * decayAmount;
        displaced += normal * turbulence * 0.2;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
      }
    `,
    fragmentShader: `
      uniform float decayAmount;
      uniform float colorDecay;
      uniform vec3 colorBase;
      uniform vec3 colorDecayed;
      
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        // Color transition based on decay amount
        vec3 finalColor = mix(colorBase, colorDecayed, colorDecay);
        
        // Simple lighting
        vec3 light = normalize(vec3(1.0, 1.0, 1.0));
        float lightAmount = max(dot(vNormal, light), 0.3);
        
        // Add emission for infected appearance
        float emission = decayAmount * 0.3;
        
        vec3 result = finalColor * lightAmount + vec3(1.0, 0.0, 0.5) * emission;
        
        gl_FragColor = vec4(result, 1.0);
      }
    `,
  });
};

/**
 * Utility: Animate decay shader over time
 * Call this in useFrame to update the decay effect
 */
export const animateDecayShader = (
  material: THREE.ShaderMaterial,
  time: number,
  decayIntensity: number = 0.3
) => {
  material.uniforms.time.value = time;
  material.uniforms.decayAmount.value = Math.sin(time * 0.5) * 0.1 + decayIntensity;
  material.uniforms.colorDecay.value = Math.sin(time * 0.3 + 1) * 0.5 + 0.5;
};
