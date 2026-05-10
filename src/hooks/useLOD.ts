import { useFrame, useThree } from '@react-three/fiber';
import { useState, useMemo } from 'react';
import * as THREE from 'three';

export enum DetailLevel {
    LOW = 0,
    MEDIUM = 1,
    HIGH = 2,
}

interface LODOptions {
    thresholds?: {
        medium: number;
        high: number;
    };
}

/**
 * Hook to determine the required detail level based on camera distance
 * @param objectRef Ref to the 3D object
 * @param options Calibration for distance thresholds
 */
export function useLOD(objectRef: React.RefObject<THREE.Object3D>, options: LODOptions = {}) {
    const { camera } = useThree();
    const [level, setLevel] = useState<DetailLevel>(DetailLevel.HIGH);

    // Default thresholds if none provided
    const thresholds = useMemo(() => ({
        medium: options.thresholds?.medium ?? 30,
        high: options.thresholds?.high ?? 15,
    }), [options.thresholds]);

    const worldPosition = useMemo(() => new THREE.Vector3(), []);

    useFrame(() => {
        if (!objectRef.current) return;

        // Get world position of the object
        objectRef.current.getWorldPosition(worldPosition);

        // Calculate distance to camera
        const distance = camera.position.distanceTo(worldPosition);

        // Determine level
        let nextLevel = DetailLevel.LOW;
        if (distance < thresholds.high) {
            nextLevel = DetailLevel.HIGH;
        } else if (distance < thresholds.medium) {
            nextLevel = DetailLevel.MEDIUM;
        }

        if (nextLevel !== level) {
            setLevel(nextLevel);
        }
    });

    return level;
}
