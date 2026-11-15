import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useDialogueStore } from '../../store/useDialogueStore';

interface PositionalDialogueAudioProps {
  position: [number, number, number];
  tickCount: number;
}

/**
 * PositionalDialogueAudio Component
 * Attaches a THREE.PositionalAudio node to a 3D group.
 * Generates directional, cute retro synth blips (or computer mumbles)
 * synced with character text typewriter ticks.
 */
export const PositionalDialogueAudio: React.FC<PositionalDialogueAudioProps> = ({
  position,
  tickCount,
}) => {
  let camera: THREE.Camera | null = null;
  try {
    const three = useThree();
    camera = three.camera;
  } catch {
    // Graceful fallback for test environments running outside an R3F Canvas
  }

  const groupRef = useRef<THREE.Group>(null);
  const positionalAudioRef = useRef<THREE.PositionalAudio | null>(null);
  
  const currentMood = useDialogueStore((state) => state.currentMood);
  const audioState = useDialogueStore((state) => state.audioState);
  const isMuted = useDialogueStore((state) => state.isMuted);

  // Lazy-initialize THREE.PositionalAudio when the listener becomes available on the camera
  useEffect(() => {
    if (!camera) return;
    const listener = camera.children.find((child) => (child as THREE.Object3D & { isAudioListener?: boolean }).isAudioListener) as THREE.AudioListener | undefined;
    if (!listener) return;

    const positionalAudio = new THREE.PositionalAudio(listener);
    positionalAudio.setRefDistance(3);
    positionalAudio.setRolloffFactor(1.5);
    positionalAudio.setDistanceModel('inverse');

    positionalAudioRef.current = positionalAudio;
    
    if (groupRef.current) {
      groupRef.current.add(positionalAudio);
    }

    const currentGroup = groupRef.current;

    return () => {
      if (currentGroup && positionalAudioRef.current) {
        currentGroup.remove(positionalAudioRef.current);
      }
      if (positionalAudioRef.current) {
        try {
          positionalAudioRef.current.disconnect();
        } catch {
          // Ignore if already disconnected
        }
      }
    };
  }, [camera]);

  // Hook into typewriter ticks to play cute retro synth blips reactive to mood
  useEffect(() => {
    if (isMuted || !camera || tickCount === 0 || !positionalAudioRef.current || audioState !== 'running') return;

    const listener = camera.children.find((child) => (child as THREE.Object3D & { isAudioListener?: boolean }).isAudioListener) as THREE.AudioListener | undefined;
    if (!listener) return;

    const ctx = listener.context;
    
    // Create synthesizer node chain
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    
    // Pitch & frequency calculations based on current speaker mood intensity
    const intensity = currentMood.intensity || 0.5;
    const baseFreq = 220 + (intensity * 380); // Higher excitement -> higher starting pitch (220Hz - 600Hz)
    const glideFreq = 80 + (intensity * 120) + (Math.random() * 80);

    osc.type = 'triangle'; // Cute rounded retro synthesizer wave
    osc.frequency.setValueAtTime(baseFreq + Math.random() * 80, now);
    osc.frequency.exponentialRampToValueAtTime(glideFreq, now + 0.08);

    // Apply envelope to prevent loud pops and make it sound like a cohesive blip
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    // Connect node chain to spatializer node
    osc.connect(gain);
    positionalAudioRef.current.setNodeSource(gain as unknown as AudioBufferSourceNode);

    osc.start(now);
    osc.stop(now + 0.09);

    return () => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch {
        // already stopped
      }
    };
  }, [tickCount, audioState, isMuted, camera, currentMood]);

  return <group ref={groupRef} position={position} />;
};
