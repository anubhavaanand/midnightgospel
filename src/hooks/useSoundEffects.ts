import { useRef, useCallback, useEffect } from 'react';
import { useSceneStore } from '@store/sceneStore';

/**
 * Sound Effects Hook
 * 
 * Provides audio feedback for interactions throughout the experience.
 * Uses Web Audio API for low-latency, performant sound effects.
 */

// Sound effect types
export type SoundEffect =
    | 'hover'
    | 'click'
    | 'save'
    | 'levelChange'
    | 'activate'
    | 'deactivate'
    | 'whoosh'
    | 'chime'
    | 'pulse';

// Audio context singleton
let audioContext: AudioContext | null = null;

// Get or create audio context
const getAudioContext = (): AudioContext => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
};

// Sound synthesis functions
const createOscillator = (
    ctx: AudioContext,
    frequency: number,
    type: OscillatorType,
    duration: number,
    volume: number = 0.3
): void => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
};

// Create layered sound for richer effects
const createLayeredSound = (
    ctx: AudioContext,
    frequencies: number[],
    type: OscillatorType,
    duration: number,
    volume: number = 0.2
): void => {
    frequencies.forEach((freq, i) => {
        setTimeout(() => {
            createOscillator(ctx, freq, type, duration, volume / frequencies.length);
        }, i * 20);
    });
};

// Sound effect definitions
const playSoundEffect = (effect: SoundEffect, volume: number = 1): void => {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const baseVolume = 0.3 * volume;

        switch (effect) {
            case 'hover':
                // Soft high-pitched tone
                createOscillator(ctx, 800, 'sine', 0.08, baseVolume * 0.3);
                break;

            case 'click':
                // Sharp click with harmonics
                createOscillator(ctx, 600, 'triangle', 0.1, baseVolume * 0.5);
                createOscillator(ctx, 1200, 'sine', 0.05, baseVolume * 0.3);
                break;

            case 'save':
                // Ascending chime - success sound
                createLayeredSound(ctx, [523, 659, 784], 'sine', 0.3, baseVolume * 0.6);
                break;

            case 'levelChange':
                // Whoosh with frequency sweep
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(baseVolume * 0.4, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
                break;

            case 'activate':
                // Rising tone - activation
                createLayeredSound(ctx, [300, 450, 600, 900], 'sine', 0.4, baseVolume * 0.5);
                break;

            case 'deactivate':
                // Falling tone
                createLayeredSound(ctx, [600, 450, 300], 'sine', 0.3, baseVolume * 0.4);
                break;

            case 'whoosh':
                // Noise-based whoosh
                const bufferSize = ctx.sampleRate * 0.2;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
                }
                const noise = ctx.createBufferSource();
                const noiseGain = ctx.createGain();
                noise.buffer = buffer;
                noiseGain.gain.setValueAtTime(baseVolume * 0.3, ctx.currentTime);
                noise.connect(noiseGain);
                noiseGain.connect(ctx.destination);
                noise.start();
                break;

            case 'chime':
                // Bell-like chime
                createOscillator(ctx, 880, 'sine', 0.5, baseVolume * 0.4);
                createOscillator(ctx, 1760, 'sine', 0.3, baseVolume * 0.2);
                createOscillator(ctx, 2640, 'sine', 0.2, baseVolume * 0.1);
                break;

            case 'pulse':
                // Low rhythmic pulse
                createOscillator(ctx, 80, 'sine', 0.15, baseVolume * 0.6);
                break;
        }
    } catch (error) {
        console.warn('Sound effect failed:', error);
    }
};

/**
 * Hook for using sound effects
 */
export function useSoundEffects() {
    const audioSettings = useSceneStore((state) => state.audioSettings);
    const lastPlayTimeRef = useRef<Record<SoundEffect, number>>({} as Record<SoundEffect, number>);

    // Play sound with volume from settings and debouncing
    const playSound = useCallback((effect: SoundEffect, debounceMs: number = 50) => {
        if (audioSettings.isMuted) return;

        const now = Date.now();
        const lastPlay = lastPlayTimeRef.current[effect] || 0;

        // Debounce to prevent sound spam
        if (now - lastPlay < debounceMs) return;

        lastPlayTimeRef.current[effect] = now;

        const volume = audioSettings.masterVolume * audioSettings.effectsVolume;
        playSoundEffect(effect, volume);
    }, [audioSettings.isMuted, audioSettings.masterVolume, audioSettings.effectsVolume]);

    // Convenience methods
    const playHover = useCallback(() => playSound('hover', 100), [playSound]);
    const playClick = useCallback(() => playSound('click', 50), [playSound]);
    const playSave = useCallback(() => playSound('save', 200), [playSound]);
    const playLevelChange = useCallback(() => playSound('levelChange', 300), [playSound]);
    const playActivate = useCallback(() => playSound('activate', 200), [playSound]);
    const playDeactivate = useCallback(() => playSound('deactivate', 200), [playSound]);
    const playWhoosh = useCallback(() => playSound('whoosh', 100), [playSound]);
    const playChime = useCallback(() => playSound('chime', 300), [playSound]);
    const playPulse = useCallback(() => playSound('pulse', 100), [playSound]);

    return {
        playSound,
        playHover,
        playClick,
        playSave,
        playLevelChange,
        playActivate,
        playDeactivate,
        playWhoosh,
        playChime,
        playPulse,
    };
}

/**
 * Hook to play sound on level changes
 */
export function useLevelChangeSound() {
    const activeLevel = useSceneStore((state) => state.activeLevel);
    const prevLevelRef = useRef(activeLevel);
    const { playLevelChange } = useSoundEffects();

    useEffect(() => {
        if (prevLevelRef.current !== activeLevel) {
            playLevelChange();
            prevLevelRef.current = activeLevel;
        }
    }, [activeLevel, playLevelChange]);
}

export default useSoundEffects;
