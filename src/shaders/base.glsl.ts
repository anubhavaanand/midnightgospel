import * as THREE from 'three';

export const baseUniforms = {
  uTime: { value: 0 },
  uIntensity: { value: 0 },
  uColorPrimary: { value: new THREE.Color() },
  uColorBloom: { value: new THREE.Color() },
  uSpeed: { value: 1.0 }
};

export const commonShaderChunks = `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColorPrimary;
  uniform vec3 uColorBloom;
  uniform float uSpeed;
`;
