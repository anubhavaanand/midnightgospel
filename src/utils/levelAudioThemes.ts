/**
 * Level Audio Themes
 * 
 * Audio configuration for each level that matches visual metaphors.
 * Each level has unique ambient soundscape and spatial audio elements.
 */

import { AudioConfig } from '@utils/audioManager';

/**
 * Audio configuration for Level 0: Chromatic Void
 * Theme: Simulator startup, digital consciousness
 * Soundscape: Electronic hums, soft glitches, boot-up tones
 */
export const CHROMATIC_VOID_AUDIO: Record<string, AudioConfig> = {
  ambient: {
    name: 'chromatic-void-ambient',
    path: '/audio/levels/chromatic-void-ambient.mp3',
    volume: 0.4,
    loop: true,
    spatial: false,
  },
  pod_activation: {
    name: 'pod-activation',
    path: '/audio/sfx/pod-activation.mp3',
    volume: 0.6,
    loop: false,
    spatial: false,
  },
};

/**
 * Audio configuration for Level 1: Zombie Apocalypse
 * Theme: Decay, shambling, groaning
 * Soundscape: Hollow wind, distant moans, heavy footsteps
 */
export const ZOMBIE_APOCALYPSE_AUDIO: Record<string, AudioConfig> = {
  ambient: {
    name: 'zombie-ambient',
    path: '/audio/levels/zombie-ambient.mp3',
    volume: 0.5,
    loop: true,
    spatial: false,
  },
  zombie_crowd: {
    name: 'zombie-crowd',
    path: '/audio/sfx/zombie-crowd.mp3',
    volume: 0.3,
    loop: true,
    spatial: true,
    distance: {
      refDistance: 5,
      maxDistance: 50,
      rolloff: 1,
    },
  },
  footstep_heavy: {
    name: 'footstep-heavy',
    path: '/audio/sfx/footstep-heavy.mp3',
    volume: 0.4,
    loop: false,
    spatial: true,
    distance: {
      refDistance: 3,
      maxDistance: 30,
      rolloff: 1,
    },
  },
};

/**
 * Audio configuration for Level 2: Clown Planet
 * Theme: Chaos, carnival, grinding
 * Soundscape: Playful chaos, mechanical grinding, clown horns
 */
export const CLOWN_PLANET_AUDIO: Record<string, AudioConfig> = {
  ambient: {
    name: 'clown-ambient',
    path: '/audio/levels/clown-ambient.mp3',
    volume: 0.5,
    loop: true,
    spatial: false,
  },
  grinder_sound: {
    name: 'grinder-sound',
    path: '/audio/sfx/grinder-sound.mp3',
    volume: 0.4,
    loop: true,
    spatial: true,
    distance: {
      refDistance: 10,
      maxDistance: 60,
      rolloff: 0.8,
    },
  },
  clown_honk: {
    name: 'clown-honk',
    path: '/audio/sfx/clown-honk.mp3',
    volume: 0.6,
    loop: false,
    spatial: true,
    distance: {
      refDistance: 4,
      maxDistance: 40,
      rolloff: 1,
    },
  },
};

/**
 * Audio configuration for Level 3: Ass Cream
 * Theme: Surreal pleasure, water, softness
 * Soundscape: Liquid flowing, whale song, soft synth pads
 */
export const ASS_CREAM_AUDIO: Record<string, AudioConfig> = {
  ambient: {
    name: 'ass-cream-ambient',
    path: '/audio/levels/ass-cream-ambient.mp3',
    volume: 0.4,
    loop: true,
    spatial: false,
  },
  water_flow: {
    name: 'water-flow',
    path: '/audio/sfx/water-flow.mp3',
    volume: 0.3,
    loop: true,
    spatial: true,
    distance: {
      refDistance: 8,
      maxDistance: 50,
      rolloff: 0.8,
    },
  },
  whale_song: {
    name: 'whale-song',
    path: '/audio/sfx/whale-song.mp3',
    volume: 0.5,
    loop: true,
    spatial: true,
    distance: {
      refDistance: 15,
      maxDistance: 100,
      rolloff: 0.6,
    },
  },
};

/**
 * Audio configuration for Level 4: Soul Prison Moon
 * Theme: Suffering, isolation, cosmic dread
 * Soundscape: Harsh winds, heartbeat distortion, distant screams
 */
export const SOUL_PRISON_AUDIO: Record<string, AudioConfig> = {
  ambient: {
    name: 'soul-prison-ambient',
    path: '/audio/levels/soul-prison-ambient.mp3',
    volume: 0.5,
    loop: true,
    spatial: false,
  },
  heartbeat_distorted: {
    name: 'heartbeat-distorted',
    path: '/audio/sfx/heartbeat-distorted.mp3',
    volume: 0.4,
    loop: true,
    spatial: false,
  },
  wind_howl: {
    name: 'wind-howl',
    path: '/audio/sfx/wind-howl.mp3',
    volume: 0.3,
    loop: true,
    spatial: true,
    distance: {
      refDistance: 20,
      maxDistance: 80,
      rolloff: 0.6,
    },
  },
};

/**
 * Audio configuration for Level 5: The Exit
 * Theme: Transcendence, dissolution, cosmic merge
 * Soundscape: Particle explosion, ethereal pad, silence → overwhelming sound
 */
export const THE_EXIT_AUDIO: Record<string, AudioConfig> = {
  ambient: {
    name: 'the-exit-ambient',
    path: '/audio/levels/the-exit-ambient.mp3',
    volume: 0.5,
    loop: true,
    spatial: false,
  },
  particle_explosion: {
    name: 'particle-explosion',
    path: '/audio/sfx/particle-explosion.mp3',
    volume: 0.7,
    loop: false,
    spatial: false,
  },
  cosmic_hum: {
    name: 'cosmic-hum',
    path: '/audio/sfx/cosmic-hum.mp3',
    volume: 0.4,
    loop: true,
    spatial: false,
  },
};

/**
 * Get audio configuration for a specific level
 */
export function getLevelAudioConfig(
  levelIndex: number
): Record<string, AudioConfig> {
  const configs = [
    CHROMATIC_VOID_AUDIO,
    ZOMBIE_APOCALYPSE_AUDIO,
    CLOWN_PLANET_AUDIO,
    ASS_CREAM_AUDIO,
    SOUL_PRISON_AUDIO,
    THE_EXIT_AUDIO,
  ];

  return configs[levelIndex] || configs[0];
}

/**
 * Audio metadata for narrative sync
 */
export interface AudioCue {
  level: number;
  scrollPercent: number;
  name: string;
  action: 'play' | 'stop' | 'fadeIn' | 'fadeOut';
  duration?: number;
  delay?: number;
}

/**
 * Narrative audio cues synced to scroll position
 */
export const NARRATIVE_AUDIO_CUES: AudioCue[] = [
  // Level 0: Chromatic Void
  {
    level: 0,
    scrollPercent: 0,
    name: 'chromatic-void-ambient',
    action: 'play',
  },
  {
    level: 0,
    scrollPercent: 12,
    name: 'pod-activation',
    action: 'play',
  },

  // Level 1: Zombie Apocalypse
  {
    level: 1,
    scrollPercent: 15,
    name: 'zombie-ambient',
    action: 'fadeIn',
    duration: 800,
  },
  {
    level: 1,
    scrollPercent: 20,
    name: 'zombie-crowd',
    action: 'play',
  },

  // Level 2: Clown Planet
  {
    level: 2,
    scrollPercent: 35,
    name: 'clown-ambient',
    action: 'fadeIn',
    duration: 800,
  },
  {
    level: 2,
    scrollPercent: 42,
    name: 'grinder-sound',
    action: 'play',
  },

  // Level 3: Ass Cream
  {
    level: 3,
    scrollPercent: 55,
    name: 'ass-cream-ambient',
    action: 'fadeIn',
    duration: 800,
  },
  {
    level: 3,
    scrollPercent: 60,
    name: 'water-flow',
    action: 'play',
  },

  // Level 4: Soul Prison
  {
    level: 4,
    scrollPercent: 75,
    name: 'soul-prison-ambient',
    action: 'fadeIn',
    duration: 800,
  },
  {
    level: 4,
    scrollPercent: 80,
    name: 'heartbeat-distorted',
    action: 'play',
  },

  // Level 5: The Exit
  {
    level: 5,
    scrollPercent: 90,
    name: 'the-exit-ambient',
    action: 'fadeIn',
    duration: 800,
  },
  {
    level: 5,
    scrollPercent: 95,
    name: 'particle-explosion',
    action: 'play',
  },
];
