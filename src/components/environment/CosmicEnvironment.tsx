import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CosmicEnvironment - Shared cosmic space background for all levels
 * Creates immersive cosmos feeling with PITCH DARK BLACK space,
 * subtle distant stars, and very faint nebulae
 */

interface CosmicEnvironmentProps {
    intensity?: number;
    nebulaColor1?: string;
    nebulaColor2?: string;
    starCount?: number;
}

/**
 * Deep Space Background - Pitch black void
 */
export function DeepSpaceVoid() {
    return (
        <mesh position={[0, 0, 0]} scale={[500, 500, 500]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial
                color="#000000"
                side={THREE.BackSide}
            />
        </mesh>
    );
}

/**
 * Starfield - Dense star background against pitch black
 */
export function Starfield({ count = 1500, depth = 100 }: { count?: number; depth?: number }) {
    const starsRef = useRef<THREE.Points>(null);

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const cols = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Spherical distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 60 + Math.random() * depth;

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);

            // Most stars are dim, few are bright
            const brightness = Math.random();
            const isBright = brightness > 0.95;
            const baseBrightness = isBright ? 0.8 + Math.random() * 0.2 : 0.2 + Math.random() * 0.3;

            // Star colors - mostly white/blue-white against black
            const colorChoice = Math.random();
            if (colorChoice < 0.7) {
                // White/dim white stars
                cols[i * 3] = baseBrightness;
                cols[i * 3 + 1] = baseBrightness;
                cols[i * 3 + 2] = baseBrightness;
            } else if (colorChoice < 0.9) {
                // Blue-white stars
                cols[i * 3] = baseBrightness * 0.7;
                cols[i * 3 + 1] = baseBrightness * 0.85;
                cols[i * 3 + 2] = baseBrightness;
            } else {
                // Rare yellow/orange stars
                cols[i * 3] = baseBrightness;
                cols[i * 3 + 1] = baseBrightness * 0.8;
                cols[i * 3 + 2] = baseBrightness * 0.5;
            }
        }

        return [pos, cols];
    }, [count, depth]);

    useFrame((state) => {
        if (starsRef.current) {
            // Very slow rotation to show we're in space
            starsRef.current.rotation.y = state.clock.elapsedTime * 0.002;
            starsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.001) * 0.02;
        }
    });

    return (
        <points ref={starsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                sizeAttenuation
                vertexColors
                transparent
                opacity={0.9}
                depthWrite={false}
            />
        </points>
    );
}

/**
 * Nebula - Very subtle, distant cosmic cloud
 * Optimized Shader: Reduced noise complexity for better performance
 */
export function Nebula({
    color1 = '#ff007f',
    color2 = '#00ffff',
    position = [0, 0, -50] as [number, number, number],
    scale = 1,
    opacity = 0.15
}: {
    color1?: string;
    color2?: string;
    position?: [number, number, number];
    scale?: number;
    opacity?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(color1) },
        uColor2: { value: new THREE.Color(color2) },
        uOpacity: { value: opacity },
    }), [color1, color2, opacity]);

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    // OPTIMIZED FRAGMENT SHADER: Simpler noise function, fewer calculations
    const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uOpacity;
    varying vec2 vUv;
    
    // Simple pseudo-random noise (faster than Simplex)
    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv);
      
      // Use simpler noise - single layer moved slowly
      float n = noise(uv * 3.0 + uTime * 0.1);
      
      // Soft radial gradient
      float radial = 1.0 - smoothstep(0.0, 0.7, dist);
      
      // Combine noise and gradient
      float strength = (n * 0.5 + 0.5) * radial;
      
      // Color mix
      vec3 color = mix(uColor1, uColor2, n);
      
      // Final alpha
      float alpha = strength * uOpacity * smoothstep(0.8, 0.2, dist);
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

    return (
        <mesh ref={meshRef} position={position} scale={scale * 50}>
            <planeGeometry args={[1, 1, 16, 16]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

/**
 * CosmicDust - Very subtle floating particles
 */
export function CosmicDust({ count = 200 }: { count?: number }) {
    const dustRef = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 150;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 150;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 150;
        }
        return pos;
    }, [count]);

    useFrame((state) => {
        if (dustRef.current) {
            dustRef.current.rotation.y = state.clock.elapsedTime * 0.005;
        }
    });

    return (
        <points ref={dustRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                sizeAttenuation
                color="#555555"
                transparent
                opacity={0.15}
                depthWrite={false}
            />
        </points>
    );
}

/**
 * DistantGalaxy - Very distant, subtle spiral galaxy
 */
export function DistantGalaxy({
    position = [30, 20, -80] as [number, number, number],
    scale = 1,
    color = '#ff007f'
}: {
    position?: [number, number, number];
    scale?: number;
    color?: string;
}) {
    const galaxyRef = useRef<THREE.Points>(null);
    const particleCount = 400; // Reduced from 600

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const cols = new Float32Array(particleCount * 3);
        const galaxyColor = new THREE.Color(color);
        const coreColor = new THREE.Color('#ffffff');

        for (let i = 0; i < particleCount; i++) {
            const arm = Math.floor(Math.random() * 2);
            const angle = (i / particleCount) * Math.PI * 6 + arm * Math.PI;
            const radius = (i / particleCount) * 8 + Math.random() * 1.5;
            const spread = Math.random() * 0.3;

            pos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * spread;
            pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 1.5;
            pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * spread;

            const t = radius / 10;
            const mixedColor = coreColor.clone().lerp(galaxyColor, t);
            const dimFactor = 0.25 + Math.random() * 0.15;
            cols[i * 3] = mixedColor.r * dimFactor;
            cols[i * 3 + 1] = mixedColor.g * dimFactor;
            cols[i * 3 + 2] = mixedColor.b * dimFactor;
        }

        return [pos, cols];
    }, [color]);

    useFrame((state) => {
        if (galaxyRef.current) {
            galaxyRef.current.rotation.y = state.clock.elapsedTime * 0.015;
        }
    });

    return (
        <points ref={galaxyRef} position={position} scale={scale} rotation={[0.5, 0, 0.3]}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particleCount}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                sizeAttenuation
                vertexColors
                transparent
                opacity={0.5}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

/**
 * CosmicEnvironment - Complete cosmic space background
 * PITCH BLACK void with subtle distant elements
 */
export default function CosmicEnvironment({
    intensity = 1,
    nebulaColor1 = '#2e004f',
    nebulaColor2 = '#ff007f',
    starCount = 1500
}: CosmicEnvironmentProps) {
    return (
        <group>
            {/* Pitch black void background */}
            <DeepSpaceVoid />

            {/* Dense but dim starfield against the black */}
            <Starfield count={Math.floor(starCount * intensity)} depth={200} />

            {/* Very subtle cosmic dust */}
            <CosmicDust count={Math.floor(200 * intensity)} />

            {/* Very distant, subtle nebulae - barely visible */}
            <Nebula
                color1={nebulaColor1}
                color2={nebulaColor2}
                position={[40, 20, -150]}
                scale={1.0}
                opacity={0.06}
            />
            <Nebula
                color1="#00ffff"
                color2="#2e004f"
                position={[-50, -25, -180]}
                scale={0.8}
                opacity={0.04}
            />

            {/* Very distant galaxies */}
            <DistantGalaxy position={[100, 50, -250]} scale={0.4} color="#ff007f" />
            <DistantGalaxy position={[-120, -40, -220]} scale={0.3} color="#00ffff" />
        </group>
    );
}
