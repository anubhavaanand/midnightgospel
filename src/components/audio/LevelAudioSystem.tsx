/**
 * Level Audio System
 * Manages ambient soundscapes for each level with crossfade transitions
 */
import { useEffect, useRef, useMemo } from 'react';
import { useSceneStore } from '@store/sceneStore';
import { useAmbientAudio } from '@hooks/useAudio';

// Level-specific audio configurations
// Using synthesized drone sounds for now - can be replaced with actual audio files
export const LEVEL_AUDIO_CONFIGS = [
    {
        level: 0,
        name: 'chromatic-void-ambient',
        description: 'Ethereal void with cosmic whispers',
        path: '/audio/ambient-void.mp3',
        volume: 0.4,
        characteristics: 'Deep bass drone, crystalline shimmer, endless space',
    },
    {
        level: 1,
        name: 'zombie-apocalypse-ambient',
        description: 'Tension and decay in a dying world',
        path: '/audio/ambient-zombie.mp3',
        volume: 0.5,
        characteristics: 'Eerie ambience, distant groans, industrial decay',
    },
    {
        level: 2,
        name: 'clown-planet-ambient',
        description: 'Chaotic carnival energy with grinding machinery',
        path: '/audio/ambient-clown.mp3',
        volume: 0.45,
        characteristics: 'Distorted circus, mechanical grind, absurdist whimsy',
    },
    {
        level: 3,
        name: 'ass-cream-ambient',
        description: 'Serene water world with cosmic cats',
        path: '/audio/ambient-water.mp3',
        volume: 0.5,
        characteristics: 'Ocean waves, underwater bubbles, mystical hum',
    },
    {
        level: 4,
        name: 'soul-prison-ambient',
        description: 'Warmth and forgiveness in darkness',
        path: '/audio/ambient-soul.mp3',
        volume: 0.55,
        characteristics: 'Warm glow tones, healing frequencies, gentle ascension',
    },
    {
        level: 5,
        name: 'exit-ambient',
        description: 'Transcendence and infinite explosion',
        path: '/audio/ambient-exit.mp3',
        volume: 0.6,
        characteristics: 'Cosmic explosion, particle shimmer, transcendent choir',
    },
];

interface LevelAudioSystemProps {
    enabled?: boolean;
}

/**
 * Audio-only level manager that crossfades between level soundscapes
 * Note: This uses the Web Audio API synthesizer when actual audio files are not available
 */
export default function LevelAudioSystem({ enabled = true }: LevelAudioSystemProps) {
    const activeLevel = useSceneStore((state) => state.activeLevel);
    const audioSettings = useSceneStore((state) => state.audioSettings);
    const prevLevelRef = useRef<number>(activeLevel);

    // Get current level audio config
    const currentConfig = useMemo(() => {
        return LEVEL_AUDIO_CONFIGS[activeLevel] || LEVEL_AUDIO_CONFIGS[0];
    }, [activeLevel]);

    // Use ambient audio hook for level-based sound
    const { setVolume } = useAmbientAudio(activeLevel, {
        name: currentConfig.name,
        path: currentConfig.path,
        volume: currentConfig.volume * audioSettings.musicVolume * audioSettings.masterVolume,
        loop: true,
        spatial: false,
        autoPlay: enabled && !audioSettings.isMuted,
        fadeInOnLoad: true,
        fadeInDuration: 1500,
    });

    // Update volume when settings change
    useEffect(() => {
        if (audioSettings.isMuted) {
            setVolume(0);
        } else {
            setVolume(currentConfig.volume * audioSettings.musicVolume * audioSettings.masterVolume);
        }
    }, [audioSettings, currentConfig, setVolume]);

    // Track level changes
    useEffect(() => {
        if (prevLevelRef.current !== activeLevel) {
            console.log(`Level audio transition: ${prevLevelRef.current} → ${activeLevel}`);
            prevLevelRef.current = activeLevel;
        }
    }, [activeLevel]);

    // No visual component needed
    return null;
}

/**
 * Audio indicator UI showing current ambient track
 */
export function AudioIndicator() {
    const activeLevel = useSceneStore((state) => state.activeLevel);
    const audioSettings = useSceneStore((state) => state.audioSettings);
    const toggleMute = useSceneStore((state) => state.toggleMute);

    const config = LEVEL_AUDIO_CONFIGS[activeLevel] || LEVEL_AUDIO_CONFIGS[0];

    return (
        <button
            onClick={toggleMute}
            className="flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-sm 
                 rounded-lg border border-white/10 hover:border-white/20 transition-all group"
            title={audioSettings.isMuted ? 'Unmute' : 'Mute'}
        >
            <span className="text-lg">
                {audioSettings.isMuted ? '🔇' : '🔊'}
            </span>
            <div className="hidden sm:flex flex-col">
                <div className="text-white text-xs font-medium truncate max-w-[120px]">
                    {config.description}
                </div>
                <div className="text-white/40 text-[10px]">
                    {audioSettings.isMuted ? 'Muted' : 'Now Playing'}
                </div>
            </div>

            {/* Audio visualizer bars */}
            {!audioSettings.isMuted && (
                <div className="flex items-end gap-0.5 h-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-cyan-400 rounded-sm animate-pulse"
                            style={{
                                height: `${Math.random() * 100}%`,
                                animationDelay: `${i * 150}ms`,
                                animationDuration: `${400 + Math.random() * 200}ms`,
                            }}
                        />
                    ))}
                </div>
            )}
        </button>
    );
}
