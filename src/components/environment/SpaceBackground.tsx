/**
 * SpaceBackground Component
 * Persistent cosmic background using "Need Some Space" model
 * with procedural starfield fallback
 */
import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
// @ts-ignore
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

interface SpaceBackgroundProps {
    rotation?: number;
    particleCount?: number;
}

/**
 * Procedural cosmic starfield with nebula-like effects
 * Used as the persistent background for the entire experience
 */
export default function SpaceBackground({
    rotation = 0.0001
}: SpaceBackgroundProps) {
    const groupRef = useRef<THREE.Group>(null);

    // Load the high-fidelity PLY model
    const geometry = useLoader(PLYLoader, '/models/need-some-space/source/model.ply');

    // Create a point material for the PLY model
    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    // Slow rotation animation
    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += rotation * delta * 60;
            // Slight tilt rotation
            groupRef.current.rotation.z += rotation * 0.3 * delta * 60;
        }
    });

    return (
        <group ref={groupRef}>
            {/* High Fidelity PLY Starfield */}
            <points geometry={geometry} material={material} scale={[50, 50, 50]} rotation={[0, 0, 0]} />

            {/* Supplementary Nebula clouds for extra depth */}
            <NebulaCloud position={[-80, 30, -100]} color="#FF007F" size={40} />
            <NebulaCloud position={[60, -40, -80]} color="#00FFFF" size={30} />
            <NebulaCloud position={[0, 60, -120]} color="#8B00FF" size={50} />
            <NebulaCloud position={[-40, -20, -90]} color="#2E004F" size={35} />
        </group>
    );
}

interface NebulaCloudProps {
    position: [number, number, number];
    color: string;
    size: number;
}

function NebulaCloud({ position, color, size }: NebulaCloudProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Gentle pulsing
            const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            meshRef.current.scale.setScalar(scale);
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={0.15}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    );
}

/**
 * Distant galaxy spiral effect
 */
export function GalaxySpiral({
    position = [0, 0, -150] as [number, number, number],
    arms = 3,
    particlesPerArm = 500
}: {
    position?: [number, number, number];
    arms?: number;
    particlesPerArm?: number;
}) {
    const pointsRef = useRef<THREE.Points>(null);

    const { positions, colors } = useMemo(() => {
        const total = arms * particlesPerArm;
        const positions = new Float32Array(total * 3);
        const colors = new Float32Array(total * 3);

        for (let arm = 0; arm < arms; arm++) {
            const armAngle = (arm / arms) * Math.PI * 2;

            for (let i = 0; i < particlesPerArm; i++) {
                const idx = (arm * particlesPerArm + i) * 3;

                // Spiral pattern
                const distance = (i / particlesPerArm) * 50;
                const angle = armAngle + distance * 0.1;
                const spread = Math.random() * 5;

                positions[idx] = Math.cos(angle) * distance + (Math.random() - 0.5) * spread;
                positions[idx + 1] = (Math.random() - 0.5) * spread * 0.5;
                positions[idx + 2] = Math.sin(angle) * distance + (Math.random() - 0.5) * spread;

                // Color gradient from center to edge
                const t = i / particlesPerArm;
                colors[idx] = 1 - t * 0.5;     // Red fades
                colors[idx + 1] = 0.5 + t * 0.5; // Green increases
                colors[idx + 2] = 1;            // Blue stays high
            }
        }

        return { positions, colors };
    }, [arms, particlesPerArm]);

    useFrame((_, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.0002 * delta * 60;
        }
    });

    return (
        <points ref={pointsRef} position={position} rotation={[Math.PI * 0.3, 0, 0]}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.5}
                vertexColors
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
