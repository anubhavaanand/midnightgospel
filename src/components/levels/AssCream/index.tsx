import FishBowl from './FishBowl';
import SpaceCatCrowd from './SpaceCatCrowd';
import * as THREE from 'three';

/**
 * Level 3: Ass Cream (Hunters Without Home)
 * Scroll Progress: 55-75%
 */

interface AssCreamProps {
  isActive: boolean;
  scrollProgress?: number;
}

export default function AssCream({ isActive }: AssCreamProps) {
  if (!isActive) return null;

  return (
    <group>
      {/* Ambient lighting - underwater mood */}
      <ambientLight intensity={0.5} color="#00FFFF" />

      {/* Primary light - from above (filtered through water) */}
      <pointLight
        position={[0, 15, 5]}
        intensity={1.0}
        color="#00FFFF"
        castShadow
        distance={50}
      />

      {/* Secondary lights - side lighting for depth */}
      <pointLight
        position={[-15, 0, -5]}
        intensity={0.7}
        color="#FF007F"
        castShadow
        distance={35}
      />

      <pointLight
        position={[15, 0, -5]}
        intensity={0.7}
        color="#FF007F"
        castShadow
        distance={35}
      />

      {/* Main environment - fish bowl with water */}
      <FishBowl />

      {/* Inhabitants - peaceful space cats floating */}
      <SpaceCatCrowd />

      {/* Background - void/space outside bowl */}
      <mesh position={[0, 0, -25]} scale={[50, 50, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#0A0E27"
          emissive="#2E004F"
          emissiveIntensity={0.15}
          roughness={1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
