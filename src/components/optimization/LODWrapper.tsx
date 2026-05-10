import React, { useRef } from 'react';
import { DetailLevel, useLOD } from '@hooks/useLOD';

interface LODWrapperProps {
    high?: React.ReactNode;
    medium?: React.ReactNode;
    low?: React.ReactNode;
    thresholds?: {
        medium: number;
        high: number;
    };
}

/**
 * Component that renders different content based on camera distance
 */
export default function LODWrapper({
    high,
    medium,
    low,
    thresholds
}: LODWrapperProps) {
    const ref = useRef<THREE.Group>(null);
    const level = useLOD(ref as any, { thresholds });

    return (
        <group ref={ref}>
            {level === DetailLevel.HIGH && high}
            {level === DetailLevel.MEDIUM && (medium || high)}
            {level === DetailLevel.LOW && (low || medium || high)}
        </group>
    );
}
