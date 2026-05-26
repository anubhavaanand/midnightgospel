import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const RaymarchedFractal = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    // Initialize Synthetic Ambient Drone
    useEffect(() => {
        // Attempt to start audio context (might need user interaction first)
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        audioContextRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = 55; // Low A for a deep space drone

        gain.gain.value = 0.05; // Keep it ambient and quiet
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        oscillatorRef.current = osc;
        gainNodeRef.current = gain;

        return () => {
            osc.stop();
            osc.disconnect();
            gain.disconnect();
            ctx.close();
        };
    }, []);

    // 4D Raymarched SDF Shader
    const fractalShader = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color("#00FFCC") }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec3 uColor;
            varying vec3 vPosition;

            // Rotation matrix
            mat2 rot(float a) {
                float s = sin(a), c = cos(a);
                return mat2(c, -s, s, c);
            }

            // Signed Distance Field for a 3D morphing fractal (Mandelbulb-ish / folding boxes)
            float map(vec3 p) {
                vec3 q = p;
                q.xz *= rot(uTime * 0.2);
                q.xy *= rot(uTime * 0.3);

                float d = length(q) - 1.0;
                
                // Fold space multiple times
                for(int i=0; i<4; i++) {
                    q = abs(q) - 0.5;
                    q.xz *= rot(uTime * 0.1);
                    q.yz *= rot(uTime * 0.15);
                    d = max(d, length(q) - 0.2);
                }
                
                return d;
            }

            void main() {
                // Raymarching setup inside the cube bounding box
                vec3 ro = vec3(0.0, 0.0, 3.0); // ray origin (camera relative to cube)
                vec3 rd = normalize(vPosition - ro); // ray direction

                float t = 0.0;
                float d = 0.0;
                int maxSteps = 64;
                
                for(int i = 0; i < maxSteps; i++) {
                    vec3 p = ro + rd * t;
                    d = map(p);
                    if(d < 0.001 || t > 5.0) break;
                    t += d;
                }

                if(t < 5.0) {
                    // Hit the fractal!
                    // Simple lighting based on distance
                    float light = 1.0 - (t / 5.0);
                    
                    // Add some pulsing color
                    vec3 glow = uColor * (0.5 + 0.5 * sin(uTime * 2.0));
                    
                    gl_FragColor = vec4(glow * light, 1.0);
                } else {
                    // Missed the fractal (discard pixel so we see through the bounding box)
                    discard;
                }
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    }), []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }

        // Modulate audio frequency slightly based on time (LFO)
        if (oscillatorRef.current && audioContextRef.current?.state === 'running') {
            oscillatorRef.current.frequency.value = 55 + Math.sin(state.clock.elapsedTime * 2.0) * 5;
        }
    });

    return (
        <mesh position={[0, 5, 0]}>
            {/* The bounding box for the raymarching volume */}
            <boxGeometry args={[4, 4, 4]} />
            <primitive object={fractalShader} ref={materialRef} attach="material" />
        </mesh>
    );
};
