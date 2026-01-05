import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CosmicEnvironment - Shared cosmic space background for all levels
 * Creates immersive cosmos feeling with stars, nebulae, and cosmic dust
 */

interface CosmicEnvironmentProps {
    intensity?: number;
    nebulaColor1?: string;
    nebulaColor2?: string;
    starCount?: number;
}

/**
 * Starfield - Dense star background
 */
export function Starfield({ count = 2000, depth = 100 }: { count?: number; depth?: number }) {
    const starsRef = useRef<THREE.Points>(null);

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const cols = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Spherical distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 50 + Math.random() * depth;

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);

            // Star colors - white, blue-white, yellow
            const colorChoice = Math.random();
            if (colorChoice < 0.6) {
                // White stars
                cols[i * 3] = 1;
                cols[i * 3 + 1] = 1;
                cols[i * 3 + 2] = 1;
            } else if (colorChoice < 0.8) {
                // Blue-white stars
                cols[i * 3] = 0.7;
                cols[i * 3 + 1] = 0.85;
                cols[i * 3 + 2] = 1;
            } else {
                // Yellow/orange stars
                cols[i * 3] = 1;
                cols[i * 3 + 1] = 0.9;
                cols[i * 3 + 2] = 0.7;
            }
        }

        return [pos, cols];
    }, [count, depth]);

    useFrame((state) => {
        if (starsRef.current) {
            starsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
            starsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.05;
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
                size={0.15}
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
 * Nebula - Volumetric cosmic cloud
 */
export function Nebula({
    color1 = '#ff007f',
    color2 = '#00ffff',
    position = [0, 0, -50] as [number, number, number],
    scale = 1
}: {
    color1?: string;
    color2?: string;
    position?: [number, number, number];
    scale?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(color1) },
        uColor2: { value: new THREE.Color(color2) },
    }), [color1, color2]);

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv);
      
      // Animated noise
      float noise1 = snoise(vec3(vUv * 2.0, uTime * 0.1));
      float noise2 = snoise(vec3(vUv * 4.0 + 10.0, uTime * 0.15));
      float noise3 = snoise(vec3(vUv * 8.0 + 20.0, uTime * 0.2));
      
      float combinedNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
      
      // Nebula shape
      float nebula = smoothstep(0.8, 0.0, dist + combinedNoise * 0.3);
      nebula *= 0.6 + combinedNoise * 0.4;
      
      // Color mixing
      vec3 color = mix(uColor1, uColor2, noise1 * 0.5 + 0.5);
      color = mix(color, vec3(1.0), noise3 * 0.1);
      
      // Fade at edges
      float alpha = nebula * smoothstep(0.6, 0.2, dist);
      
      gl_FragColor = vec4(color, alpha * 0.4);
    }
  `;

    return (
        <mesh ref={meshRef} position={position} scale={scale * 40}>
            <planeGeometry args={[1, 1, 32, 32]} />
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
 * CosmicDust - Subtle floating particles throughout space
 */
export function CosmicDust({ count = 500 }: { count?: number }) {
    const dustRef = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 100;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }
        return pos;
    }, [count]);

    useFrame((state) => {
        if (dustRef.current) {
            dustRef.current.rotation.y = state.clock.elapsedTime * 0.02;
            const positions = dustRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < count; i++) {
                positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001;
            }
            dustRef.current.geometry.attributes.position.needsUpdate = true;
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
                size={0.05}
                sizeAttenuation
                color="#ffffff"
                transparent
                opacity={0.3}
                depthWrite={false}
            />
        </points>
    );
}

/**
 * DistantGalaxy - Spiral galaxy in the background
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
    const particleCount = 1000;

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const cols = new Float32Array(particleCount * 3);
        const galaxyColor = new THREE.Color(color);
        const coreColor = new THREE.Color('#ffffff');

        for (let i = 0; i < particleCount; i++) {
            // Spiral galaxy pattern
            const arm = Math.floor(Math.random() * 2);
            const angle = (i / particleCount) * Math.PI * 6 + arm * Math.PI;
            const radius = (i / particleCount) * 10 + Math.random() * 2;
            const spread = Math.random() * 0.5;

            pos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * spread;
            pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 2;
            pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * spread;

            // Color gradient from core to arms
            const t = radius / 12;
            const mixedColor = coreColor.clone().lerp(galaxyColor, t);
            cols[i * 3] = mixedColor.r;
            cols[i * 3 + 1] = mixedColor.g;
            cols[i * 3 + 2] = mixedColor.b;
        }

        return [pos, cols];
    }, [color]);

    useFrame((state) => {
        if (galaxyRef.current) {
            galaxyRef.current.rotation.y = state.clock.elapsedTime * 0.05;
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
                size={0.1}
                sizeAttenuation
                vertexColors
                transparent
                opacity={0.8}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

/**
 * CosmicEnvironment - Complete cosmic space background
 */
export default function CosmicEnvironment({
    intensity = 1,
    nebulaColor1 = '#2e004f',
    nebulaColor2 = '#ff007f',
    starCount = 1500
}: CosmicEnvironmentProps) {
    return (
        <group>
            {/* Dense starfield */}
            <Starfield count={Math.floor(starCount * intensity)} depth={150} />

            {/* Cosmic dust particles */}
            <CosmicDust count={Math.floor(300 * intensity)} />

            {/* Multiple nebulae at different positions */}
            <Nebula color1={nebulaColor1} color2={nebulaColor2} position={[20, 10, -60]} scale={1.5} />
            <Nebula color1="#00ffff" color2="#2e004f" position={[-30, -15, -80]} scale={1.2} />
            <Nebula color1="#ff007f" color2="#00ffff" position={[0, 30, -100]} scale={2} />

            {/* Distant galaxies */}
            <DistantGalaxy position={[50, 30, -120]} scale={0.8} color="#ff007f" />
            <DistantGalaxy position={[-60, -20, -100]} scale={0.6} color="#00ffff" />
        </group>
    );
}
