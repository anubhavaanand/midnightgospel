/**
 * Starfield Component
 * Creates a dense, twinkling star field for pitch black space background
 * GPU-optimized with custom shaders for maximum performance
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDeviceDetection } from '@hooks/useMobileResponsive';

interface StarfieldProps {
    count?: number;
    radius?: number;
}

// Vertex shader
const vertexShader = `
    attribute float size;
    attribute float twinkleSpeed;
    attribute float twinklePhase;
    uniform float time;
    uniform float pixelRatio;
    varying float vOpacity;
    varying vec3 vColor;

    void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Twinkle calculation in vertex shader (super fast)
        float twinkle = sin(time * twinkleSpeed + twinklePhase) * 0.4 + 0.6;
        
        // Screen-space size attenuation
        gl_PointSize = size * twinkle * pixelRatio * (300.0 / -mvPosition.z);
        
        // Pass color to fragment shader (white with slight blue tint)
        vColor = vec3(0.9, 0.95, 1.0);
        
        // Distance fade
        vOpacity = 1.0;
    }
`;

// Fragment shader
const fragmentShader = `
    varying float vOpacity;
    varying vec3 vColor;

    void main() {
        // Circular point shape
        vec2 coord = gl_PointCoord - vec2(0.5);
        if(length(coord) > 0.5) discard;
        
        // Soft edge
        float strength = 1.0 - (length(coord) * 2.0);
        strength = pow(strength, 1.5);
        
        gl_FragColor = vec4(vColor, strength * vOpacity);
    }
`;

export default function Starfield({ count = 2000, radius = 100 }: StarfieldProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const config = useDeviceDetection();

    // Adjust count based on device performance
    const actualCount = useMemo(() => {
        if (config.isLowEnd) return Math.floor(count * 0.3);
        if (config.isMobile) return Math.floor(count * 0.5);
        return count;
    }, [count, config.isLowEnd, config.isMobile]);

    // Generate star data
    const [positions, sizes, twinkleSpeeds, twinklePhases] = useMemo(() => {
        const pos = new Float32Array(actualCount * 3);
        const siz = new Float32Array(actualCount);
        const spd = new Float32Array(actualCount);
        const phs = new Float32Array(actualCount);

        for (let i = 0; i < actualCount; i++) {
            // Sphere distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = radius * (0.3 + Math.random() * 0.7);

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi) - 30;

            // Sizes
            const sizeRandom = Math.random();
            const sizeMult = config.isMobile ? 1.5 : 1.0;

            if (sizeRandom > 0.98) siz[i] = (2.0 + Math.random() * 1.5) * sizeMult;
            else if (sizeRandom > 0.9) siz[i] = (1.0 + Math.random() * 1.0) * sizeMult;
            else siz[i] = (0.5 + Math.random() * 0.5) * sizeMult;

            // Twinkle parameters
            spd[i] = 1.0 + Math.random() * 3.0;
            phs[i] = Math.random() * Math.PI * 2;
        }

        return [pos, siz, spd, phs];
    }, [actualCount, radius, config.isMobile]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = state.clock.elapsedTime;
        }
        if (pointsRef.current) {
            // Slow background rotation
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
        }
    });

    const uniforms = useMemo(() => ({
        time: { value: 0 },
        pixelRatio: { value: config.dpr || 1 }
    }), [config.dpr]);

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={actualCount}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={actualCount}
                    array={sizes}
                    itemSize={1}
                />
                <bufferAttribute
                    attach="attributes-twinkleSpeed"
                    count={actualCount}
                    array={twinkleSpeeds}
                    itemSize={1}
                />
                <bufferAttribute
                    attach="attributes-twinklePhase"
                    count={actualCount}
                    array={twinklePhases}
                    itemSize={1}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
