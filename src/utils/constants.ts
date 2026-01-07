import * as THREE from 'three';

/**
 * Defines spline control points for the 7-level journey.
 * Denser spacing = slower camera; sparse spacing = faster movement.
 */
export const SPLINE_POINTS = [
  // Level 0: Chromatic Void (0-12%)
  new THREE.Vector3(0, 5, 8),
  new THREE.Vector3(2, 3, 6),
  new THREE.Vector3(4, 1, 4),

  // Level 1: Zombie Apocalypse (12-28%)
  new THREE.Vector3(5, -2, 1),
  new THREE.Vector3(4, -5, -2),
  new THREE.Vector3(2, -8, -5),
  new THREE.Vector3(0, -10, -8),

  // Level 2: Clown Planet (28-44%)
  new THREE.Vector3(-3, -12, -10),
  new THREE.Vector3(-6, -14, -12),
  new THREE.Vector3(-8, -16, -13),

  // Level 3: Ass Cream (44-60%)
  new THREE.Vector3(-8, -18, -12),
  new THREE.Vector3(-6, -20, -10),
  new THREE.Vector3(-4, -22, -8),

  // Level 4: Blinded by My End (60-76%)
  new THREE.Vector3(-2, -24, -6),
  new THREE.Vector3(0, -26, -5),
  new THREE.Vector3(3, -28, -4),

  // Level 5: Soul Prison Moon (76-90%)
  new THREE.Vector3(5, -30, -3),
  new THREE.Vector3(7, -32, -2),
  new THREE.Vector3(8, -34, 0),

  // Level 6: The Exit (90-100%)
  new THREE.Vector3(8, -36, 2),
  new THREE.Vector3(7, -38, 4),
  new THREE.Vector3(5, -40, 5),
];

export const CAMERA_CONFIG = {
  dampingFactor: 0.25,
  lookAheadDistance: 0.1,
  pages: 10, // Increased pages for smoother scroll over more content
};

export const LEVEL_RANGES = [
  { level: 0, name: 'Chromatic Void', scrollStart: 0, scrollEnd: 0.12 },
  { level: 1, name: 'Zombie Apocalypse', scrollStart: 0.12, scrollEnd: 0.28 },
  { level: 2, name: 'Clown Planet', scrollStart: 0.28, scrollEnd: 0.44 },
  { level: 3, name: 'Ass Cream', scrollStart: 0.44, scrollEnd: 0.60 },
  { level: 4, name: 'Blinded by My End', scrollStart: 0.60, scrollEnd: 0.76 },
  { level: 5, name: 'Soul Prison Moon', scrollStart: 0.76, scrollEnd: 0.90 },
  { level: 6, name: 'The Exit', scrollStart: 0.90, scrollEnd: 1.0 },
];
