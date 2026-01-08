/**
 * 3D Sun Component
 * A glowing medium-sized sun with corona, flares, and animated surface
 * Optimized for mobile performance
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDeviceDetection } from '@hooks/useMobileResponsive';

interface SunProps {
    position?: [number, number, number];
    size?: number;
}

export default function Sun({ position = [15, 8, -25], size = 4 }: SunProps) {
    const sunRef = useRef<THREE.Group>(null);
    const coronaRef = useRef<THREE.Mesh>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const config = useDeviceDetection();

    // Reduce geometry complexity on mobile
    const coreSegments = config.isMobile ? 24 : 64;
    const coronaSegments = config.isMobile ? 16 : 32;

    // Animate the sun - simplified on mobile
    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (sunRef.current) {
            // Slow rotation
            sunRef.current.rotation.y = time * 0.05;
        }

        // Skip complex animations on mobile
        if (config.isMobile) return;

        if (coronaRef.current) {
            // Pulsing corona
            const pulse = 1 + Math.sin(time * 2) * 0.08;
            coronaRef.current.scale.setScalar(pulse);
        }

        if (coreRef.current && coreRef.current.material) {
            // Flickering core brightness
            const mat = coreRef.current.material as THREE.MeshStandardMaterial;
            mat.emissiveIntensity = 1.5 + Math.sin(time * 5) * 0.3;
        }

        if (glowRef.current) {
            // Outer glow pulsing
            const glowPulse = 1 + Math.sin(time * 1.5) * 0.15;
            glowRef.current.scale.setScalar(glowPulse);
        }
    });

    return (
        <group ref={sunRef} position={position}>
            {/* Core - bright yellow/orange sphere */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[size, coreSegments, coreSegments]} />
                <meshStandardMaterial
                    color="#FFA500"
                    emissive="#FF6600"
                    emissiveIntensity={1.5}
                    roughness={1}
                    metalness={0}
                />
            </mesh>

            {/* Inner Corona - slightly larger, semi-transparent */}
            <mesh ref={coronaRef}>
                <sphereGeometry args={[size * 1.15, coronaSegments, coronaSegments]} />
                <meshBasicMaterial
                    color="#FF8C00"
                    transparent
                    opacity={0.4}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Outer Glow - large soft glow (skip on mobile) */}
            {!config.isMobile && (
                <mesh ref={glowRef}>
                    <sphereGeometry args={[size * 1.8, 32, 32]} />
                    <meshBasicMaterial
                        color="#FF4500"
                        transparent
                        opacity={0.15}
                        side={THREE.BackSide}
                    />
                </mesh>
            )}

            {/* Outermost Glow - very soft fade (skip on mobile) */}
            {!config.isMobile && (
                <mesh>
                    <sphereGeometry args={[size * 2.5, 24, 24]} />
                    <meshBasicMaterial
                        color="#FFD700"
                        transparent
                        opacity={0.05}
                        side={THREE.BackSide}
                    />
                </mesh>
            )}

            {/* Point light to illuminate the scene */}
            <pointLight
                color="#FF9900"
                intensity={config.isMobile ? 2 : 3}
                distance={100}
                decay={2}
            />

            {/* Secondary light for softer fill (skip on low-end) */}
            {!config.isLowEnd && (
                <pointLight
                    color="#FFD700"
                    intensity={1}
                    distance={60}
                    decay={2}
                    position={[0, 0, size * 2]}
                />
            )}
        </group>
    );
}

