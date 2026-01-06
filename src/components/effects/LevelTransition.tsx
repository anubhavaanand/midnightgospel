import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@store/sceneStore';

/**
 * Level Transition Effect
 * Particle burst and visual effects when transitioning between levels
 */

interface LevelTransitionProps {
    fromLevel: number;
    toLevel: number;
    isActive: boolean;
    onComplete?: () => void;
}

// Level-specific transition colors
const TRANSITION_COLORS = [
    ['#ff007f', '#00ffff'], // From Chromatic Void
    ['#ff3333', '#1a0a0a'], // From Zombie
    ['#ffff00', '#ff66cc'], // From Clown Planet
    ['#00ffff', '#004466'], // From Ass Cream
    ['#9900ff', '#1a0033'], // From Soul Prison
    ['#ffffff', '#00ffff'], // From The Exit
];

export function LevelTransitionBurst({ fromLevel, toLevel: _toLevel, isActive, onComplete }: LevelTransitionProps) {
    const particlesRef = useRef<THREE.Points>(null);
    const [progress, setProgress] = useState(0);
    const particleCount = 200;

    const colors = TRANSITION_COLORS[fromLevel] || TRANSITION_COLORS[0];
    const color1 = new THREE.Color(colors[0]);
    const color2 = new THREE.Color(colors[1]);

    const [positions, velocities, particleColors] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const vel = new Float32Array(particleCount * 3);
        const cols = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            // Start at center
            pos[i * 3] = 0;
            pos[i * 3 + 1] = 0;
            pos[i * 3 + 2] = 0;

            // Random explosion direction
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const speed = 0.5 + Math.random() * 1.5;

            vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
            vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
            vel[i * 3 + 2] = Math.cos(phi) * speed;

            // Blend between colors
            const t = Math.random();
            const blendedColor = color1.clone().lerp(color2, t);
            cols[i * 3] = blendedColor.r;
            cols[i * 3 + 1] = blendedColor.g;
            cols[i * 3 + 2] = blendedColor.b;
        }

        return [pos, vel, cols];
    }, [fromLevel, color1, color2]);

    useEffect(() => {
        if (isActive) {
            setProgress(0);
        }
    }, [isActive]);

    useFrame((_, delta) => {
        if (!isActive || !particlesRef.current) return;

        setProgress(prev => {
            const next = prev + delta;
            if (next >= 1.5 && onComplete) {
                onComplete();
            }
            return next;
        });

        const posAttr = particlesRef.current.geometry.attributes.position;
        const posArray = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
            posArray[i * 3] += velocities[i * 3] * delta * 2;
            posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta * 2;
            posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta * 2;
        }

        posAttr.needsUpdate = true;

        // Fade out
        const material = particlesRef.current.material as THREE.PointsMaterial;
        material.opacity = Math.max(0, 1 - progress / 1.5);
    });

    if (!isActive) return null;

    return (
        <points ref={particlesRef} position={[0, 0, -5]}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particleCount}
                    array={particleColors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                sizeAttenuation
                vertexColors
                transparent
                opacity={1}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

/**
 * Screen Wipe Transition Effect
 * Smooth color wipe between levels
 */
export function ScreenWipeEffect() {
    const meshRef = useRef<THREE.Mesh>(null);
    const isTransitioning = useSceneStore((state) => state.isTransitioning);
    const [wipeProgress, setWipeProgress] = useState(0);

    useEffect(() => {
        if (isTransitioning) {
            setWipeProgress(0);
        }
    }, [isTransitioning]);

    useFrame((_, delta) => {
        if (!isTransitioning || !meshRef.current) return;

        setWipeProgress(prev => Math.min(prev + delta * 2, 1));

        const material = meshRef.current.material as THREE.MeshBasicMaterial;

        // Fade in then out
        if (wipeProgress < 0.5) {
            material.opacity = wipeProgress * 2;
        } else {
            material.opacity = (1 - wipeProgress) * 2;
        }
    });

    if (!isTransitioning) return null;

    return (
        <mesh ref={meshRef} position={[0, 0, -1]}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial
                color="#000000"
                transparent
                opacity={0}
                depthWrite={false}
            />
        </mesh>
    );
}

/**
 * Chromatic Flash Effect
 * Brief color flash when entering new level
 */
interface ChromaticFlashProps {
    color: string;
    isActive: boolean;
    duration?: number;
}

export function ChromaticFlash({ color, isActive, duration = 0.3 }: ChromaticFlashProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [flashProgress, setFlashProgress] = useState(0);

    useEffect(() => {
        if (isActive) {
            setFlashProgress(0);
        }
    }, [isActive]);

    useFrame((_, delta) => {
        if (!isActive || !meshRef.current) return;

        setFlashProgress(prev => Math.min(prev + delta / duration, 1));

        const material = meshRef.current.material as THREE.MeshBasicMaterial;
        // Quick flash and fade
        material.opacity = Math.max(0, 0.3 * (1 - flashProgress));
    });

    if (!isActive || flashProgress >= 1) return null;

    return (
        <mesh ref={meshRef} position={[0, 0, -0.5]}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={0.3}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    );
}

/**
 * Ambient Particles
 * Floating particles that enhance the cosmic feel
 */
interface AmbientParticlesProps {
    count?: number;
    color?: string;
    speed?: number;
    spread?: number;
}

export function AmbientParticles({
    count = 100,
    color = '#ffffff',
    speed = 0.5,
    spread = 30
}: AmbientParticlesProps) {
    const particlesRef = useRef<THREE.Points>(null);

    const [positions] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const szs = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * spread;
            pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
            pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
            szs[i] = 0.02 + Math.random() * 0.05;
        }

        return [pos, szs];
    }, [count, spread]);

    useFrame((state) => {
        if (!particlesRef.current) return;

        const time = state.clock.elapsedTime;
        const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            // Gentle floating motion
            posArray[i * 3 + 1] += Math.sin(time * speed + i) * 0.002;
            posArray[i * 3] += Math.cos(time * speed * 0.5 + i) * 0.001;
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.rotation.y = time * 0.02;
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.04}
                sizeAttenuation
                color={color}
                transparent
                opacity={0.4}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
