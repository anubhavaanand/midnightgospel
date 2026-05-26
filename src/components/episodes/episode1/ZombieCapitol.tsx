import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDialogueStore } from '../../../store/useDialogueStore';
import { LittlePresident } from './LittlePresident';
import { AudioAnalyzerNode } from '../../audio/AudioAnalyzerNode';
import vertexShader from './shaders/ZombieVertex.glsl?raw';
import fragmentShader from './shaders/ZombieFragment.glsl?raw';
import { ZombieCrowd } from './ZombieCrowd';
import { DebateUI } from './DebateUI';

export const ZombieCapitol: React.FC = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBass: { value: 0 },
      uMid: { value: 0 },
      uTreble: { value: 0 },
      uChaosIntensity: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    
    const storeState = useDialogueStore.getState();
    const metrics = storeState.audioMetrics;
    const phase = storeState.narrativePhase;

    let targetChaos = 0;
    if (phase === 'DEBATE') targetChaos = 0.5;
    else if (phase === 'CHAOS_INTRO') targetChaos = 1.0;
    else if (phase === 'ZOMBIE_MUSICAL') targetChaos = 0.8;
    else if (phase === 'ACCEPTANCE_TURN') targetChaos = 0.0;

    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uBass.value = metrics.bass;
    uniforms.uMid.value = metrics.mid;
    uniforms.uTreble.value = metrics.treble;
    
    uniforms.uChaosIntensity.value = THREE.MathUtils.lerp(
      uniforms.uChaosIntensity.value,
      targetChaos,
      0.05
    );

    // Camera shake based on audio volume and chaos
    if (targetChaos > 0) {
      const shakeForce = metrics.rms * targetChaos * 0.5;
      state.camera.position.x = Math.sin(state.clock.elapsedTime * 50) * shakeForce;
      state.camera.position.y = Math.cos(state.clock.elapsedTime * 43) * shakeForce;
    } else {
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, 0.1);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0, 0.1);
    }
  });

  return (
    <group>
      <AudioAnalyzerNode />
      
      <LittlePresident />
      <ZombieCrowd />
      <DebateUI />

      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40, 256, 256]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          wireframe={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
    </group>
  );
};
