import { useState, useEffect, useCallback, useRef } from 'react';
import LandingScene from '../components/landing/LandingScene';
import { Navigation, Hero, EpisodeSection, CharactersSection, AboutSection } from '../components/landing/UI';
import { UniverseType } from '../components/landing/types';
import { UNIVERSES } from '../components/landing/constants';
import { useAudioAnalyzer } from '../components/landing/useAudioAnalyzer';

const LandingPage: React.FC = () => {
    const [universe, setUniverse] = useState<UniverseType>(UniverseType.SURREAL);
    // Removed state-based mouse tracking to prevent re-renders
    const mouseEffectRef = useRef<HTMLDivElement>(null);
    const [isGlitching, setIsGlitching] = useState(false);
    const { isPlaying, toggleAudio, triggerWarp, analyzer } = useAudioAnalyzer();

    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

    useEffect(() => {
        const timeouts = timeoutsRef.current;
        return () => {
            timeouts.forEach(clearTimeout);
        };
    }, []);

    const handleUniverseChange = useCallback((type: UniverseType) => {
        if (type === universe) return;

        // 5D: Audio-Visual Synchronization for reality shift
        triggerWarp();
        setIsGlitching(true);

        document.body.style.overflow = 'hidden';
        const timer1 = setTimeout(() => {
            setUniverse(type);
            const timer2 = setTimeout(() => {
                setIsGlitching(false);
                document.body.style.overflow = 'auto';
            }, 600);
            timeoutsRef.current.push(timer2);
        }, 400);
        timeoutsRef.current.push(timer1);
    }, [universe, triggerWarp]);

    // Optimized Mouse Tracking using direct DOM manipulation
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (mouseEffectRef.current) {
                const config = UNIVERSES[universe]; // Access current config via closure or ref if needed
                // Note: We need the current universe color. 
                // Since this effect runs once (or on universe change), it might be stale? 
                // We'll update the effect dependency to [universe].

                const { clientX, clientY } = e;
                mouseEffectRef.current.style.background = `radial-gradient(600px circle at ${clientX}px ${clientY}px, ${config.primaryColor}22 0%, transparent 100%)`;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [universe]); // Re-bind listener when universe (colors) change - acceptable cost for correct colors

    const config = UNIVERSES[universe];

    return (
        <div className={`relative min-h-screen bg-[#010101] overflow-x-hidden selection:bg-white selection:text-black transition-all duration-1000 ${isGlitching ? 'scale-110 blur-xl grayscale' : 'scale-100 blur-0'}`}>
            <LandingScene config={config} analyzer={analyzer} />

            {/* Dimensional Shift Flash */}
            {isGlitching && (
                <div className="fixed inset-0 z-[60] bg-white mix-blend-difference flex items-center justify-center animate-[pulse_0.2s_infinite]">
                    <div className="text-black font-black text-[15vw] tracking-tighter uppercase italic">
                        SHIFTING_REALITY
                    </div>
                </div>
            )}

            {/* 5D Mouse Influence Field - Optimized */}
            <div
                ref={mouseEffectRef}
                className="fixed pointer-events-none z-40 w-full h-full opacity-30 transition-opacity duration-1000"
            // Initial style will be set by first mouse move or default
            />

            <div className="relative z-10">
                <Navigation
                    currentUniverse={universe}
                    setUniverse={handleUniverseChange}
                    isPlaying={isPlaying}
                    toggleAudio={toggleAudio}
                />

                <Hero config={config} />

                <div className="space-y-48 pb-32">
                    <EpisodeSection
                        currentUniverse={universe}
                        setUniverse={handleUniverseChange}
                        isPlaying={isPlaying}
                        toggleAudio={toggleAudio}
                    />

                    <CharactersSection config={config} />

                    <AboutSection config={config} />

                    <section className="text-center py-24 px-6 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/20 to-transparent" />
                        <div className="max-w-xl mx-auto glass p-8 md:p-12 rounded-[3rem] border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                            <span className="text-[10px] font-black tracking-[1.5em] uppercase block mb-6 opacity-30">Simulator Output</span>
                            <div className="text-left font-mono text-[10px] md:text-xs text-white/40 space-y-3">
                                <p className="flex justify-between"><span>&gt; DIMENSION</span> <span style={{ color: config.accentColor }}>{universe.toUpperCase()}</span></p>
                                <p className="flex justify-between"><span>&gt; FLOW_SPEED</span> <span>{config.shaderSpeed.toFixed(2)}Ghz</span></p>
                                <p className="flex justify-between"><span>&gt; GRAVITY</span> <span>{config.gravity.toFixed(3)} m/s²</span></p>
                                <p className="flex justify-between"><span>&gt; AUDIO_NODE</span> <span className={isPlaying ? "text-green-500" : "text-red-500"}>{isPlaying ? "ACTIVE" : "STANDBY"}</span></p>
                                <p className="animate-pulse opacity-20 border-t border-white/5 pt-3">&gt; LISTENING FOR DIMENSIONAL ECHOES...</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-[100] bg-[url('/noise.svg')] mix-blend-screen" />
        </div>
    );
};

export default LandingPage;
