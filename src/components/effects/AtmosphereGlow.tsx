import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface AtmosphereGlowProps {
    color: string;
    radius: number;
    intensity?: number;
    fade?: number;
}

export default function AtmosphereGlow({ color, radius, intensity = 1.0, fade = 2.0 }: AtmosphereGlowProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.lookAt(state.camera.position);
        }
    });

    return (
        <mesh ref={meshRef} scale={[1.2, 1.2, 1.2]} renderOrder={1}>
            <sphereGeometry args={[radius, 32, 32]} />
            <shaderMaterial
                transparent
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                uniforms={{
                    c: { value: 0.2 },
                    p: { value: fade },
                    glowColor: { value: new THREE.Color(color) },
                    viewVector: { value: new THREE.Vector3() },
                    intensity: { value: intensity }
                }}
                vertexShader={`
          uniform vec3 viewVector;
          varying float intensity;
          uniform float c;
          uniform float p;
          void main() {
            vec3 vNormal = normalize(normalMatrix * normal);
            vec3 vNormel = normalize(normalMatrix * viewVector);
            intensity = pow(c - dot(vNormal, vNormel), p);
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
        `}
                fragmentShader={`
          uniform vec3 glowColor;
          varying float intensity;
          uniform float intensityMult;
          void main() { 
            vec3 glow = glowColor * intensity;
            gl_FragColor = vec4( glow, 1.0 );
          }
        `}
            />
        </mesh>
    );
}
