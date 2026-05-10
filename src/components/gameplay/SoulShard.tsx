import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@store/gameStore';
import { useSoundEffects } from '@hooks/useSoundEffects';

interface SoulShardProps {
    id: string;
    position: [number, number, number];
    color?: string;
    value?: number;
}

export default function SoulShard({ id, position, color = '#00ffff', value = 100 }: SoulShardProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const [collected, setCollected] = useState(false);

    const collectItem = useGameStore((state) => state.collectItem);
    const hasCollected = useGameStore((state) => state.hasCollected(id));
    const { playChime, playHover } = useSoundEffects();

    // If already collected (persisted state), don't render or render ghost
    if (hasCollected && !collected) {
        return null;
    }

    useFrame((_, delta) => {
        if (meshRef.current && !collected) {
            meshRef.current.rotation.y += delta * 1;
            meshRef.current.rotation.z += delta * 0.5;
        }

        // collected animation (fly up and scale down)
        if (collected && meshRef.current) {
            meshRef.current.position.y += delta * 5;
            meshRef.current.scale.multiplyScalar(0.9);
            if (meshRef.current.scale.x < 0.01) {
                // Unmount conceptually handled by parent re-render or just hidden
            }
        }
    });

    const handleCollect = (e: any) => {
        e.stopPropagation();
        if (collected) return;

        playChime();
        setCollected(true);

        // Delayed state update to allow animation to play
        setTimeout(() => {
            collectItem(id, value);
        }, 1000);
    };

    if (hasCollected) return null;

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh
                    ref={meshRef}
                    onClick={handleCollect}
                    onPointerEnter={() => { setHovered(true); playHover(); }}
                    onPointerLeave={() => setHovered(false)}
                    scale={hovered ? 1.2 : 1}
                >
                    <octahedronGeometry args={[0.5, 0]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={hovered ? 2 : 0.8}
                        roughness={0.1}
                        metalness={0.8}
                        transparent
                        opacity={0.9}
                    />
                </mesh>

                {/* Glow halo */}
                <mesh scale={[1.2, 1.2, 1.2]}>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.BackSide} />
                </mesh>

                <Sparkles
                    count={20}
                    scale={2}
                    size={2}
                    speed={0.4}
                    opacity={0.5}
                    color={color}
                />

                {hovered && (
                    <Text
                        position={[0, 1.2, 0]}
                        fontSize={0.3}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.02}
                        outlineColor="black"
                    >
                        Soul Shard
                    </Text>
                )}
            </Float>
        </group>
    );
}
