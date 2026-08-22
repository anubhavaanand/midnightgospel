/**
 * Cinematic Intro Component
 * Auto-plays on first visit - camera flies through space
 */
import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CinematicIntroProps {
    duration?: number;
    onComplete: () => void;
}

/**
 * Cinematic intro sequence - camera flies through the cosmos
 */
export default function CinematicIntro({
    duration = 6000,
    onComplete
}: CinematicIntroProps) {
    const { camera } = useThree();
    const [, setProgress] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const initialPositionRef = useRef(new THREE.Vector3(0, 0, 100));

    useFrame((state) => {
        if (startTimeRef.current === null) {
            startTimeRef.current = state.clock.elapsedTime * 1000;
            initialPositionRef.current.copy(camera.position);
        }

        const elapsed = state.clock.elapsedTime * 1000 - startTimeRef.current;
        const t = Math.min(elapsed / duration, 1);
        setProgress(t);

        // Eased progress
        const eased = easeInOutCubic(t);

        // Camera path - fly through space toward the hub
        const pathProgress = eased;

        // Spiral approach
        const angle = pathProgress * Math.PI * 2;
        const radius = 100 * (1 - pathProgress) + 50;
        const height = 50 * (1 - pathProgress) + 10;

        camera.position.x = Math.sin(angle) * radius * 0.5;
        camera.position.y = height + Math.sin(pathProgress * Math.PI) * 20;
        camera.position.z = Math.cos(angle) * radius;

        // Look at center
        camera.lookAt(0, 0, 0);

        // Complete
        if (t >= 1) {
            onComplete();
        }

        // Dispatch progress for overlay
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cinematic-intro-progress', { detail: t }));
        }
    });

    return null; // Pure animation component
}

function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Intro overlay with title and skip button
 */
export function CinematicIntroOverlay({
    isVisible,
    progress,
    onSkip,
}: {
    isVisible: boolean;
    progress: number;
    onSkip: () => void;
}) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[150] pointer-events-auto">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

            {/* Title sequence */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Title fades in at start */}
                <div
                    className="text-center transition-all duration-1000"
                    style={{
                        opacity: progress < 0.3 ? progress / 0.3 : progress > 0.8 ? (1 - progress) / 0.2 : 1,
                        transform: `scale(${0.8 + progress * 0.2})`
                    }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-[0.3em] mb-4 
                         drop-shadow-[0_0_30px_rgba(255,0,127,0.5)]">
                        MULTIVERSE
                    </h1>
                    <h2 className="text-3xl md:text-5xl font-light text-pink-400 tracking-[0.5em]
                         drop-shadow-[0_0_20px_rgba(255,0,127,0.7)]">
                        SIMULATOR
                    </h2>
                    <p className="text-white/60 text-lg mt-8 tracking-widest">
                        A Midnight Gospel Experience
                    </p>
                </div>
            </div>

            {/* Skip button */}
            <button
                onClick={onSkip}
                className="absolute bottom-10 right-10 px-6 py-3 bg-black/50 backdrop-blur-sm
                   border border-white/20 rounded-full text-white/70 hover:text-white
                   hover:border-white/40 transition-all text-sm tracking-wider"
            >
                SKIP INTRO →
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 transition-all"
                    style={{ width: `${progress * 100}%` }}
                />
            </div>
        </div>
    );
}


