/**
 * U1: Audio Volume Controls
 * Slider panel to control background audio, effects, and master volume.
 * Beautiful glassmorphism design matching Midnight Gospel aesthetic.
 */
import { useState } from 'react';
import { useSceneStore } from '@store/sceneStore';

export default function AudioControls() {
    const [isOpen, setIsOpen] = useState(false);
    const {
        audioSettings,
        setMasterVolume,
        setMusicVolume,
        setEffectsVolume,
        toggleMute,
    } = useSceneStore();

    const { masterVolume, musicVolume, effectsVolume, isMuted } = audioSettings;

    return (
        <div className="fixed bottom-8 left-8 z-50 pointer-events-auto">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 
                   flex items-center justify-center hover:bg-white/10 transition-all
                   shadow-lg hover:shadow-cyan-500/20"
                title="Audio Controls"
            >
                <span className="text-lg">
                    {isMuted ? '🔇' : masterVolume > 0.5 ? '🔊' : masterVolume > 0 ? '🔉' : '🔈'}
                </span>
            </button>

            {/* Controls Panel */}
            {isOpen && (
                <div className="absolute bottom-14 left-0 w-64 bg-black/60 backdrop-blur-xl 
                        border border-white/20 rounded-lg p-4 shadow-2xl
                        animate-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white/80 text-sm font-bold tracking-wider">AUDIO</h3>
                        <button
                            onClick={toggleMute}
                            className={`px-2 py-1 text-xs rounded transition-colors ${isMuted
                                    ? 'bg-red-500/30 text-red-400 border border-red-500/50'
                                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                }`}
                        >
                            {isMuted ? 'UNMUTE' : 'MUTE'}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Master Volume */}
                        <VolumeSlider
                            label="MASTER"
                            value={masterVolume}
                            onChange={setMasterVolume}
                            color="#00ffff"
                            disabled={isMuted}
                        />

                        {/* Music Volume */}
                        <VolumeSlider
                            label="MUSIC"
                            value={musicVolume}
                            onChange={setMusicVolume}
                            color="#ff007f"
                            disabled={isMuted}
                        />

                        {/* Effects Volume */}
                        <VolumeSlider
                            label="EFFECTS"
                            value={effectsVolume}
                            onChange={setEffectsVolume}
                            color="#9900ff"
                            disabled={isMuted}
                        />
                    </div>

                    {/* Visual Indicator */}
                    <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1.5 h-4 rounded-full transition-all duration-100"
                                        style={{
                                            backgroundColor: i < masterVolume * 10
                                                ? `hsl(${180 - i * 18}, 100%, 50%)`
                                                : 'rgba(255,255,255,0.1)',
                                            transform: `scaleY(${0.4 + (i < masterVolume * 10 ? 0.6 : 0)})`,
                                        }}
                                    />
                                ))}
                            </div>
                            <span className="text-white/40 text-[10px] ml-auto">
                                {Math.round(masterVolume * 100)}%
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

interface VolumeSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    color: string;
    disabled?: boolean;
}

function VolumeSlider({ label, value, onChange, color, disabled }: VolumeSliderProps) {
    return (
        <div className={`${disabled ? 'opacity-40' : ''}`}>
            <div className="flex justify-between mb-1">
                <span className="text-white/50 text-[10px] tracking-wider">{label}</span>
                <span className="text-white/30 text-[10px]">{Math.round(value * 100)}%</span>
            </div>
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-100"
                    style={{
                        width: `${value * 100}%`,
                        background: `linear-gradient(90deg, ${color}66, ${color})`,
                        boxShadow: `0 0 10px ${color}66`,
                    }}
                />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    disabled={disabled}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
            </div>
        </div>
    );
}
