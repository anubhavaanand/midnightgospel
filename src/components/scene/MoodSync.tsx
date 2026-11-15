import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useDialogueStore } from '../../store/useDialogueStore';

export const MoodSync: React.FC = () => {
  const currentMood = useDialogueStore((state) => state.currentMood);
  const targetColor = useRef(new THREE.Color(currentMood.colorTarget));
  const reactiveMaterialsRef = useRef<THREE.ShaderMaterial[]>([]);
  const { scene } = useThree();

  // Cache materials with mood uniforms instead of traversing the whole tree every frame
  useEffect(() => {
    const materials: THREE.ShaderMaterial[] = [];
    scene.traverse((object: any) => {
      if (object.isMesh && object.material && object.material.uniforms) {
        const u = object.material.uniforms;
        if (u.uColorBloom || u.uIntensity || u.uSpeed) {
          materials.push(object.material);
        }
      }
    });
    reactiveMaterialsRef.current = materials;
  }, [scene]);

  useFrame((_, delta) => {
    targetColor.current.set(currentMood.colorTarget);
    
    const materials = reactiveMaterialsRef.current;
    const len = materials.length;
    for (let i = 0; i < len; i++) {
      const uniforms = materials[i].uniforms;
      if (uniforms.uColorBloom) {
        uniforms.uColorBloom.value.lerp(targetColor.current, delta * 2.0);
      }
      if (uniforms.uIntensity) {
        uniforms.uIntensity.value = THREE.MathUtils.lerp(
          uniforms.uIntensity.value, 
          currentMood.intensity, 
          delta * 2.0
        );
      }
      if (uniforms.uSpeed) {
        uniforms.uSpeed.value = THREE.MathUtils.lerp(
          uniforms.uSpeed.value, 
          currentMood.speed, 
          delta * 2.0
        );
      }
    }
  });

  return null; // Invisible logical component
};
