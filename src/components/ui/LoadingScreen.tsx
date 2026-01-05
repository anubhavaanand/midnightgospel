import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

    // Trigger complete callback
    useEffect(() => {
        if (displayProgress >= 99 && onLoadComplete) {
            const timer = setTimeout(onLoadComplete, 500);
            return () => clearTimeout(timer);
        }
    }, [displayProgress, onLoadComplete]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
                >
                    {/* Animated Background Stars */}
                    <div className="absolute inset-0 overflow-hidden">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full"
                                initial={{
                                    x: Math.random() * window.innerWidth,
                                    y: Math.random() * window.innerHeight,
                                    opacity: 0.1 + Math.random() * 0.4,
                                    scale: 0.5 + Math.random() * 0.5
                                }}
                                animate={{
                                    opacity: [0.1, 0.5, 0.1],
                                    scale: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 3,
                                    repeat: Infinity,
                                    delay: Math.random() * 2
                                }}
                            />
                        ))}
                    </div>

                    {/* Central Loading Content */}
                    <div className="relative z-10 flex flex-col items-center">
                        {/* Animated Logo/Orb */}
                        <motion.div
                            className="relative w-32 h-32 mb-12"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        >
                            {/* Outer ring */}
                            <motion.div
                                className="absolute inset-0 border-2 border-cyan-500/30 rounded-full"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />

                            {/* Middle ring */}
                            <motion.div
                                className="absolute inset-4 border border-pink-500/40 rounded-full"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                            />

                            {/* Inner core */}
                            <motion.div
                                className="absolute inset-8 bg-gradient-to-br from-purple-900 to-pink-600 rounded-full"
                                animate={{
                                    boxShadow: [
                                        '0 0 20px rgba(255,0,127,0.3)',
                                        '0 0 40px rgba(255,0,127,0.5)',
                                        '0 0 20px rgba(255,0,127,0.3)'
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />

                            {/* Center pulse */}
                            <motion.div
                                className="absolute inset-12 bg-white/20 rounded-full"
                                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.7, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            MIDNIGHT GOSPEL
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.div
                            className="text-[10px] md:text-xs tracking-[0.5em] text-white/40 uppercase mb-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Multiverse Simulator v4.2
                        </motion.div>

                        {/* Loading Text */}
                        <motion.div
                            key={loadingText}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-cyan-400 text-xs tracking-widest font-mono mb-6"
                        >
                            {loadingText}
                        </motion.div>

                        {/* Progress Bar */}
                        <div className="w-64 md:w-80 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{
                                    background: 'linear-gradient(90deg, #2E004F, #FF007F, #00FFFF)',
                                    width: `${displayProgress}%`
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: `${displayProgress}%` }}
                            />
                        </div>

                        {/* Progress Percentage */}
                        <div className="mt-4 text-white/30 text-xs font-mono">
                            {Math.round(displayProgress)}%
                        </div>
                    </div>

                    {/* Bottom Credits */}
                    <motion.div
                        className="absolute bottom-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <div className="text-[8px] md:text-[9px] text-white/20 tracking-[0.3em] uppercase">
                            Based on the series by Duncan Trussell & Pendleton Ward
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
