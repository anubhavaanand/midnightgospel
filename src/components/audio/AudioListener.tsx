import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useDialogueStore } from '../../store/useDialogueStore';

/**
 * AudioListener Component
 * Instantiates and attaches a single THREE.AudioListener to the active camera.
 * Monitors and updates the shared AudioContext state in the Zustand store.
 */
export const AudioListener: React.FC = () => {
  const { camera } = useThree();
  const listenerRef = useRef<THREE.AudioListener | null>(null);
  const setAudioState = useDialogueStore((state) => state.setAudioState);
  const isMuted = useDialogueStore((state) => state.isMuted);

  useEffect(() => {
    // Prevent multiple AudioListeners on the same camera
    let listener = camera.children.find((child) => (child as any).isAudioListener) as THREE.AudioListener | undefined;

    if (!listener) {
      listener = new THREE.AudioListener();
      camera.add(listener);
    }
    
    listenerRef.current = listener;

    // Apply current mute state
    listener.setMasterVolume(isMuted ? 0 : 1);

    // Initialize and track standard AudioContext state changes
    const ctx = listener.context;
    setAudioState(ctx.state as any);

    const handleStateChange = () => {
      setAudioState(ctx.state as any);
    };

    ctx.addEventListener('statechange', handleStateChange);

    return () => {
      ctx.removeEventListener('statechange', handleStateChange);
      if (listenerRef.current) {
        camera.remove(listenerRef.current);
      }
    };
  }, [camera, setAudioState, isMuted]);

  return null;
};
