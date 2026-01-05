/**
 * Hook for Rapier physics engine integration.
 * Manages rigidbodies, colliders, and gravity fields.
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

interface PhysicsConfig {
  gravity: [number, number, number];
  defaultMaterial: {
    friction: number;
    restitution: number;
  };
}

const DEFAULT_CONFIG: PhysicsConfig = {
  gravity: [0, -9.81, 0],
  defaultMaterial: {
    friction: 0.5,
    restitution: 0.6,
  },
};

/**
 * Hook to manage local gravity fields on planets.
 * Allows per-planet gravity overrides.
 */
export const useLocalGravity = (gravityVector: [number, number, number] = DEFAULT_CONFIG.gravity) => {
  const gravityRef = useRef(gravityVector);

  return gravityRef.current;
};

/**
 * Hook to simulate attractor-based gravity (e.g., planet pulls nearby objects).
 */
export const useGravityAttractor = (position: [number, number, number], strength: number = 1) => {
  const attractorRef = useRef({ position, strength });

  useFrame(() => {
    // In a full Rapier integration, this would apply forces to nearby rigidbodies
    // For now, this is a placeholder for the pattern
  });

  return attractorRef.current;
};
