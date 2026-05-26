import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const FluidFloor = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const fluidShader = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color("#00FFCC") },
            uColor2: { value: new THREE.Color("#FF007F") },
            uMouse: { value: new THREE.Vector2(-9999, -9999) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform float uTime;
            uniform vec2 uMouse;
            
            // Simplex noise for vertex displacement
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v -   i + dot(i, C.xx);
                vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod289(i);
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m*m; m = m*m;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            void main() {
                vUv = uv;
                vNormal = normal;
                vec3 pos = position;
                
                // Add gentle rolling waves
                float noiseFreq = 0.5;
                float noiseAmp = 2.0;
                vec2 noisePos = vec2(pos.x * noiseFreq + uTime * 0.2, pos.y * noiseFreq + uTime * 0.3);
                
                // Add interactive cursor wave displacement
                float mouseDist = distance(uv, uMouse);
                float ripple = 0.0;
                if (uMouse.x > -10.0) {
                    ripple = sin(mouseDist * 35.0 - uTime * 10.0) * exp(-mouseDist * 5.0) * 3.0;
                }
                
                pos.z += snoise(noisePos) * noiseAmp + ripple;
                vPosition = pos;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform vec2 uMouse;
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;

            void main() {
                // Liquid interference pattern
                vec2 p = vUv * 5.0;
                float f = sin(p.x + uTime) * sin(p.y + uTime * 0.5);
                float f2 = sin(p.x * 2.0 - uTime) * cos(p.y * 3.0 + uTime * 0.8);
                
                float mask = smoothstep(-1.0, 1.0, f + f2);
                vec3 color = mix(uColor1, uColor2, mask);
                
                // Add dynamic glowing ring at cursor raycast intersection
                if (uMouse.x > -10.0) {
                    float mouseDist = distance(vUv, uMouse);
                    float ring = smoothstep(0.018, 0.0, abs(sin(mouseDist * 35.0 - uTime * 10.0) * exp(-mouseDist * 5.0) - 0.04));
                    color += vec3(1.0, 1.0, 1.0) * ring * 0.8;
                }
                
                // Soft fade at the edges (distance from center)
                float d = length(vUv - 0.5) * 2.0;
                float alpha = 1.0 - smoothstep(0.5, 1.0, d);

                gl_FragColor = vec4(color, alpha * 0.6);
            }
        `,
        transparent: true,
        wireframe: false,
        side: THREE.DoubleSide
    }), []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh 
            position={[0, -10, 0]} 
            rotation={[-Math.PI / 2, 0, 0]}
            onPointerMove={(e) => {
                e.stopPropagation();
                if (e.uv && materialRef.current) {
                    materialRef.current.uniforms.uMouse.value.copy(e.uv);
                }
            }}
            onPointerOut={() => {
                if (materialRef.current) {
                    materialRef.current.uniforms.uMouse.value.set(-9999, -9999);
                }
            }}
        >
            <planeGeometry args={[100, 100, 128, 128]} />
            <primitive object={fluidShader} ref={materialRef} attach="material" />
        </mesh>
    );
};
