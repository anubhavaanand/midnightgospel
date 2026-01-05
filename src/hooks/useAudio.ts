/**
 * useAudio Hook
 * 
 * React Three Fiber integration for spatial audio.
 * Manages audio playback and lifecycle in 3D scenes.
 */

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getAudioManager, AudioConfig } from '@utils/audioManager';

export interface UseAudioOptions extends AudioConfig {
  autoPlay?: boolean;
  fadeInOnLoad?: boolean;
  fadeInDuration?: number;
}

/**
 * Hook for managing spatial audio in R3F scenes
 */
export const useAudio = (options: UseAudioOptions) => {
  const audioRef = useRef<THREE.Audio | THREE.PositionalAudio | null>(null);
  const { camera } = useThree();
  const audioManager = getAudioManager();
  const loadedRef = useRef(false);

  // Initialize audio manager with camera on first load
  useEffect(() => {
    audioManager.initialize(camera);
  }, [camera, audioManager]);

  // Load audio
  useEffect(() => {
    const loadAudio = async () => {
      try {
        const audio = await audioManager.createAudio(options);
        audioRef.current = audio as any;
        loadedRef.current = true;

        if (options.autoPlay) {
          if (options.fadeInOnLoad) {
            if (audioRef.current) {
              audioRef.current.setVolume(0);
              audioRef.current.play();
            }
            audioManager.fadeIn(
              options.name,
              options.fadeInDuration || 1000,
              options.volume
            );
          } else {
            if (audioRef.current) {
              audioRef.current.play();
            }
          }
        }
      } catch (error) {
        console.error(`Failed to load audio ${options.name}:`, error);
      }
    };

    loadAudio();

    return () => {
      // Cleanup on unmount
      if (audioRef.current?.isPlaying) {
        audioRef.current.stop();
      }
    };
  }, [options, audioManager]);

  return {
    audio: audioRef.current as THREE.Audio | THREE.PositionalAudio | null,
    isLoaded: loadedRef.current,
    play: () => audioManager.play(options.name),
    stop: () => audioManager.stop(options.name),
    setVolume: (volume: number) => audioManager.setVolume(options.name, volume),
    fadeIn: (duration?: number) => audioManager.fadeIn(options.name, duration),
    fadeOut: (duration?: number) => audioManager.fadeOut(options.name, duration),
  };
};

/**
 * Hook for positional audio attached to a 3D object
 */
export const usePositionalAudio = (
  position: [number, number, number],
  options: UseAudioOptions
) => {
  const audioRef = useRef<THREE.PositionalAudio | null>(null);
  const { camera } = useThree();
  const audioManager = getAudioManager();

  useEffect(() => {
    audioManager.initialize(camera);
  }, [camera, audioManager]);

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const audio = await audioManager.createAudio({
          ...options,
          spatial: true,
        });
        audioRef.current = audio as THREE.PositionalAudio;

        // Set position
        audioRef.current.position.set(...position);

        if (options.autoPlay) {
          audioRef.current.play();
        }
      } catch (error) {
        console.error(`Failed to load positional audio ${options.name}:`, error);
      }
    };

    loadAudio();

    return () => {
      if (audioRef.current?.isPlaying) {
        audioRef.current.stop();
      }
    };
  }, [options, position, camera, audioManager]);

  // Update position each frame
  useFrame(() => {
    if (audioRef.current !== null) {
      (audioRef.current as any).position.set(...position);
    }
  });

  return {
    audio: audioRef.current,
    play: () => audioManager.play(options.name),
    stop: () => audioManager.stop(options.name),
    setVolume: (volume: number) => audioManager.setVolume(options.name, volume),
  };
};

/**
 * Hook for ambient soundscape with scroll synchronization
 */
export const useAmbientAudio = (levelIndex: number, options: UseAudioOptions) => {
  const audioRef = useRef<THREE.Audio | null>(null);
  const { camera } = useThree();
  const audioManager = getAudioManager();
  const prevLevelRef = useRef(levelIndex);

  useEffect(() => {
    audioManager.initialize(camera);
  }, [camera, audioManager]);

  useEffect(() => {
    const loadAudio = async () => {
      // Fade out previous level's audio if different
      if (prevLevelRef.current !== levelIndex) {
        if (audioRef.current?.isPlaying) {
          audioManager.fadeOut(options.name, 500);
        }
      }

      try {
        const audio = await audioManager.createAudio(options);
        audioRef.current = audio as any;

        // Fade in new level audio
        if (audioRef.current) {
          audioRef.current.setVolume(0);
          audioRef.current.play();
          audioManager.fadeIn(options.name, 800, options.volume);
        }

        prevLevelRef.current = levelIndex;
      } catch (error) {
        console.error(`Failed to load ambient audio:`, error);
      }
    };

    loadAudio();

    return () => {
      if (audioRef.current?.isPlaying) {
        audioRef.current.stop();
      }
    };
  }, [levelIndex, options, audioManager]);

  return {
    audio: audioRef.current,
    setVolume: (volume: number) => audioManager.setVolume(options.name, volume),
  };
};
