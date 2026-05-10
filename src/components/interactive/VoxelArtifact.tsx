import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { NEON_CAPSULE_DATA } from '../../data/neonCapsule';
import { FLESH_BLOCK_DATA } from '../../data/fleshBlock';

// Artifact metadata for tooltips
const ARTIFACT_INFO = {
    capsule: {
        name: 'Neon Capsule',
        description: 'A crystallized fragment of simulation energy',
        quote: 'The universe is not only queerer than we suppose, but queerer than we can suppose.',
        author: 'J.B.S. Haldane',
    },
    flesh: {
        name: 'Flesh Block',
        description: 'Organic matter from a dying simulation world',
        quote: 'We are not human beings having a spiritual experience. We are spiritual beings having a human experience.',
        author: 'Pierre Teilhard de Chardin',
    },
};

interface VoxelArtifactProps {
    position: [number, number, number];
    scale?: number;
    type?: 'capsule' | 'flesh';
    interactive?: boolean;
}

function SingleVoxel({ position, color, isDynamic }: { position: [number, number, number]; color: string; isDynamic: boolean }) {
    return (
        <RigidBody
            position={position}
            colliders="cuboid"
            type={isDynamic ? 'dynamic' : 'fixed'}
            restitution={0.5}
            friction={0.8}
        >
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.95, 0.95, 0.95]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.2}
                    metalness={0.1}
                    emissive={color}
                    emissiveIntensity={0.4}
                />
            </mesh>
        </RigidBody>
    );
}

export default function VoxelArtifact({ position, scale = 0.2, type = 'capsule', interactive = true }: VoxelArtifactProps) {
    const [isExploded, setIsExploded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const groupRef = useRef<THREE.Group>(null);

    const info = ARTIFACT_INFO[type];

    const voxels = useMemo(() => {
        const rawData = type === 'flesh' ? FLESH_BLOCK_DATA : NEON_CAPSULE_DATA;

        // Calculate center to offset positions
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;

        rawData.forEach(v => {
            minX = Math.min(minX, v.x); maxX = Math.max(maxX, v.x);
            minY = Math.min(minY, v.y); maxY = Math.max(maxY, v.y);
            minZ = Math.min(minZ, v.z); maxZ = Math.max(maxZ, v.z);
        });

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const centerZ = (minZ + maxZ) / 2;

        return rawData.map((v) => ({
            ...v,
            pos: [
                (v.x - centerX) * 1.0,
                (v.y - centerY) * 1.0,
                (v.z - centerZ) * 1.0
            ] as [number, number, number]
        }));
    }, [type]);

    const handleClick = (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        if (interactive) {
            if (showInfo) {
                // Second click explodes
                setShowInfo(false);
                setIsExploded(true);
            } else {
                // First click shows info
                setShowInfo(true);
            }
        } else {
            setIsExploded(true);
        }
    };

    useFrame((state) => {
        if (!isExploded && groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;

            // Pulsing scale on hover
            if (isHovered) {
                const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
                groupRef.current.scale.setScalar(pulse);
            } else {
                groupRef.current.scale.setScalar(1);
            }
        }
    });

    return (
        <group
            position={position}
            scale={[scale, scale, scale]}
            onClick={handleClick}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
        >
            {isExploded ? (
                <group>
                    {voxels.map((v) => (
                        <SingleVoxel key={v.id} position={v.pos} color={v.c} isDynamic={true} />
                    ))}
                </group>
            ) : (
                <group ref={groupRef}>
                    {voxels.map((v) => (
                        <mesh key={v.id} position={v.pos} castShadow>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial
                                color={v.c}
                                roughness={0.2}
                                metalness={type === 'capsule' ? 0.7 : 0.1}
                                emissive={v.c}
                                emissiveIntensity={isHovered ? 0.8 : (type === 'capsule' ? 0.6 : 0.2)}
                            />
                        </mesh>
                    ))}
                </group>
            )}

            {/* Hover tooltip */}
            {isHovered && !showInfo && !isExploded && interactive && (
                <Html center distanceFactor={15}>
                    <div className="px-3 py-2 bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 text-center whitespace-nowrap">
                        <div className="text-white font-bold text-sm">{info.name}</div>
                        <div className="text-cyan-400 text-xs mt-1">Click to reveal</div>
                    </div>
                </Html>
            )}

            {/* Info panel after first click */}
            {showInfo && !isExploded && (
                <Html center distanceFactor={12}>
                    <div className="px-4 py-3 bg-gradient-to-br from-purple-900/90 to-black/90 backdrop-blur-xl 
                                    rounded-xl border border-pink-500/30 shadow-2xl max-w-[250px] text-center
                                    animate-in zoom-in duration-300">
                        <div className="text-pink-400 font-bold text-lg mb-2">{info.name}</div>
                        <div className="text-white/70 text-sm mb-3">{info.description}</div>
                        <div className="text-white/90 text-sm italic mb-1">"{info.quote}"</div>
                        <div className="text-white/50 text-xs">— {info.author}</div>
                        <div className="text-cyan-400 text-xs mt-3 animate-pulse">Click again to interact</div>
                    </div>
                </Html>
            )}
        </group>
    );
}
