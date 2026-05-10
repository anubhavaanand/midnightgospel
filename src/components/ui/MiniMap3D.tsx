/**
 * 3D Mini-Map Component
 * Solar system view showing current position with quick-travel functionality
 */
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@store/sceneStore';
import { LEVEL_RANGES } from '@utils/constants';

// Planet configurations matching solar system hub
const MINI_PLANETS = [
    { id: 0, name: 'Void', color: '#8B00FF', size: 0.15 },
    { id: 1, name: 'Zombie', color: '#FF3333', size: 0.18 },
    { id: 2, name: 'Clown', color: '#FFD700', size: 0.16 },
    { id: 3, name: 'Ocean', color: '#00FFFF', size: 0.2 },
    { id: 4, name: 'Soul', color: '#FF007F', size: 0.17 },
    { id: 5, name: 'Exit', color: '#FFFFFF', size: 0.22 },
];

interface MiniMap3DProps {
    onQuickTravel?: (level: number) => void;
}

/**
 * Main 3D Mini-Map with solar system view
 */
export default function MiniMap3D({ onQuickTravel }: MiniMap3DProps) {
    const showMiniMap = useSceneStore((state) => state.showMiniMap);
    const toggleMiniMap = useSceneStore((state) => state.toggleMiniMap);
    const activeLevel = useSceneStore((state) => state.activeLevel);
    const navigateToLevel = useSceneStore((state) => state.navigateToLevel);

    const handleQuickTravel = (level: number) => {
        if (onQuickTravel) {
            onQuickTravel(level);
        } else {
            navigateToLevel(level);
        }
    };

    if (!showMiniMap) {
        return (
            <button
                onClick={toggleMiniMap}
                className="fixed right-8 top-1/2 -translate-y-1/2 w-10 h-10 
                   bg-black/60 backdrop-blur-xl border border-white/20 rounded-full
                   flex items-center justify-center hover:bg-white/10 transition-all
                   pointer-events-auto z-50 group"
                title="Show Mini-Map (M)"
            >
                <span className="text-white/60 group-hover:text-white text-lg">🪐</span>
            </button>
        );
    }

    return (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 pointer-events-auto z-50">
            {/* Container */}
            <div className="relative">
                {/* Close button */}
                <button
                    onClick={toggleMiniMap}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-black/60 rounded-full
                     border border-white/20 text-white/40 hover:text-white text-xs
                     flex items-center justify-center z-10"
                >
                    ✕
                </button>

                {/* 3D Canvas */}
                <div className="w-32 h-48 bg-black/40 backdrop-blur-xl rounded-xl 
                        border border-white/20 overflow-hidden">
                    <Canvas
                        camera={{ position: [0, 3, 5], fov: 50 }}
                        style={{ background: 'transparent' }}
                    >
                        <ambientLight intensity={0.3} />
                        <pointLight position={[0, 0, 0]} intensity={2} color="#FFD700" />
                        <SolarSystemMini
                            activeLevel={activeLevel}
                            onSelectPlanet={handleQuickTravel}
                        />
                    </Canvas>
                </div>

                {/* Current level label */}
                <div className="mt-2 text-center">
                    <div
                        className="text-xs font-bold"
                        style={{ color: MINI_PLANETS[activeLevel]?.color || '#fff' }}
                    >
                        {LEVEL_RANGES[activeLevel]?.name || 'Unknown'}
                    </div>
                    <div className="text-[10px] text-white/40">
                        Click planet to travel
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Inner 3D solar system scene
 */
function SolarSystemMini({
    activeLevel,
    onSelectPlanet
}: {
    activeLevel: number;
    onSelectPlanet: (level: number) => void;
}) {
    const groupRef = useRef<THREE.Group>(null);

    // Rotate entire system slowly
    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Central sun */}
            <mesh>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color="#FFD700" />
            </mesh>

            {/* Planets on orbits */}
            {MINI_PLANETS.map((planet, index) => (
                <MiniPlanet
                    key={planet.id}
                    config={planet}
                    orbitRadius={0.6 + index * 0.35}
                    isActive={activeLevel === planet.id}
                    onClick={() => onSelectPlanet(planet.id)}
                />
            ))}
        </group>
    );
}

/**
 * Individual mini planet
 */
function MiniPlanet({
    config,
    orbitRadius,
    isActive,
    onClick,
}: {
    config: typeof MINI_PLANETS[0];
    orbitRadius: number;
    isActive: boolean;
    onClick: () => void;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const angleRef = useRef(config.id * (Math.PI / 3)); // Spread planets

    // Orbit animation
    useFrame((_, delta) => {
        if (meshRef.current) {
            angleRef.current += delta * (0.5 - config.id * 0.05);
            meshRef.current.position.x = Math.cos(angleRef.current) * orbitRadius;
            meshRef.current.position.z = Math.sin(angleRef.current) * orbitRadius;
            meshRef.current.position.y = Math.sin(angleRef.current * 2) * 0.1;
        }
    });

    return (
        <>
            {/* Orbit path */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[orbitRadius - 0.01, orbitRadius + 0.01, 32]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={isActive ? 0.3 : 0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Planet */}
            <mesh
                ref={meshRef}
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
            >
                <sphereGeometry args={[isActive ? config.size * 1.3 : config.size, 16, 16]} />
                <meshStandardMaterial
                    color={config.color}
                    emissive={config.color}
                    emissiveIntensity={isActive ? 1 : hovered ? 0.5 : 0.2}
                />

                {/* Active glow */}
                {isActive && (
                    <mesh>
                        <sphereGeometry args={[config.size * 1.8, 8, 8]} />
                        <meshBasicMaterial
                            color={config.color}
                            transparent
                            opacity={0.3}
                            side={THREE.BackSide}
                        />
                    </mesh>
                )}

                {/* Hover tooltip */}
                {hovered && (
                    <Html center distanceFactor={5}>
                        <div className="px-2 py-1 bg-black/80 rounded text-[10px] text-white whitespace-nowrap">
                            {config.name}
                        </div>
                    </Html>
                )}
            </mesh>
        </>
    );
}
