import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';

export const PhysicsOrbs = ({ count = 20 }: { count?: number }) => {
    // Generate random initial positions
    const orbs = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: [
                (Math.random() - 0.5) * 20,
                Math.random() * 10 + 2,
                (Math.random() - 0.5) * 20
            ] as [number, number, number],
            scale: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.5 ? "#00FFCC" : "#FF007F"
        }));
    }, [count]);

    return (
        <group>
            {orbs.map((orb, i) => (
                <InteractiveOrb key={i} {...orb} />
            ))}
        </group>
    );
};

const InteractiveOrb = ({ position, scale, color }: { position: [number, number, number], scale: number, color: string }) => {
    const rbRef = useRef<RapierRigidBody>(null);

    // Apply random floating forces every frame to simulate zero-gravity drift
    useFrame((state) => {
        if (rbRef.current) {
            const time = state.clock.elapsedTime;
            // Generate deterministic noise based on position and time
            const forceX = Math.sin(time + position[0]) * 0.02;
            const forceY = Math.cos(time + position[1]) * 0.02;
            const forceZ = Math.sin(time * 0.8 + position[2]) * 0.02;
            
            rbRef.current.applyImpulse({ x: forceX, y: forceY, z: forceZ }, true);
        }
    });

    const handleClick = () => {
        // Apply a massive impulse when clicked
        if (rbRef.current) {
            rbRef.current.applyImpulse({ 
                x: (Math.random() - 0.5) * 5, 
                y: Math.random() * 5 + 2, 
                z: (Math.random() - 0.5) * 5 
            }, true);
        }
    };

    return (
        <RigidBody 
            ref={rbRef}
            position={position} 
            colliders="ball" 
            restitution={0.8} // Bouncy!
            linearDamping={0.5} // Slow down over time in "space"
            angularDamping={0.5}
        >
            <mesh onClick={handleClick} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
                <sphereGeometry args={[scale, 32, 32]} />
                <meshStandardMaterial 
                    color={color} 
                    emissive={color}
                    emissiveIntensity={0.5}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
        </RigidBody>
    );
};
