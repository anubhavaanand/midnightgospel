import * as THREE from 'three';

/**
 * Defines spline control points for the 6-level journey.
 * Denser spacing = slower camera; sparse spacing = faster movement.
 */
export const SPLINE_POINTS = [
  // Level 0: Chromatic Void (0-15%)
  new THREE.Vector3(0, 5, 8),
  new THREE.Vector3(2, 3, 6),
  new THREE.Vector3(4, 1, 4),

  // Level 1: Zombie Apocalypse (15-35%)
  new THREE.Vector3(5, -2, 1),
  new THREE.Vector3(4, -5, -2),
  new THREE.Vector3(2, -8, -5),
  new THREE.Vector3(0, -10, -8),

  // Level 2: Clown Planet (35-55%)
  new THREE.Vector3(-3, -12, -10),
  new THREE.Vector3(-6, -14, -12),
  new THREE.Vector3(-8, -16, -13),

  // Level 3: Ass Cream (55-75%)
  new THREE.Vector3(-8, -18, -12),
  new THREE.Vector3(-6, -20, -10),
  new THREE.Vector3(-2, -22, -8),
  new THREE.Vector3(2, -24, -6),

  // Level 4: Soul Prison Moon (75-90%)
  new THREE.Vector3(5, -26, -4),
  new THREE.Vector3(7, -28, -2),
  new THREE.Vector3(8, -30, 0),

  // Level 5: The Exit (90-100%)
  new THREE.Vector3(8, -32, 2),
  new THREE.Vector3(7, -34, 4),
  new THREE.Vector3(5, -35, 5),
];

export const CAMERA_CONFIG = {
  dampingFactor: 0.25,
  lookAheadDistance: 0.1,
  pages: 8, // ScrollControls pages
};

export const LEVEL_RANGES = [
  { level: 0, name: 'Chromatic Void', scrollStart: 0, scrollEnd: 0.15 },
  { level: 1, name: 'Zombie Apocalypse', scrollStart: 0.15, scrollEnd: 0.35 },
  { level: 2, name: 'Clown Planet', scrollStart: 0.35, scrollEnd: 0.55 },
  { level: 3, name: 'Ass Cream', scrollStart: 0.55, scrollEnd: 0.75 },
  { level: 4, name: 'Soul Prison Moon', scrollStart: 0.75, scrollEnd: 0.9 },
  { level: 5, name: 'The Exit', scrollStart: 0.9, scrollEnd: 1.0 },
];
