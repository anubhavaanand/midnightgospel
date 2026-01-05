import { useState, useEffect } from 'react';

/**
 * Premium Loading Screen for the Midnight Gospel Simulator
 * Shows during initial asset loading with animated cosmic elements
 */

interface LoadingScreenProps {
    isLoading: boolean;
    progress?: number;
    onLoadComplete?: () => void;
}

export default function LoadingScreen({
    isLoading,
    progress = 0,
    onLoadComplete
}: LoadingScreenProps) {
    const [displayProgress, setDisplayProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('INITIALIZING_SIMULATOR');
    const [opacity, setOpacity] = useState(1);

    // Smooth progress animation
    useEffect(() => {
        const timer = setInterval(() => {
            setDisplayProgress(prev => {
                const target = progress;
                const diff = target - prev;
                return prev + diff * 0.1;
            });
        }, 50);
        return () => clearInterval(timer);
    }, [progress]);

    // Loading text cycling
    useEffect(() => {
        const texts = [
            'INITIALIZING_SIMULATOR',
            'CALIBRATING_MULTIVERSE',
            'LOADING_CONSCIOUSNESS',
            'SYNCING_DIMENSIONS',
            'ESTABLISHING_LINK',
            'READY_TO_TRANSMIT'
        ];

        let index = 0;
        const timer = setInterval(() => {
            index = (index + 1) % texts.length;
            setLoadingText(texts[index]);
        }, 1500);

        return () => clearInterval(timer);
    }, []);

    // Handle fade out and complete callback
    useEffect(() => {
        if (displayProgress >= 99 && onLoadComplete) {
            setOpacity(0);
            const timer = setTimeout(onLoadComplete, 800);
            return () => clearTimeout(timer);
        }
    }, [displayProgress, onLoadComplete]);

    if (!isLoading) return null;

    return (
        <div
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-800"
            style={{ opacity }}
        >
            {/* Animated Background Stars */}
            <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: 0.1 + Math.random() * 0.4,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    />
                ))}
            </div>

            {/* Central Loading Content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Animated Logo/Orb */}
                <div
                    className="relative w-32 h-32 mb-12"
                    style={{ animation: 'spin 20s linear infinite' }}
                >
                    {/* Outer ring */}
                    <div
                        className="absolute inset-0 border-2 border-cyan-500/30 rounded-full"
                        style={{ animation: 'pulse 2s ease-in-out infinite' }}
                    />

                    {/* Middle ring */}
                    <div
                        className="absolute inset-4 border border-pink-500/40 rounded-full"
                        style={{ animation: 'spin 15s linear infinite reverse' }}
                    />

                    {/* Inner core */}
                    <div
                        className="absolute inset-8 bg-gradient-to-br from-purple-900 to-pink-600 rounded-full"
                        style={{ boxShadow: '0 0 30px rgba(255,0,127,0.4)' }}
                    />

                    {/* Center pulse */}
                    <div
                        className="absolute inset-12 bg-white/20 rounded-full"
                        style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
                    />
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
                    MIDNIGHT GOSPEL
                </h1>

                {/* Subtitle */}
                <div className="text-[10px] md:text-xs tracking-[0.5em] text-white/40 uppercase mb-12">
                    Multiverse Simulator v4.2
                </div>

                {/* Loading Text */}
                <div className="text-cyan-400 text-xs tracking-widest font-mono mb-6 h-4">
                    {loadingText}
                </div>

                {/* Progress Bar */}
                <div className="w-64 md:w-80 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                            background: 'linear-gradient(90deg, #2E004F, #FF007F, #00FFFF)',
                            width: `${displayProgress}%`
                        }}
                    />
                </div>

                {/* Progress Percentage */}
                <div className="mt-4 text-white/30 text-xs font-mono">
                    {Math.round(displayProgress)}%
                </div>
            </div>

            {/* Bottom Credits */}
            <div className="absolute bottom-8 text-center">
                <div className="text-[8px] md:text-[9px] text-white/20 tracking-[0.3em] uppercase">
                    Based on the series by Duncan Trussell & Pendleton Ward
                </div>
            </div>
        </div>
    );
}
