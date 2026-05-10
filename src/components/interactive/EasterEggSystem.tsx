/**
 * Easter Egg Collectibles System
 * Hidden items scattered across levels that unlock achievements
 */
import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@store/sceneStore';
import { Html } from '@react-three/drei';

export interface EasterEgg {
    id: string;
    name: string;
    description: string;
    level: number;
    position: [number, number, number];
    color: string;
    rarity: 'common' | 'rare' | 'legendary';
}

// Easter eggs data - hidden across all levels
export const EASTER_EGGS: EasterEgg[] = [
    // Level 0: Chromatic Void
    {
        id: 'void-crystal',
        name: 'Void Crystal',
        description: 'A fragment of pure simulation energy',
        level: 0,
        position: [-8, 5, -15],
        color: '#00ffff',
        rarity: 'common',
    },
    {
        id: 'clancy-badge',
        name: "Clancy's Badge",
        description: 'Space caster credentials',
        level: 0,
        position: [12, 2, -8],
        color: '#ff007f',
        rarity: 'rare',
    },
    // Level 1: Zombie Apocalypse
    {
        id: 'zombie-tooth',
        name: 'Zombie Tooth',
        description: 'A souvenir from the undead',
        level: 1,
        position: [-10, 3, 5],
        color: '#8b4513',
        rarity: 'common',
    },
    {
        id: 'presidents-hat',
        name: "President's Hat",
        description: 'From the Little President himself',
        level: 1,
        position: [8, 8, -3],
        color: '#ffd700',
        rarity: 'legendary',
    },
    // Level 2: Clown Planet
    {
        id: 'clown-nose',
        name: 'Clown Nose',
        description: 'Honk honk!',
        level: 2,
        position: [0, 6, 10],
        color: '#ff0000',
        rarity: 'common',
    },
    {
        id: 'grinder-gear',
        name: 'Grinder Gear',
        description: 'A cog from the cosmic grinder',
        level: 2,
        position: [-15, 4, -5],
        color: '#c0c0c0',
        rarity: 'rare',
    },
    // Level 3: Ass Cream
    {
        id: 'space-cat-whisker',
        name: 'Space Cat Whisker',
        description: 'Floats with cosmic energy',
        level: 3,
        position: [5, 10, 8],
        color: '#9370db',
        rarity: 'rare',
    },
    {
        id: 'magic-fish',
        name: 'Magic Fish',
        description: "Darryl's mystical companion",
        level: 3,
        position: [-8, 2, 12],
        color: '#00ced1',
        rarity: 'legendary',
    },
    // Level 4: Soul Prison
    {
        id: 'soul-feather',
        name: 'Soul Feather',
        description: 'Left behind by a passing soul bird',
        level: 4,
        position: [7, 12, -2],
        color: '#ffb6c1',
        rarity: 'rare',
    },
    {
        id: 'forgiveness-stone',
        name: 'Forgiveness Stone',
        description: 'Radiates warmth and acceptance',
        level: 4,
        position: [-12, 5, 4],
        color: '#ffa500',
        rarity: 'legendary',
    },
    // Level 5: The Exit
    {
        id: 'infinity-shard',
        name: 'Infinity Shard',
        description: 'A piece of the transcendent explosion',
        level: 5,
        position: [0, 15, 0],
        color: '#ffffff',
        rarity: 'legendary',
    },
    {
        id: 'simulation-key',
        name: 'Simulation Key',
        description: 'Unlocks the secrets of the multiverse',
        level: 5,
        position: [-5, 8, -10],
        color: '#2e004f',
        rarity: 'legendary',
    },
];

const RARITY_COLORS = {
    common: '#aaaaaa',
    rare: '#00aaff',
    legendary: '#ffd700',
};

interface EasterEggProps {
    egg: EasterEgg;
}

function EasterEggCollectible({ egg }: EasterEggProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [showCollected, setShowCollected] = useState(false);

    const collectedEggs = useSceneStore((state) => state.collectedEggs);
    const collectEgg = useSceneStore((state) => state.collectEgg);

    const isCollected = collectedEggs.includes(egg.id);

    // Particle system for uncollected eggs
    const particles = useMemo(() => {
        const count = 20;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const radius = 0.3 + Math.random() * 0.2;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
        }
        return positions;
    }, []);

    useFrame((state) => {
        if (meshRef.current && !isCollected) {
            // Floating animation
            meshRef.current.position.y = egg.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
            meshRef.current.rotation.y = state.clock.elapsedTime;

            // Pulsing glow
            const material = meshRef.current.material as THREE.MeshStandardMaterial;
            material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
        }
    });

    const handleClick = () => {
        if (!isCollected) {
            collectEgg(egg.id);
            setShowCollected(true);
            // Hide notification after 3 seconds
            setTimeout(() => setShowCollected(false), 3000);
        }
    };

    if (isCollected && !showCollected) return null;

    return (
        <group position={egg.position}>
            {/* Main collectible mesh */}
            <mesh
                ref={meshRef}
                onClick={handleClick}
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={() => setIsHovered(false)}
                scale={isHovered ? 1.3 : 1}
            >
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial
                    color={egg.color}
                    emissive={egg.color}
                    emissiveIntensity={0.5}
                    roughness={0.2}
                    metalness={0.8}
                    transparent
                    opacity={isCollected ? 0.3 : 1}
                />
            </mesh>

            {/* Particle ring around collectible */}
            {!isCollected && (
                <points>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={particles.length / 3}
                            array={particles}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        size={0.05}
                        color={RARITY_COLORS[egg.rarity]}
                        transparent
                        opacity={0.8}
                        sizeAttenuation
                    />
                </points>
            )}

            {/* Hover tooltip */}
            {isHovered && !isCollected && (
                <Html center distanceFactor={10}>
                    <div className="px-3 py-2 bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 text-center min-w-[120px]">
                        <div className="text-xs font-bold" style={{ color: RARITY_COLORS[egg.rarity] }}>
                            [{egg.rarity.toUpperCase()}]
                        </div>
                        <div className="text-white text-sm font-bold mt-1">{egg.name}</div>
                        <div className="text-white/60 text-xs mt-1">{egg.description}</div>
                        <div className="text-cyan-400 text-xs mt-2">Click to collect!</div>
                    </div>
                </Html>
            )}

            {/* Collection notification */}
            {showCollected && (
                <Html center distanceFactor={10}>
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm rounded-xl border border-white/30 text-center animate-bounce">
                        <div className="text-2xl mb-1">🎉</div>
                        <div className="text-white font-bold">{egg.name}</div>
                        <div className="text-white/80 text-xs">Collected!</div>
                    </div>
                </Html>
            )}
        </group>
    );
}

interface EasterEggSystemProps {
    currentLevel: number;
}

export default function EasterEggSystem({ currentLevel }: EasterEggSystemProps) {
    // Filter eggs for current level
    const levelEggs = useMemo(
        () => EASTER_EGGS.filter((egg) => egg.level === currentLevel),
        [currentLevel]
    );

    return (
        <group>
            {levelEggs.map((egg) => (
                <EasterEggCollectible key={egg.id} egg={egg} />
            ))}
        </group>
    );
}

/**
 * Progress tracker UI component
 */
export function EasterEggProgress() {
    const collectedEggs = useSceneStore((state) => state.collectedEggs);
    const totalEggs = EASTER_EGGS.length;
    const collected = collectedEggs.length;
    const percentage = Math.round((collected / totalEggs) * 100);

    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
            <span className="text-lg">🥚</span>
            <div className="flex flex-col">
                <div className="text-white text-xs font-bold">
                    {collected}/{totalEggs} Collected
                </div>
                <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
