/**
 * Level Audio Triggers
 * Triggered voice snippets and sound effects on level entry
 */
import { useEffect, useRef, useState } from 'react';
import { useSceneStore } from '@store/sceneStore';
import { useFrame } from '@react-three/fiber';

// Voice snippet configurations for each level
export const LEVEL_VOICE_SNIPPETS = [
    {
        level: 0,
        quotes: [
            { text: "Welcome to the Multiverse Simulator...", speaker: "System" },
            { text: "Please select a dying world to explore.", speaker: "System" },
        ],
        delay: 2000,
    },
    {
        level: 1,
        quotes: [
            { text: "Death is not the end. It's a transformation.", speaker: "Clancy" },
            { text: "There is no way to survive... except by undergoing death.", speaker: "Clancy" },
        ],
        delay: 1500,
    },
    {
        level: 2,
        quotes: [
            { text: "Suffering is just attachment to a specific outcome.", speaker: "Anne Lamott" },
            { text: "Accept the mess. The mess is where the magic is.", speaker: "Raghu Markus" },
        ],
        delay: 1500,
    },
    {
        level: 3,
        quotes: [
            { text: "You can't stop the waves, but you can learn to surf.", speaker: "Damien Echols" },
            { text: "Home isn't a place. It's a frequency.", speaker: "Darryl" },
        ],
        delay: 1500,
    },
    {
        level: 4,
        quotes: [
            { text: "Forgiveness is giving up the hope that the past could have been different.", speaker: "Trudy" },
            { text: "There is a kind of love that doesn't care if you're broken.", speaker: "Clancy" },
        ],
        delay: 1500,
    },
    {
        level: 5,
        quotes: [
            { text: "You can't die in a sim prison. You can only be reborn.", speaker: "Jason Louv" },
            { text: "The ego is just a spacesuit for the soul.", speaker: "Clancy" },
        ],
        delay: 1500,
    },
];

interface VoiceSnippetOverlayProps {
    text: string;
    speaker: string;
    onComplete: () => void;
}

function VoiceSnippetOverlay({ text, speaker, onComplete }: VoiceSnippetOverlayProps) {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Fade in
        const showTimer = setTimeout(() => setVisible(true), 100);

        // Progress animation
        const duration = 4000;
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            setProgress(Math.min(elapsed / duration, 1));
            if (elapsed >= duration) {
                clearInterval(interval);
                setVisible(false);
                setTimeout(onComplete, 300);
            }
        }, 50);

        return () => {
            clearTimeout(showTimer);
            clearInterval(interval);
        };
    }, [onComplete]);

    return (
        <div
            className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 
                  transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
            <div className="px-6 py-4 bg-black/80 backdrop-blur-xl rounded-xl border border-white/20 
                      shadow-2xl max-w-md text-center">
                <div className="text-white/90 text-lg italic mb-2">"{text}"</div>
                <div className="text-pink-400 text-sm">— {speaker}</div>

                {/* Progress bar */}
                <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all"
                        style={{ width: `${progress * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

interface LevelAudioTriggersProps {
    enabled?: boolean;
}

export default function LevelAudioTriggers({ enabled = true }: LevelAudioTriggersProps) {
    const activeLevel = useSceneStore((state) => state.activeLevel);
    const visitLevel = useSceneStore((state) => state.visitLevel);

    const [currentSnippet, setCurrentSnippet] = useState<{ text: string; speaker: string } | null>(null);
    const prevLevelRef = useRef<number>(-1);
    const shownSnippetsRef = useRef<Set<number>>(new Set());

    // Track level visits and trigger snippets
    useEffect(() => {
        if (!enabled) return;

        // Only trigger on level change
        if (prevLevelRef.current !== activeLevel) {
            // Mark level as visited
            visitLevel(activeLevel);

            // Check if we should show a snippet (first visit only)
            const levelConfig = LEVEL_VOICE_SNIPPETS[activeLevel];
            if (levelConfig && !shownSnippetsRef.current.has(activeLevel)) {
                // Delay before showing
                const timer = setTimeout(() => {
                    const randomQuote = levelConfig.quotes[Math.floor(Math.random() * levelConfig.quotes.length)];
                    setCurrentSnippet(randomQuote);
                    shownSnippetsRef.current.add(activeLevel);
                }, levelConfig.delay);

                prevLevelRef.current = activeLevel;
                return () => clearTimeout(timer);
            }

            prevLevelRef.current = activeLevel;
        }
    }, [activeLevel, enabled, visitLevel]);

    const handleSnippetComplete = () => {
        setCurrentSnippet(null);
    };

    if (!currentSnippet) return null;

    return (
        <VoiceSnippetOverlay
            text={currentSnippet.text}
            speaker={currentSnippet.speaker}
            onComplete={handleSnippetComplete}
        />
    );
}

/**
 * 3D positioned audio trigger point
 */
interface AudioTriggerPointProps {
    position: [number, number, number];
    soundName: string;
    triggerRadius?: number;
    oneShot?: boolean;
}

export function AudioTriggerPoint({
    position,
    soundName,
    triggerRadius = 5,
    oneShot = true
}: AudioTriggerPointProps) {
    const triggered = useRef(false);
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ camera }) => {
        if (!meshRef.current) return;

        const distance = camera.position.distanceTo(meshRef.current.position);

        if (distance < triggerRadius && (!triggered.current || !oneShot)) {
            if (!triggered.current) {
                console.log(`Audio trigger: ${soundName}`);
                // Would play audio here
                triggered.current = true;
            }
        }
    });

    // Invisible trigger volume
    return (
        <mesh ref={meshRef} position={position} visible={false}>
            <sphereGeometry args={[triggerRadius, 8, 8]} />
            <meshBasicMaterial transparent opacity={0} />
        </mesh>
    );
}
