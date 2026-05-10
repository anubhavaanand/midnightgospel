import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import LODWrapper from '@components/optimization/LODWrapper';

/**
 * SkeletalLandscape Component
 * 
 * Bosch-inspired surreal landscape of bone formations crawling out of earth.
 */

export default function SkeletalLandscape() {
  const landscapeRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state: any) => {
    if (landscapeRef.current) {
      timeRef.current += state.delta;

      // Subtle oscillation suggesting unease/suffering
      const children = landscapeRef.current.children;
      children.forEach((child, index) => {
        const offset = Math.sin(timeRef.current * 0.3 + index * 0.2) * 0.02;
        if (child instanceof THREE.Mesh && child.position) {
          child.position.y += offset - child.position.y * 0.001;
        }
      });
    }
  });

  return (
    <group ref={landscapeRef} position={[0, -3, -8]}>
      <LODWrapper
        thresholds={{ high: 20, medium: 45 }}
        high={
          <>
            {/* Main skull formation - center focal point */}
            <mesh position={[0, 3, 0]} castShadow receiveShadow>
              <sphereGeometry args={[2, 16, 16]} />
              <meshStandardMaterial
                color="#F0F0F0"
                emissive="#FF007F"
                emissiveIntensity={0.25}
                roughness={0.6}
                metalness={0.1}
              />
            </mesh>

            {/* Eye sockets - dark void */}
            <mesh position={[-0.6, 3.8, 1.8]} scale={[0.4, 0.5, 0.3]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshStandardMaterial
                color="#0A0E27"
                emissive="#2E004F"
                emissiveIntensity={0.4}
              />
            </mesh>

            <mesh position={[0.6, 3.8, 1.8]} scale={[0.4, 0.5, 0.3]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshStandardMaterial
                color="#0A0E27"
                emissive="#2E004F"
                emissiveIntensity={0.4}
              />
            </mesh>

            {/* Nasal cavity */}
            <mesh position={[0, 3.2, 1.9]}>
              <sphereGeometry args={[0.25, 8, 8]} />
              <meshStandardMaterial
                color="#0A0E27"
                emissive="#2E004F"
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Teeth - skeletal grin */}
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh key={`tooth-${i}`} position={[-1.4 + i * 0.35, 1.8, 2]} scale={[0.3, 0.5, 0.3]} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                  color="#E8E8E8"
                  emissive="#FF007F"
                  emissiveIntensity={0.15}
                  roughness={0.7}
                />
              </mesh>
            ))}

            {/* Bone spikes emerging from ground - twisted formations */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i / 5) * Math.PI * 2;
              const radius = 4;
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;

              return (
                <mesh
                  key={`bone-spike-${i}`}
                  position={[x, 1.5 - i * 0.3, z]}
                  rotation={[0, angle, angle * 0.5]}
                  scale={[0.5, 2.5 - i * 0.3, 0.5]}
                  castShadow
                >
                  <cylinderGeometry args={[0.5, 0.3, 1, 8]} />
                  <meshStandardMaterial
                    color="#F0F0F0"
                    emissive="#FF007F"
                    emissiveIntensity={0.2 + i * 0.05}
                    roughness={0.5}
                    metalness={0.15}
                  />
                </mesh>
              );
            })}

            {/* Crawling skeletal arms/limbs */}
            <mesh position={[-3, 0, -2]} rotation={[0.3, 0.5, 0.2]} scale={[0.3, 1.8, 0.3]} castShadow>
              <cylinderGeometry args={[0.4, 0.2, 1, 6]} />
              <meshStandardMaterial
                color="#E8E8E8"
                emissive="#FF007F"
                emissiveIntensity={0.18}
                roughness={0.6}
              />
            </mesh>

            <mesh position={[3, 0.2, -1]} rotation={[-0.2, -0.5, -0.3]} scale={[0.3, 1.5, 0.3]} castShadow>
              <cylinderGeometry args={[0.4, 0.2, 1, 6]} />
              <meshStandardMaterial
                color="#E8E8E8"
                emissive="#FF007F"
                emissiveIntensity={0.18}
                roughness={0.6}
              />
            </mesh>

            {/* Scattered bone fragments */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const radius = 8 + Math.random() * 4;
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;
              const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];

              return (
                <mesh
                  key={`fragment-${i}`}
                  position={[x, Math.random() * 0.5 - 0.2, z]}
                  rotation={rotation as [number, number, number]}
                  scale={[0.3 + Math.random() * 0.3, 0.15, 0.2]}
                  castShadow
                >
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial
                    color="#E8E8E8"
                    roughness={0.8}
                    emissive="#FF007F"
                    emissiveIntensity={0.12}
                  />
                </mesh>
              );
            })}
          </>
        }
        medium={
          <>
            <mesh position={[0, 3, 0]}>
              <sphereGeometry args={[2, 10, 10]} />
              <meshStandardMaterial color="#F0F0F0" emissive="#FF007F" emissiveIntensity={0.2} />
            </mesh>
            {[0, 2, 4].map((i) => {
              const angle = (i / 5) * Math.PI * 2;
              const radius = 4;
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;
              return (
                <mesh key={`bone-spike-med-${i}`} position={[x, 1.5 - i * 0.3, z]} rotation={[0, angle, 0]} scale={[0.5, 2, 0.5]}>
                  <cylinderGeometry args={[0.5, 0.3, 1, 5]} />
                  <meshStandardMaterial color="#F0F0F0" />
                </mesh>
              );
            })}
          </>
        }
        low={
          <mesh position={[0, 3, 0]}>
            <sphereGeometry args={[2, 6, 6]} />
            <meshBasicMaterial color="#F0F0F0" />
          </mesh>
        }
      />

      {/* Ground - cracked earth (always rendered as simple plane) */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 30]} />
        <meshStandardMaterial
          color="#0A0E27"
          roughness={0.95}
          emissive="#2E004F"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Rim light accent - optimized out at medium/low usually, but kept simple here */}
      <mesh position={[0, 2, 3]} scale={[15, 1, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#00FFFF"
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}
