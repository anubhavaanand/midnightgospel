import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Ribbon.tsx - Thinner, more elegant version of ChromaticRibbon
 * Fixed geometry to ensure it doesn't block the view
 */

interface RibbonProps {
    position?: [number, number, number];
    scale?: number;
    color1?: string;
    color2?: string;
    speed?: number;
}

export default function Ribbon({
    position = [0, 0, -15],
    scale = 1,
    color1 = '#ff007f',
    color2 = '#00ffff',
    speed = 1
}: RibbonProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(color1) },
        uColor2: { value: new THREE.Color(color2) },
        uSpeed: { value: speed },
    }), [color1, color2, speed]);

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime * speed;

            // Gentle floating motion
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.15) * 0.5;
        }
    });

    const vertexShader = `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Simplex noise for organic movement
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
      vUv = uv;
      vPosition = position;
      
      // Apply noise-based displacement for organic ribbon movement
      vec3 pos = position;
      float noise = snoise(vec3(pos.x * 0.5 + uTime * 0.3, pos.y * 0.3, uTime * 0.2));
      pos.z += noise * 1.5;
      pos.y += sin(pos.x * 0.5 + uTime) * 0.3;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

    const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      // Create flowing gradient along ribbon
      float gradient = sin(vUv.x * 6.28318 + uTime) * 0.5 + 0.5;
      gradient += sin(vUv.y * 3.14159 + uTime * 0.5) * 0.3;
      gradient = clamp(gradient, 0.0, 1.0);
      
      // Mix colors
      vec3 color = mix(uColor1, uColor2, gradient);
      
      // Add shimmer effect
      float shimmer = sin(vUv.x * 20.0 + uTime * 3.0) * 0.1 + 0.9;
      color *= shimmer;
      
      // Edge glow
      float edge = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
      float alpha = edge * 0.9;
      
      // Add sparkle
      float sparkle = pow(sin(vUv.x * 50.0 + uTime * 5.0) * 0.5 + 0.5, 8.0);
      color += vec3(sparkle * 0.3);
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

    return (
        <group position={position}>
            {/* Main thinner ribbon */}
            <mesh ref={meshRef} scale={scale}>
                <planeGeometry args={[60, 0.5, 128, 16]} />
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
        </group>
    );
}
