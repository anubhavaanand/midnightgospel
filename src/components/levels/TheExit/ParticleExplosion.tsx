import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float time;
  uniform float explosionSpeed;
  attribute vec3 velocity;
  attribute float lifeOffset;
  
  varying float vOpacity;

  void main() {
    float particleTime = mod(time + lifeOffset, 2.0); // 2 second loop
    
    // Position based on velocity and time
    vec3 newPos = position + velocity * particleTime * explosionSpeed;
    
    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    gl_PointSize = (1.0 - particleTime / 2.0) * 200.0 / -mvPosition.z;
    
    // Fade out
    vOpacity = 1.0 - (particleTime / 2.0);
  }
`;

const fragmentShader = `
  varying float vOpacity;
  
  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    if(length(coord) > 0.5) discard;
    
    gl_FragColor = vec4(1.0, 0.0, 0.5, vOpacity); // Hot pink #FF007F
  }
`;

export default function ParticleExplosion() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const count = 1000;

  const [positions, velocities, lifeOffsets] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const life = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Start at center
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;

      // Random spherical velocity
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 15 + Math.random() * 10;

      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      vel[i * 3 + 2] = Math.cos(phi) * speed;

      // Random start time offset
      life[i] = Math.random() * 2.0;
    }

    return [pos, vel, life];
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    explosionSpeed: { value: 1.0 }
  }), []);

  return (
    <points ref={pointsRef} position={[0, 5, -8]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-velocity"
          count={count}
          array={velocities}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-lifeOffset"
          count={count}
          array={lifeOffsets}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
