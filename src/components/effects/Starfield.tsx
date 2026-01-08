import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Midnight Gospel Starfield
 * 
 * A dense, colorful starfield that provides depth and atmosphere throughout the journey.
 * Unlike a realistic starfield, this uses the show's palette (Cyan, Magenta, Gold)
 * to create a breathtaking, psychedelic backdrop.
 */
export default function Starfield() {
    const pointsRef = useRef<THREE.Points>(null);

    const starCount = 2000;

    const { positions, colors } = useMemo(() => {
        const pos = new Float32Array(starCount * 3);
        const col = new Float32Array(starCount * 3);
        const colorChoices = [
            new THREE.Color('#FF007F'), // Hot Pink
            new THREE.Color('#00FFFF'), // Cyan
            new THREE.Color('#F0E68C'), // Gold
            new THREE.Color('#FFFFFF'), // White
        ];

        for (let i = 0; i < starCount; i++) {
            // Random distribution in a large cylinder around the camera path
            const r = 20 + Math.random() * 80; // Radius
            const theta = Math.random() * Math.PI * 2;
            const y = 10 - Math.random() * 60; // Deep vertical range covering all levels

            pos[i * 3] = r * Math.cos(theta);
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = r * Math.sin(theta);

            // Assign random color from palette
            const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
            col[i * 3] = color.r;
            col[i * 3 + 1] = color.g;
            col[i * 3 + 2] = color.b;
        }

        return { positions: pos, colors: col };
    }, []);

    useFrame((state) => {
        if (pointsRef.current) {
            // Slowly rotate the universe for a "peaceful" drift
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={starCount}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={starCount}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                sizeAttenuation
                vertexColors
                transparent
                opacity={0.6}
                depthWrite={false}
            />
        </points>
    );
}
