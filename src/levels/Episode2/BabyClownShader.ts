import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { baseUniforms, commonShaderChunks } from '../../shaders/base.glsl';

export const BabyClownShaderMaterial = shaderMaterial(
  {
    ...baseUniforms,
    uTime: 0,
    uIntensity: 0.5,
    uColorPrimary: new THREE.Color('#FFB6C1'), // Pastel Pink
    uColorBloom: new THREE.Color('#FFFACD'),   // Lemon Chiffon
    uSpeed: 1.0,
    uMouse: new THREE.Vector2(-9999, -9999),
  },
  // Vertex Shader
  `
    ${commonShaderChunks}
    uniform vec2 uMouse;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normal;
      
      // Gentle, dreamlike wave displacement
      float wave = sin(position.x * 2.0 + uTime * uSpeed * 0.5) * 
                   cos(position.y * 1.5 + uTime * uSpeed * 0.3);
                   
      float mouseDist = distance(uv, uMouse);
      float ripple = 0.0;
      if (uMouse.x > -10.0) {
        ripple = sin(mouseDist * 30.0 - uTime * 8.0) * exp(-mouseDist * 4.0) * 0.25 * uIntensity;
      }
      
      vec3 newPosition = position + normal * (wave * uIntensity * 0.8 + ripple);
      vPosition = newPosition;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment Shader
  `
    ${commonShaderChunks}
    uniform vec2 uMouse;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Soft lerp between pink and lemon/blue based on time and UV
      vec3 skyBlue = vec3(0.53, 0.81, 0.92);
      vec3 mix1 = mix(uColorPrimary, uColorBloom, sin(vUv.x * 5.0 + uTime * uSpeed) * 0.5 + 0.5);
      vec3 finalColor = mix(mix1, skyBlue, cos(vUv.y * 3.0 - uTime * uSpeed * 0.5) * 0.5 + 0.5);
      
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = dot(viewDirection, vNormal);
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
      
      // Gentle glow
      finalColor += uColorBloom * pow(fresnel, 3.0) * uIntensity;
      
      // Add soft glowing ring under cursor raycast
      if (uMouse.x > -10.0) {
        float mouseDist = distance(vUv, uMouse);
        float ring = smoothstep(0.012, 0.0, abs(sin(mouseDist * 30.0 - uTime * 8.0) * exp(-mouseDist * 4.0) - 0.04));
        finalColor += uColorBloom * ring * 0.5 * uIntensity;
      }

      gl_FragColor = vec4(finalColor, 1.0);
      
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
);

extend({ BabyClownShaderMaterial });

