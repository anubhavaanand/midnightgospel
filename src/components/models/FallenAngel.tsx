import { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useFBX, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useSoundEffects } from '@hooks/useSoundEffects';

interface FallenAngelProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
    interactive?: boolean;
}

export default function FallenAngel({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.02,
    interactive = true,
}: FallenAngelProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);
    const [activated, setActivated] = useState(false);
    const { playHover, playClick, playActivate } = useSoundEffects();

    // Load FBX model
    const originalFbx = useFBX('/models/fallen-angel-demon-knight-with-dual-wings/source/Sensenmonster.fbx');

    // Load PBR textures
    const textures = useTexture({
        map: '/models/fallen-angel-demon-knight-with-dual-wings/textures/Sensenmonster_basecolor.jpeg',
        metalnessMap: '/models/fallen-angel-demon-knight-with-dual-wings/textures/Sensenmonster_metallic.jpeg',
        normalMap: '/models/fallen-angel-demon-knight-with-dual-wings/textures/Sensenmonster_normal.jpeg',
        roughnessMap: '/models/fallen-angel-demon-knight-with-dual-wings/textures/Sensenmonster_roughness.jpeg',
    });

    // Clone model and apply materials ONCE using useMemo
    const model = useMemo(() => {
        const cloned = originalFbx.clone();

        // Create shared material
        const material = new THREE.MeshStandardMaterial({
            map: textures.map,
            metalnessMap: textures.metalnessMap,
            normalMap: textures.normalMap,
            roughnessMap: textures.roughnessMap,
            metalness: 0.8,
            roughness: 0.4,
            emissive: new THREE.Color('#110000'),
            emissiveIntensity: 0.3,
        });

        cloned.traverse((child: any) => {
            if (child.isMesh) {
                child.material = material;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        return cloned;
    }, [originalFbx, textures]);

    useFrame((state) => {
        if (!groupRef.current) return;

        const time = state.clock.elapsedTime;

        // Subtle floating animation
        groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2;

        // Subtle rotation when hovered
        if (hovered) {
            groupRef.current.rotation.y += 0.01;
        }

        // Pulsing glow when activated - update material emissive
        if (model) {
            model.traverse((child: any) => {
                if (child.isMesh && child.material) {
                    child.material.emissive.setHex(activated ? 0xff3300 : 0x110000);
                    child.material.emissiveIntensity = activated ? 1.5 : 0.3;
                }
            });
        }
    });

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        if (!interactive) return;
        e.stopPropagation();
        playClick();
        setActivated(!activated);
        if (!activated) {
            playActivate();
        }
    };

    const handlePointerOver = () => {
        if (!interactive) return;
        setHovered(true);
        document.body.style.cursor = 'pointer';
        playHover();
    };

    const handlePointerOut = () => {
        setHovered(false);
        document.body.style.cursor = 'auto';
    };

    return (
        <group
            ref={groupRef}
            position={position}
            rotation={rotation}
            scale={scale}
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        >
            <primitive object={model} />

            {/* Ambient point light for dramatic effect */}
            <pointLight
                color={activated ? '#ff3300' : '#660000'}
                intensity={activated ? 2 : 0.5}
                distance={10}
                decay={2}
            />
        </group>
    );
}
