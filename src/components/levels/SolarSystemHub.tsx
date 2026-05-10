/**
 * Solar System Hub
 * Interactive hub for navigating between levels/worlds
 * Each planet represents a different episode/level
 */
import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import LODWrapper from '@components/optimization/LODWrapper';
import AtmosphereGlow from '@components/effects/AtmosphereGlow';

// Planet configurations matching levels
const PLANETS = [
    {
        id: 0,
        name: 'Chromatic Void',
        description: 'The Simulator Entrance',
        color: '#2E004F',
        emissive: '#8B00FF',
        size: 1.2,
        orbitRadius: 7,
        orbitSpeed: 0.1,
        rings: true,
    },
    {
        id: 1,
        name: 'Planet Zombie',
        description: 'Taste of the King',
        color: '#4A0000',
        emissive: '#FF3333',
        size: 1.5,
        orbitRadius: 11,
        orbitSpeed: 0.08,
        rings: false,
    },
    {
        id: 2,
        name: 'Clown World',
        description: 'Officers and Wolves',
        color: '#FFD700',
        emissive: '#FF6600',
        size: 1.3,
        orbitRadius: 15,
        orbitSpeed: 0.06,
        rings: false,
    },
    {
        id: 3,
        name: 'Ocean Nebula',
        description: 'Hunters Without Home',
        color: '#006994',
        emissive: '#00FFFF',
        size: 1.8,
        orbitRadius: 19,
        orbitSpeed: 0.05,
        rings: true,
    },
    {
        id: 4,
        name: 'Soul Prison',
        description: 'Blinded by My End',
        color: '#FF69B4',
        emissive: '#FF007F',
        size: 1.4,
        orbitRadius: 23,
        orbitSpeed: 0.04,
        rings: false,
    },
    {
        id: 5,
        name: 'The Exit',
        description: 'Transcendence',
        color: '#FFFFFF',
        emissive: '#FFFFFF',
        size: 2.0,
        orbitRadius: 28,
        orbitSpeed: 0.03,
        rings: true,
    },
];

interface SolarSystemHubProps {
    onSelectPlanet: (levelId: number) => void;
    currentLevel?: number;
}

export default function SolarSystemHub({ onSelectPlanet, currentLevel = -1 }: SolarSystemHubProps) {
    return (
        <group>
            <ScrollNavigator onNavigate={onSelectPlanet} currentId={currentLevel === -1 ? 0 : currentLevel} />

            {/* Central sun */}
            <CentralSun />
            <ambientLight intensity={0.2} color="#4A004A" />

            {/* Orbital paths */}
            {PLANETS.map((planet) => (
                <OrbitPath key={`orbit-${planet.id}`} radius={planet.orbitRadius} />
            ))}

            {/* Planets */}
            {PLANETS.map((planet) => (
                <Planet
                    key={planet.id}
                    config={planet}
                    isActive={currentLevel === planet.id}
                    onClick={() => onSelectPlanet(planet.id)}
                />
            ))}
        </group>
    );
}

/**
 * Handles mouse wheel scroll to cycle through planets
 */
function ScrollNavigator({ onNavigate, currentId }: { onNavigate: (id: number) => void, currentId: number }) {
    const lastScrollTime = useRef(0);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            // Ignore if interactions are not on the canvas (e.g. scrolling UI)
            if ((e.target as HTMLElement).tagName !== 'CANVAS') return;

            const now = Date.now();
            // Debounce scroll to prevent rapid jumping (500ms)
            if (now - lastScrollTime.current < 500) return;

            if (Math.abs(e.deltaY) > 30) {
                lastScrollTime.current = now;

                // Determine direction
                const direction = e.deltaY > 0 ? 1 : -1;

                // Calculate new index
                let newIndex = currentId + direction;
                if (newIndex >= PLANETS.length) newIndex = 0;
                if (newIndex < 0) newIndex = PLANETS.length - 1;

                onNavigate(newIndex);
            }
        };

        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [currentId, onNavigate]);

    return null;
}

/**
 * Central glowing sun at the hub center
 */
function CentralSun() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Pulsing glow
            const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            meshRef.current.scale.setScalar(scale);
        }
    });

    return (
        <Float speed={0.5} rotationIntensity={0.2}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[3, 32, 32]} />
                <meshStandardMaterial
                    color="#FFD700"
                    emissive="#FF6600"
                    emissiveIntensity={2}
                    roughness={0.2}
                />
            </mesh>
            {/* Sun glow */}
            <mesh>
                <sphereGeometry args={[4, 32, 32]} />
                <meshBasicMaterial
                    color="#FF6600"
                    transparent
                    opacity={0.3}
                    side={THREE.BackSide}
                />
            </mesh>
            {/* Sun rays */}
            <pointLight color="#FFD700" intensity={100} distance={100} />
        </Float>
    );
}

/**
 * Orbital path visualization
 */
function OrbitPath({ radius }: { radius: number }) {
    const points = useMemo(() => {
        const pts = [];
        for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
        }
        return pts;
    }, [radius]);

    const geometry = useMemo(() => {
        return new THREE.BufferGeometry().setFromPoints(points);
    }, [points]);

    return (
        <line>
            <bufferGeometry attach="geometry" {...geometry} />
            <lineBasicMaterial color="#FFFFFF" transparent opacity={0.1} />
        </line>
    );
}

/**
 * Individual planet with hover effects and labels
 */
interface PlanetProps {
    config: typeof PLANETS[0];
    isActive: boolean;
    onClick: () => void;
}

function Planet({ config, isActive, onClick }: PlanetProps) {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const angleRef = useRef(Math.random() * Math.PI * 2);

    useFrame((_, delta) => {
        if (groupRef.current) {
            // Orbit around center
            angleRef.current += config.orbitSpeed * delta;
            groupRef.current.position.x = Math.cos(angleRef.current) * config.orbitRadius;
            groupRef.current.position.z = Math.sin(angleRef.current) * config.orbitRadius;
            groupRef.current.position.y = Math.sin(angleRef.current * 0.5) * 2; // Slight vertical wobble
        }

        if (meshRef.current) {
            // Self-rotation
            meshRef.current.rotation.y += 0.005;

            // Hover scale effect
            const targetScale = hovered ? 1.3 : 1;
            meshRef.current.scale.lerp(
                new THREE.Vector3(targetScale, targetScale, targetScale),
                0.1
            );
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
                {/* Planet sphere with LOD */}
                <LODWrapper
                    thresholds={{ high: 15, medium: 30 }}
                    high={
                        <group>
                            <mesh
                                ref={meshRef}
                                onClick={onClick}
                                onPointerEnter={() => setHovered(true)}
                                onPointerLeave={() => setHovered(false)}
                            >
                                <sphereGeometry args={[config.size, 64, 64]} />
                                <meshStandardMaterial
                                    color={config.color}
                                    emissive={config.emissive}
                                    emissiveIntensity={isActive ? 1.5 : hovered ? 0.8 : 0.2}
                                    roughness={0.7}
                                    metalness={0.1}
                                />
                            </mesh>
                            <AtmosphereGlow
                                color={config.emissive}
                                radius={config.size}
                                intensity={0.5}
                                fade={1.8}
                            />
                        </group>
                    }
                    medium={
                        <mesh
                            ref={meshRef}
                            onClick={onClick}
                            onPointerEnter={() => setHovered(true)}
                            onPointerLeave={() => setHovered(false)}
                        >
                            <sphereGeometry args={[config.size, 16, 16]} />
                            <meshStandardMaterial
                                color={config.color}
                                emissive={config.emissive}
                                emissiveIntensity={isActive ? 1 : 0.2}
                                roughness={0.6}
                            />
                        </mesh>
                    }
                    low={
                        <mesh
                            ref={meshRef}
                            onClick={onClick}
                        >
                            <sphereGeometry args={[config.size, 8, 8]} />
                            <meshBasicMaterial color={config.color} />
                        </mesh>
                    }
                />

                {/* Optional rings */}
                {config.rings && (
                    <mesh rotation={[Math.PI * 0.5, 0, 0]}>
                        <ringGeometry args={[config.size * 1.5, config.size * 2, 64]} />
                        <meshBasicMaterial
                            color={config.emissive}
                            transparent
                            opacity={0.4}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                )}

                {/* Active indicator */}
                {isActive && (
                    <mesh>
                        <sphereGeometry args={[config.size * 1.3, 16, 16]} />
                        <meshBasicMaterial
                            color="#FFFFFF"
                            transparent
                            opacity={0.2}
                            side={THREE.BackSide}
                        />
                    </mesh>
                )}

                {/* Hover label */}
                {hovered && (
                    <Html center distanceFactor={20}>
                        <div className="px-4 py-2 bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 text-center whitespace-nowrap">
                            <div className="text-white font-bold text-sm">{config.name}</div>
                            <div className="text-white/60 text-xs">{config.description}</div>
                            <div className="text-cyan-400 text-xs mt-1 animate-pulse">Click to enter</div>
                        </div>
                    </Html>
                )}
            </Float>
        </group>
    );
}

export { PLANETS };
