/**
 * SpaceTravelTransition Component
 * Full-screen wormhole transition using "Dizzying Space Travel" GLTF model
 * Triggered when navigating between levels/planets
 */
import { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// GLTF model path
const TRAVEL_MODEL_PATH = '/models/24-dizzying-space-travel-inktober2019/source/Unity2Skfb.gltf';

interface SpaceTravelTransitionProps {
    isActive: boolean;
    duration?: number;
    onComplete?: () => void;
}

/**
 * Main transition wrapper - handles state and timing
 */
export default function SpaceTravelTransition({
    isActive,
    duration = 2500,
    onComplete,
}: SpaceTravelTransitionProps) {
    const [phase, setPhase] = useState<'idle' | 'entering' | 'traveling' | 'exiting'>('idle');
    const progressRef = useRef(0);

    useEffect(() => {
        if (isActive && phase === 'idle') {
            setPhase('entering');
            progressRef.current = 0;

            // Phase timing
            const enterDuration = duration * 0.2;
            const travelDuration = duration * 0.6;

            setTimeout(() => setPhase('traveling'), enterDuration);
            setTimeout(() => setPhase('exiting'), enterDuration + travelDuration);
            setTimeout(() => {
                setPhase('idle');
                onComplete?.();
            }, duration);
        }
    }, [isActive, duration, onComplete, phase]);

    useFrame((_, delta) => {
        if (phase !== 'idle') {
            progressRef.current += delta * (1000 / duration);
        }
    });

    if (phase === 'idle') return null;

    return (
        <group>
            <Suspense fallback={<FallbackTransition phase={phase} progress={progressRef.current} />}>
                <TravelModel phase={phase} progress={progressRef.current} />
            </Suspense>
        </group>
    );
}

/**
 * GLTF model-based transition
 */
function TravelModel({ phase, progress }: { phase: string; progress: number }) {
    const groupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();

    // Load the GLTF model
    const { scene } = useGLTF(TRAVEL_MODEL_PATH);

    // Clone scene to avoid mutations
    const clonedScene = scene.clone();

    useFrame((state) => {
        if (groupRef.current) {
            // Spin and scale based on phase
            groupRef.current.rotation.z = state.clock.elapsedTime * 3;

            let scale = 0;
            if (phase === 'entering') {
                scale = progress * 5 * 20;
            } else if (phase === 'traveling') {
                scale = 20;
                // Add wobble during travel
                groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 5) * 0.2;
            } else if (phase === 'exiting') {
                scale = 20 * (1 - (progress - 0.8) * 5);
            }

            groupRef.current.scale.setScalar(Math.max(0.01, scale));

            // Position in front of camera
            const forward = new THREE.Vector3(0, 0, -15);
            forward.applyQuaternion(camera.quaternion);
            groupRef.current.position.copy(camera.position).add(forward);
        }
    });

    return (
        <group ref={groupRef}>
            <primitive object={clonedScene} />
            {/* Extra glow ring */}
            <mesh>
                <ringGeometry args={[0.8, 1, 64]} />
                <meshBasicMaterial
                    color="#00FFFF"
                    transparent
                    opacity={0.6}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}

/**
 * Procedural fallback if model fails to load
 */
function FallbackTransition({ phase, progress }: { phase: string; progress: number }) {
    const groupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();

    // Generate wormhole rings
    const rings = Array.from({ length: 20 }, (_, i) => ({
        radius: 0.5 + i * 0.3,
        color: i % 2 === 0 ? '#FF007F' : '#00FFFF',
        speed: 1 + i * 0.1,
    }));

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.z = state.clock.elapsedTime * 2;

            let scale = 0;
            if (phase === 'entering') scale = progress * 5 * 5;
            else if (phase === 'traveling') scale = 5;
            else if (phase === 'exiting') scale = 5 * (1 - (progress - 0.8) * 5);

            groupRef.current.scale.setScalar(Math.max(0.01, scale));

            const forward = new THREE.Vector3(0, 0, -10);
            forward.applyQuaternion(camera.quaternion);
            groupRef.current.position.copy(camera.position).add(forward);
        }
    });

    return (
        <group ref={groupRef}>
            {rings.map((ring, i) => (
                <mesh key={i} position={[0, 0, -i * 0.2]}>
                    <ringGeometry args={[ring.radius * 0.9, ring.radius, 64]} />
                    <meshBasicMaterial
                        color={ring.color}
                        transparent
                        opacity={0.8 - i * 0.03}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
            {/* Center vortex */}
            <mesh>
                <circleGeometry args={[0.4, 32]} />
                <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
            </mesh>
        </group>
    );
}

/**
 * HTML overlay for transition text
 */
export function TransitionOverlay({
    text = "Traveling through the Multiverse...",
    isVisible
}: {
    text?: string;
    isVisible: boolean;
}) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/20">
                <div className="text-white text-xl font-bold tracking-wider animate-pulse">
                    {text}
                </div>
            </div>
        </div>
    );
}

// Preload the model
useGLTF.preload(TRAVEL_MODEL_PATH);
