import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { backgroundVertexShader, backgroundFragmentShader } from './Shaders';
import { UniverseConfig } from './types';

interface BackgroundProps {
    config: UniverseConfig;
    analyzer: AnalyserNode | null;
}

const LandingBackground: React.FC<BackgroundProps> = ({ config, analyzer }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { viewport } = useThree();
    const dataArray = useMemo(() => new Uint8Array(analyzer?.frequencyBinCount || 0), [analyzer]);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2() },
        uColorA: { value: new THREE.Color(config.primaryColor) },
        uColorB: { value: new THREE.Color(config.secondaryColor) },
        uAccent: { value: new THREE.Color(config.accentColor) },
        uDistortion: { value: config.distortion },
        uSpeed: { value: config.shaderSpeed },
        uAudio: { value: 0 }
    }), []);

    useMemo(() => {
        uniforms.uColorA.value.set(config.primaryColor);
        uniforms.uColorB.value.set(config.secondaryColor);
        uniforms.uAccent.value.set(config.accentColor);
        uniforms.uDistortion.value = config.distortion;
        uniforms.uSpeed.value = config.shaderSpeed;
    }, [config, uniforms]);

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.getElapsedTime();
            material.uniforms.uResolution.value.set(state.size.width, state.size.height);

            if (analyzer) {
                analyzer.getByteFrequencyData(dataArray);
                const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
                material.uniforms.uAudio.value = avg / 128.0;
            }
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, -5]} scale={[viewport.width * 2, viewport.height * 2, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                vertexShader={backgroundVertexShader}
                fragmentShader={backgroundFragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
            />
        </mesh>
    );
};

export default LandingBackground;
