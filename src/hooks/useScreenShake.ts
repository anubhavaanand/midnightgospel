/**
 * E4: Screen Shake Hook
 * Provides camera shake effect on level transitions for impact.
 * Uses spring physics for natural feeling shake decay.
 */
import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSceneStore } from '@store/sceneStore';
import * as THREE from 'three';

interface ShakeConfig {
    intensity: number;
    decay: number;
    maxOffset: number;
}

const DEFAULT_CONFIG: ShakeConfig = {
    intensity: 0.5,
    decay: 0.92,
    maxOffset: 0.3,
};

export function useScreenShake(config: Partial<ShakeConfig> = {}) {
    const { intensity, decay, maxOffset } = { ...DEFAULT_CONFIG, ...config };
    const { camera } = useThree();

    const isTransitioning = useSceneStore((state) => state.isTransitioning);
    const shakeIntensity = useRef(0);
    const originalPosition = useRef(new THREE.Vector3());
    const shakeOffset = useRef(new THREE.Vector3());

    // Trigger shake on transition
    useEffect(() => {
        if (isTransitioning) {
            shakeIntensity.current = intensity;
            originalPosition.current.copy(camera.position);
        }
    }, [isTransitioning, intensity, camera]);

    useFrame(() => {
        if (shakeIntensity.current > 0.001) {
            // Calculate random shake offset
            shakeOffset.current.set(
                (Math.random() - 0.5) * 2 * shakeIntensity.current * maxOffset,
                (Math.random() - 0.5) * 2 * shakeIntensity.current * maxOffset,
                (Math.random() - 0.5) * 2 * shakeIntensity.current * maxOffset * 0.5
            );

            // Apply shake (add to current camera offset)
            camera.position.x += shakeOffset.current.x;
            camera.position.y += shakeOffset.current.y;
            camera.position.z += shakeOffset.current.z;

            // Decay shake intensity
            shakeIntensity.current *= decay;
        }
    });

    // Manual trigger function
    const triggerShake = (customIntensity?: number) => {
        shakeIntensity.current = customIntensity ?? intensity;
        originalPosition.current.copy(camera.position);
    };

    return { triggerShake, shakeIntensity: shakeIntensity.current };
}

/**
 * Screen Shake Component - wrapper for easy use
 */
export default function ScreenShake({
    intensity = 0.5,
    decay = 0.92
}: { intensity?: number; decay?: number }) {
    useScreenShake({ intensity, decay });
    return null;
}
