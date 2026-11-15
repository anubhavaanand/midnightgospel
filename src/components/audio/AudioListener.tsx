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
    let listener = camera.children.find((child) => (child as THREE.Object3D & { isAudioListener?: boolean }).isAudioListener) as THREE.AudioListener | undefined;

    if (!listener) {
      listener = new THREE.AudioListener();
      camera.add(listener);
    }
    
    listenerRef.current = listener;

    // Initialize and track standard AudioContext state changes
    const ctx = listener.context;
    setAudioState((ctx.state === 'closed' ? 'uninitialized' : ctx.state) as 'suspended' | 'running' | 'uninitialized');

    const handleStateChange = () => {
      setAudioState((ctx.state === 'closed' ? 'uninitialized' : ctx.state) as 'suspended' | 'running' | 'uninitialized');
    };

    ctx.addEventListener('statechange', handleStateChange);

    return () => {
      ctx.removeEventListener('statechange', handleStateChange);
      if (listenerRef.current) {
        camera.remove(listenerRef.current);
      }
    };
  }, [camera, setAudioState]);

  // Decoupled mute control without tearing down AudioListener
  useEffect(() => {
    if (listenerRef.current) {
      listenerRef.current.setMasterVolume(isMuted ? 0 : 1);
    }
  }, [isMuted]);

  return null;
};
