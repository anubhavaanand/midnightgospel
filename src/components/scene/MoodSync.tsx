import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useDialogueStore } from '../../store/useDialogueStore';

export const MoodSync: React.FC = () => {
  const currentMood = useDialogueStore((state) => state.currentMood);
  const targetColor = useRef(new THREE.Color(currentMood.colorTarget));
  const { scene } = useThree();

  useFrame((_, delta) => {
    // Smoothly interpolate towards the target color, intensity, and speed
    targetColor.current.set(currentMood.colorTarget);
    
    // We traverse the scene to find any material that has our base uniforms
    // and animate them towards the current mood values.
    scene.traverse((object: any) => {
      if (object.isMesh && object.material && object.material.uniforms) {
        const uniforms = object.material.uniforms;
        
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
  });

  return null; // Invisible logical component
};
