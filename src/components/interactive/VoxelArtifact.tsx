import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, RigidBodyProps } from '@react-three/rapier';
import * as THREE from 'three';

interface VoxelProps {
    position: [number, number, number];
    color: string;
    isDynamic: boolean;
}

function SingleVoxel({ position, color, isDynamic }: VoxelProps) {
    // If dynamic, it falls/reacts. If not, it stays in place (kinematic/fixed until triggered).
    // For this effect, we want them to be rigid bodies that are 'sleeping' or fixed until the explosion.
    // But Rapier makes switching body types a bit tricky dynamically.
    // Strategy: Use dynamic bodies but with gravity scale 0 initially, or just rely on the "glitch" explosion to wake them.

    return (
        <RigidBody
            position={position}
            colliders="cuboid"
            type={isDynamic ? 'dynamic' : 'fixed'}
            restitution={0.5}
            friction={0.8}
        >
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.95, 0.95, 0.95]} /> {/* Slightly smaller to see gaps */}
                <meshStandardMaterial
                    color={color}
                    roughness={0.2}
                    metalness={0.8}
                    emissive={color}
                    emissiveIntensity={0.2}
                />
            </mesh>
        </RigidBody>
    );
}

interface GlitchArtifactProps {
    position: [number, number, number];
    scale?: number;
}

export default function VoxelArtifact({ position, scale = 1 }: GlitchArtifactProps) {
    const [isExploded, setIsExploded] = useState(false);
    const groupRef = useRef<THREE.Group>(null);

    // Generate voxel grid
    const voxels = useMemo(() => {
        const v = [];
        const size = 3; // 3x3x3 grid
        const colors = ['#FF007F', '#00FFFF', '#2E004F', '#F0F0F0'];

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    // Skip center for hollow feel? No, solid is better for explosion.
                    v.push({
                        id: `vox-${x}-${y}-${z}`,
                        pos: [
                            (x - size / 2) * 1.1,
                            (y - size / 2) * 1.1,
                            (z - size / 2) * 1.1
                        ] as [number, number, number],
                        color: colors[Math.floor(Math.random() * colors.length)]
                    });
                }
            }
        }
        return v;
    }, []);

    const handlePointerOver = () => {
        if (!isExploded) {
            document.body.style.cursor = 'pointer';
        }
    };

    const handlePointerOut = () => {
        document.body.style.cursor = 'auto';
    };

    const handleClick = () => {
        setIsExploded(true);
        // Add logic to apply impulse if possible, but switching to dynamic usually causes gravity to take over which is satisfying enough.
    };

    useFrame((state) => {
        if (!isExploded && groupRef.current) {
            // Rotate entire artifact when whole
            groupRef.current.rotation.x += 0.005;
            groupRef.current.rotation.y += 0.01;
        }
    });

    return (
        <group
            position={position}
            scale={[scale, scale, scale]}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
        >
            {isExploded ? (
                // Exploded state: Individual physics bodies
                <group>
                    {voxels.map((vox) => (
                        <SingleVoxel
                            key={vox.id}
                            position={vox.pos}
                            color={vox.color}
                            isDynamic={true}
                        />
                    ))}
                </group>
            ) : (
                // Whole state: Single mesh or group of meshes for better performance moving together
                // effectively a "kinematic" group manually rotated
                <group ref={groupRef}>
                    {voxels.map((vox) => (
                        <mesh key={vox.id} position={vox.pos} castShadow>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial
                                color={vox.color}
                                roughness={0.2}
                                metalness={0.8}
                                emissive={vox.color}
                                emissiveIntensity={0.2}
                            />
                        </mesh>
                    ))}
                    {/* Invisible hitbox for easier clicking */}
                    <mesh visible={false}>
                        <boxGeometry args={[4, 4, 4]} />
                    </mesh>
                </group>
            )}
        </group>
    );
}
