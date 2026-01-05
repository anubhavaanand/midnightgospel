import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface RaycasterState {
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  intersectedObject: THREE.Object3D | null;
}

/**
 * Hook to handle mouse raycasting for physics interactions.
 * Used to target voxel objects and apply impulse forces.
 */
export const useMouseRaycaster = () => {
  const { camera, scene } = useThree();
  const stateRef = useRef<RaycasterState>({
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    intersectedObject: null,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { raycaster, mouse } = stateRef.current;

      // Normalize mouse position to [-1, 1]
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update raycaster
      raycaster.setFromCamera(mouse, camera);

      // Find intersected physics objects
      const physicsObjects = scene.children.filter((obj) => (obj as any).userData?.isPhysicsObject);
      const intersects = raycaster.intersectObjects(physicsObjects);

      stateRef.current.intersectedObject = intersects.length > 0 ? intersects[0].object : null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [camera, scene]);

  return stateRef.current;
};

/**
 * Hook to apply impulse forces based on mouse position.
 * Integrates with Rapier physics bodies.
 */
export const useMouseImpulse = () => {
  const raycasterState = useMouseRaycaster();

  const applyImpulse = (rigidbody: any, force: number = 10) => {
    if (!rigidbody || !raycasterState.raycaster) return;

    const { raycaster, mouse } = raycasterState;
    const camera = useThree().camera;

    // Calculate impulse direction from raycaster
    raycaster.setFromCamera(mouse, camera);
    const direction = raycaster.ray.direction.normalize();

    // Apply impulse to rigidbody
    if (rigidbody.applyImpulse) {
      rigidbody.applyImpulse({ x: direction.x * force, y: direction.y * force, z: direction.z * force });
    }
  };

  return { applyImpulse, intersectedObject: raycasterState.intersectedObject };
};
