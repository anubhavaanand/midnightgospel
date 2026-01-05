import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { UniverseConfig } from './types';

interface SceneProps {
    config: UniverseConfig;
    analyzer: AnalyserNode | null;
}

export const SimulationCube: React.FC<SceneProps> = ({ config, analyzer }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { mouse } = useThree();
    const dataArray = useMemo(() => new Uint8Array(analyzer?.frequencyBinCount || 0), [analyzer]);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();

        // Respond to mouse
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouse.y * 0.5, 0.1);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouse.x * 0.5, 0.1);
        meshRef.current.rotation.z += 0.01;

        if (analyzer) {
            analyzer.getByteFrequencyData(dataArray);
            const mid = dataArray[20] / 255; // Middle frequencies
            const scale = 0.8 + mid * 0.4;
            meshRef.current.scale.setScalar(scale);

            // Glitch color intensity
            if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
                meshRef.current.material.emissiveIntensity = 1 + mid * 5;
            }
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 1]}>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial
                color={config.primaryColor}
                emissive={config.accentColor}
                emissiveIntensity={1}
                wireframe
                transparent
                opacity={0.6}
            />
        </mesh>
    );
};

export const ParticleTrail: React.FC<SceneProps> = ({ config, analyzer }) => {
    const { mouse, viewport } = useThree();
    const pointsRef = useRef<THREE.Points>(null);
    const particleCount = 1000;

    const [positions, initialVelocities, lifetimes] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const vel = new Float32Array(particleCount * 3);
        const life = new Float32Array(particleCount);
        for (let i = 0; i < particleCount; i++) life[i] = -1.0;
        return [pos, vel, life];
    }, []);

    useFrame(() => {
        if (!pointsRef.current) return;
        const geo = pointsRef.current.geometry;
        const posAttr = geo.attributes.position;

        const targetX = (mouse.x * viewport.width) / 2;
        const targetY = (mouse.y * viewport.height) / 2;

        const spawnCount = 2;
        for (let j = 0; j < spawnCount; j++) {
            const spawnIndex = Math.floor(Math.random() * particleCount);
            if (lifetimes[spawnIndex] < 0) {
                lifetimes[spawnIndex] = 2.0;
                positions[spawnIndex * 3] = targetX;
                positions[spawnIndex * 3 + 1] = targetY;
                positions[spawnIndex * 3 + 2] = 2;

                initialVelocities[spawnIndex * 3] = (Math.random() - 0.5) * 0.05;
                initialVelocities[spawnIndex * 3 + 1] = (Math.random() - 0.5) * 0.05;
                initialVelocities[spawnIndex * 3 + 2] = -0.05 - Math.random() * 0.05;
            }
        }

        for (let i = 0; i < particleCount; i++) {
            if (lifetimes[i] > 0) {
                lifetimes[i] -= 0.016;
                positions[i * 3] += initialVelocities[i * 3];
                positions[i * 3 + 1] += initialVelocities[i * 3 + 1] + (config.gravity * 0.2);
                positions[i * 3 + 2] += initialVelocities[i * 3 + 2];
            } else {
                positions[i * 3] = -1000;
            }
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                color={config.accentColor}
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

export const PortalCore: React.FC<SceneProps> = ({ config, analyzer }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Group>(null);
    const dataArray = useMemo(() => new Uint8Array(analyzer?.frequencyBinCount || 0), [analyzer]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y = time * 0.2;
            meshRef.current.rotation.z = time * 0.1;
        }
        if (ringRef.current) {
            ringRef.current.rotation.x = time * 0.1;
            ringRef.current.rotation.y = time * -0.2;
        }

        if (analyzer) {
            analyzer.getByteFrequencyData(dataArray);
            const bass = dataArray[2] / 255;
            const scale = 1.0 + bass * 0.4;
            if (meshRef.current) meshRef.current.scale.set(scale, scale, scale);
            if (ringRef.current) ringRef.current.scale.set(scale * 1.1, scale * 1.1, scale * 1.1);
        }
    });

    return (
        <group position={[0, 0, -2]}>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1.2, 8]} />
                <meshStandardMaterial
                    color={config.primaryColor}
                    emissive={config.primaryColor}
                    emissiveIntensity={1.5}
                    wireframe
                />
            </mesh>
            <group ref={ringRef}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[2.5, 0.01, 16, 100]} />
                    <meshStandardMaterial color={config.accentColor} emissive={config.accentColor} emissiveIntensity={3} />
                </mesh>
            </group>
        </group>
    );
};

export const FloatingOrbs: React.FC<SceneProps> = ({ config, analyzer }) => {
    const groupRef = useRef<THREE.Group>(null);
    const orbCount = 12;
    const dataArray = useMemo(() => new Uint8Array(analyzer?.frequencyBinCount || 0), [analyzer]);

    const orbData = useMemo(() => {
        return Array.from({ length: orbCount }).map(() => ({
            position: [
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 8 - 4
            ] as [number, number, number],
            speed: 0.2 + Math.random() * 0.3,
            offset: Math.random() * Math.PI * 2,
            scale: 0.1 + Math.random() * 0.2
        }));
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (groupRef.current && analyzer) {
            analyzer.getByteFrequencyData(dataArray);
            groupRef.current.children.forEach((child, i) => {
                const data = orbData[i];
                child.position.y = data.position[1] + Math.sin(time * data.speed + data.offset) * 2;

                // Map different orbs to different frequency bands
                const bandIndex = Math.floor((i / orbCount) * 50);
                const freq = dataArray[bandIndex] / 255;
                child.scale.setScalar(data.scale * (1 + freq * 3));

                if ((child as THREE.Mesh).material instanceof THREE.MeshStandardMaterial) {
                    ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = 0.2 + freq * 0.5;
                }
            });
        }
    });

    return (
        <group ref={groupRef}>
            {orbData.map((data, i) => (
                <mesh key={i} position={data.position}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshStandardMaterial
                        color={config.secondaryColor}
                        emissive={config.accentColor}
                        emissiveIntensity={1}
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            ))}
        </group>
    );
};
