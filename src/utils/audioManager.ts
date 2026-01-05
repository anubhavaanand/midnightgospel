/**
 * Audio Manager
 * 
 * Central management for spatial audio and soundscapes across all levels.
 * Uses Three.js PositionalAudio for immersive 3D sound.
 */

import * as THREE from 'three';

export interface AudioConfig {
  name: string;
  path: string;
  volume: number;
  loop: boolean;
  spatial: boolean;
  distance?: {
    refDistance?: number;
    maxDistance?: number;
    rolloff?: number;
  };
}

export class AudioManager {
  private listener: THREE.AudioListener;
  private audioLoader: THREE.AudioLoader;
  private sounds: Map<string, THREE.Audio | THREE.PositionalAudio>;
  private isInitialized: boolean = false;

  constructor() {
    this.listener = new THREE.AudioListener();
    this.audioLoader = new THREE.AudioLoader();
    this.sounds = new Map();
  }

  /**
   * Initialize audio listener and attach to camera
   */
  initialize(camera: THREE.Camera): void {
    if (this.isInitialized) return;
    
    camera.add(this.listener);
    this.isInitialized = true;
    console.log('Audio listener initialized');
  }

  /**
   * Get the audio listener for camera attachment
   */
  getListener(): THREE.AudioListener {
    return this.listener;
  }

  /**
   * Load and create an audio source
   */
  async createAudio(config: AudioConfig): Promise<THREE.Audio | THREE.PositionalAudio> {
    return new Promise((resolve, reject) => {
      this.audioLoader.load(
        config.path,
        (buffer) => {
          let audio: THREE.Audio | THREE.PositionalAudio;

          if (config.spatial) {
            audio = new THREE.PositionalAudio(this.listener) as any;
            const positionalAudio = audio as unknown as THREE.PositionalAudio;
            
            if (config.distance) {
              positionalAudio.setRefDistance(config.distance.refDistance || 1);
              positionalAudio.setMaxDistance(config.distance.maxDistance || 100);
              positionalAudio.setRolloffFactor(config.distance.rolloff || 1);
            }
          } else {
            audio = new THREE.Audio(this.listener) as any;
          }

          audio.setBuffer(buffer);
          audio.setVolume(config.volume);
          audio.loop = config.loop;

          this.sounds.set(config.name, audio as any);
          resolve(audio);
        },
        undefined,
        (error) => {
          console.error(`Failed to load audio: ${config.path}`, error);
          reject(error);
        }
      );
    });
  }

  /**
   * Get a stored audio source
   */
  getAudio(name: string): THREE.Audio | THREE.PositionalAudio | undefined {
    return this.sounds.get(name);
  }

  /**
   * Play audio
   */
  play(name: string): boolean {
    const audio = this.sounds.get(name);
    if (audio) {
      if (audio.isPlaying) {
        audio.stop();
      }
      audio.play();
      return true;
    }
    console.warn(`Audio not found: ${name}`);
    return false;
  }

  /**
   * Stop audio
   */
  stop(name: string): boolean {
    const audio = this.sounds.get(name);
    if (audio && audio.isPlaying) {
      audio.stop();
      return true;
    }
    return false;
  }

  /**
   * Set volume
   */
  setVolume(name: string, volume: number): boolean {
    const audio = this.sounds.get(name);
    if (audio) {
      audio.setVolume(Math.max(0, Math.min(1, volume)));
      return true;
    }
    return false;
  }

  /**
   * Fade audio in
   */
  fadeIn(name: string, duration: number = 1000, targetVolume: number = 1): void {
    const audio = this.sounds.get(name);
    if (!audio) return;

    const startVolume = audio.getVolume();
    const startTime = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const volume = startVolume + (targetVolume - startVolume) * progress;

      audio.setVolume(volume);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  /**
   * Fade audio out
   */
  fadeOut(name: string, duration: number = 1000): void {
    const audio = this.sounds.get(name);
    if (!audio) return;

    this.fadeIn(name, duration, 0);
    
    // Stop after fade
    setTimeout(() => {
      if (audio.isPlaying) {
        audio.stop();
      }
    }, duration);
  }

  /**
   * Stop all audio
   */
  stopAll(): void {
    this.sounds.forEach((audio) => {
      if (audio.isPlaying) {
        audio.stop();
      }
    });
  }

  /**
   * Dispose all audio resources
   */
  dispose(): void {
    this.stopAll();
    this.sounds.clear();
    this.listener.context.close();
  }
}

// Global singleton instance
let audioManagerInstance: AudioManager | null = null;

export function getAudioManager(): AudioManager {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager();
  }
  return audioManagerInstance;
}
