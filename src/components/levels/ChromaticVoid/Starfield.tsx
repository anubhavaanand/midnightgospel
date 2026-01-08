/**
 * Starfield Component
 * Creates a dense, twinkling star field for pitch black space background
 * Optimized for mobile performance
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDeviceDetection } from '@hooks/useMobileResponsive';

interface StarfieldProps {
    count?: number;
    radius?: number;
}

export default function Starfield({ count = 2000, radius = 100 }: StarfieldProps) {
    const starsRef = useRef<THREE.Points>(null);
    const twinkleRef = useRef<Float32Array | null>(null);
    const config = useDeviceDetection();

    // Adjust count based on device performance
    const actualCount = useMemo(() => {
        if (config.isLowEnd) return Math.floor(count * 0.2); // 20% for low-end
        if (config.isMobile) return Math.floor(count * 0.4); // 40% for mobile
        if (config.isTablet) return Math.floor(count * 0.6); // 60% for tablet
        return count; // Full count for desktop
    }, [count, config.isMobile, config.isTablet, config.isLowEnd]);

    // Generate star positions in a sphere around the camera
    const [positions, sizes, colors] = useMemo(() => {
        const pos = new Float32Array(actualCount * 3);
        const siz = new Float32Array(actualCount);
        const col = new Float32Array(actualCount * 3);

        for (let i = 0; i < actualCount; i++) {
            // Distribute stars in a sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = radius * (0.3 + Math.random() * 0.7); // Vary distance

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi) - 30; // Offset back

            // Vary star sizes - mostly small, some larger
            const sizeRandom = Math.random();
            // Larger base sizes on mobile for visibility
            const sizeMult = config.isMobile ? 1.5 : 1;
            if (sizeRandom > 0.98) {
                siz[i] = (0.4 + Math.random() * 0.3) * sizeMult; // Large bright stars (2%)
            } else if (sizeRandom > 0.9) {
                siz[i] = (0.2 + Math.random() * 0.15) * sizeMult; // Medium stars (8%)
            } else {
                siz[i] = (0.05 + Math.random() * 0.1) * sizeMult; // Small stars (90%)
            }

            // Star colors - mostly white, some blue/yellow tints
            const colorChoice = Math.random();
            if (colorChoice > 0.9) {
                // Blue-white stars
                col[i * 3] = 0.8;
                col[i * 3 + 1] = 0.9;
                col[i * 3 + 2] = 1.0;
            } else if (colorChoice > 0.8) {
                // Yellow/orange stars
                col[i * 3] = 1.0;
                col[i * 3 + 1] = 0.9;
                col[i * 3 + 2] = 0.7;
            } else {
                // White stars
                const brightness = 0.7 + Math.random() * 0.3;
                col[i * 3] = brightness;
                col[i * 3 + 1] = brightness;
                col[i * 3 + 2] = brightness;
            }
        }

        return [pos, siz, col];
    }, [actualCount, radius, config.isMobile]);

    // Initialize twinkle phases
    useMemo(() => {
        twinkleRef.current = new Float32Array(actualCount);
        for (let i = 0; i < actualCount; i++) {
            twinkleRef.current[i] = Math.random() * Math.PI * 2;
        }
    }, [actualCount]);

    // Animate twinkling - reduced on mobile
    useFrame((state) => {
        if (!starsRef.current || !twinkleRef.current) return;

        const time = state.clock.elapsedTime;

        // Skip twinkle on low-end devices
        if (config.isLowEnd) {
            starsRef.current.rotation.y = time * 0.005;
            return;
        }

        const sizeAttr = starsRef.current.geometry.getAttribute('size') as THREE.BufferAttribute;

        // Update fewer stars per frame on mobile
        const updateCount = config.isMobile ? Math.min(50, actualCount) : Math.min(200, actualCount);
        const startIdx = Math.floor((time * 50) % actualCount);

        for (let i = 0; i < updateCount; i++) {
            const idx = (startIdx + i) % actualCount;
            const baseSize = sizes[idx];
            const twinkle = Math.sin(time * 3 + twinkleRef.current[idx]) * 0.3 + 0.7;
            sizeAttr.setX(idx, baseSize * twinkle);
        }

        sizeAttr.needsUpdate = true;

        // Slower rotation on mobile for performance
        starsRef.current.rotation.y = time * (config.isMobile ? 0.005 : 0.01);
    });

    return (
        <points ref={starsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={actualCount}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={actualCount}
                    array={sizes}
                    itemSize={1}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={actualCount}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={config.isMobile ? 0.2 : 0.15}
                vertexColors
                transparent
                opacity={1}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
