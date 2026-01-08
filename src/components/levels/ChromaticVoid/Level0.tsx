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

      {/* 3D Sun - medium size, positioned to the right
          We move the sun slightly less than the stars for depth perception (farther away) */}
      <group position={[20, 5, -40]}>
        <Sun position={[0, 0, 0]} size={5} />
      </group>

      {/* Very subtle ambient light - just enough to see objects */}
      <ambientLight intensity={0.05} color="#ffffff" />

      {/* Simulator Pod - the main interactive element 
          This remains relatively static or moves with camera rig logic separately 
          actually, we want this to be the anchor, so maybe we don't move it with the group parallax?
          No, if the whole group moves, the pod moves. 
          Usually in scrolling sites, the camera moves. 
          But here we want "infinite scroll" feel.
      */}
      <SimulatorPod />

      {/* Floating Tapes - reduced and darker */}
      <FloatingTape position={[-8, 3, -15]} rotation={[0.3, 0.5, 0.1]} scale={0.7} />
      <FloatingTape position={[6, -2, -18]} rotation={[-0.2, -0.3, 0.2]} scale={0.6} />
    </group>
  );
}

