import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { baseUniforms, commonShaderChunks } from '../../shaders/base.glsl';

export const ZombieShaderMaterial = shaderMaterial(
  {
    ...baseUniforms,
    uTime: 0,
    uIntensity: 0.8,
    uColorPrimary: new THREE.Color('#14C832'),
    uColorBloom: new THREE.Color('#14C832'),
    uSpeed: 1.5,
  },
  // Vertex Shader
  `
    ${commonShaderChunks}
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normal;
      
      // Chaotic blob displacement
      float noise = sin(position.x * 5.0 + uTime * uSpeed) * 
                    cos(position.y * 3.0 + uTime * uSpeed * 0.5) * 
                    sin(position.z * 4.0 + uTime * uSpeed * 1.2);
                    
      vec3 newPosition = position + normal * noise * uIntensity * 0.5;
      vPosition = newPosition;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment Shader
  `
    ${commonShaderChunks}
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Create a toxic/chaotic blend
      vec3 color = mix(uColorPrimary, uColorBloom, sin(vUv.y * 10.0 + uTime * uSpeed) * 0.5 + 0.5);
      
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = dot(viewDirection, vNormal);
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
      
      // Pulse based on intensity
      color += uColorBloom * pow(fresnel, 2.0) * (uIntensity * 2.0);

      gl_FragColor = vec4(color, 1.0);
      
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
);

extend({ ZombieShaderMaterial });
