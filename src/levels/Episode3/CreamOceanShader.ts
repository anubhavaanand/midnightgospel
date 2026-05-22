import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { baseUniforms, commonShaderChunks } from '../../shaders/base.glsl';

export const CreamOceanShaderMaterial = shaderMaterial(
  {
    ...baseUniforms,
    uTime: 0,
    uIntensity: 0.5,
    uColorPrimary: new THREE.Color('#FFFDD0'),
    uColorBloom: new THREE.Color('#FFFDD0'),
    uSpeed: 1.0,
  },
  `${commonShaderChunks}
    varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
    void main() { vUv = uv; vNormal = normal; vPosition = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  `${commonShaderChunks}
    varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
    void main() { gl_FragColor = vec4(mix(uColorPrimary, uColorBloom, sin(uTime * uSpeed) * 0.5 + 0.5), 1.0); }
  `
);

extend({ CreamOceanShaderMaterial });
