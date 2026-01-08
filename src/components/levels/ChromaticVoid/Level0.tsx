/**
 * Level 0: Chromatic Void - Redesigned
 * 
 * Features:
 * - Pitch black space background
 * - Dense twinkling starfield
 * - 3D Sun with corona and glow
 * - Minimal floating elements
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SimulatorPod from './SimulatorPod';
import FloatingTape from './FloatingTape';
import Sun from './Sun';
import Starfield from './Starfield';

interface ChromaticVoidProps {
  isActive: boolean;
  scrollProgress?: number;
}

export default function ChromaticVoid({ isActive, scrollProgress = 0 }: ChromaticVoidProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Parallax effect: The cosmos moves as we scroll
  useFrame((state) => {
    if (groupRef.current) {
      // Rotate the whole system slowly
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;

      // Parallax scroll: Move the cosmos backwards and slightly up as user scrolls
      // This creates a feeling of flying "into" the void
      // The scrollProgress for Level 0 goes from 0 to 0.12 (approx)
      // We amplify this small range to create noticeable movement
      const scrollOffset = scrollProgress * 100;

      // Move stars against the camera to simulate forward motion
      groupRef.current.position.z = scrollOffset * 0.5;

      // Subtle vertical parallax
      groupRef.current.position.y = scrollOffset * 0.1;
    }
  });

  if (!isActive) return null;

  return (
    <group ref={groupRef}>
      {/* Dense starfield - pitch black with twinkling stars */}
      <Starfield count={3000} radius={120} />

      {/* 3D Sun - medium size, positioned to the right */}
      <group position={[20, 5, -40]}>
        <Sun position={[0, 0, 0]} size={5} />
      </group>

      {/* Stronger ambient light so objects are actually visible */}
      <ambientLight intensity={0.3} color="#ffffff" />

      {/* Additional directional light for depth */}
      <directionalLight position={[10, 10, 5]} intensity={0.5} color="#00ffff" />
      <pointLight position={[0, 0, 10]} intensity={1.0} color="#ff007f" distance={50} />

      {/* Simulator Pod - made larger and more visible */}
      <group scale={1.5}>
        <SimulatorPod />
      </group>

      {/* Floating Tapes - larger and more visible */}
      <FloatingTape position={[-8, 3, -15]} rotation={[0.3, 0.5, 0.1]} scale={1.2} />
      <FloatingTape position={[6, -2, -18]} rotation={[-0.2, -0.3, 0.2]} scale={1.0} />
      <FloatingTape position={[0, 5, -12]} rotation={[0.1, -0.4, 0.3]} scale={0.9} />
    </group>
  );
}

