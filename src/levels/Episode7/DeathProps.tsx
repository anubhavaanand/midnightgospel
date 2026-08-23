import React, { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { computeScale } from '../../lib/modelScales';

/** Death NPC — real Grim Reaper model (Poly Pizza), gentle idle hover */
const ReaperModel: React.FC = () => {
  const { scene } = useGLTF('/models/level7/grim_reaper.glb');
  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    clone.scale.setScalar(computeScale('/models/level7/grim_reaper.glb', 2.6, size.y));
    const box2 = new THREE.Box3().setFromObject(clone);
    const center = box2.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, -box2.min.y, -center.z);
    return clone;
  }, [scene]);
  return <primitive object={prepared} />;
};

export const DeathNPC: React.FC<{ position?: [number, number, number] }> = ({ position = [4.5, -1.9, 2] }) => {
  return (
    <group position={position}>
      <Suspense fallback={
        <mesh position={[0, 1.3, 0]}>
          <coneGeometry args={[0.8, 2.4, 10]} />
          <meshStandardMaterial color="#1a1a1a" wireframe />
        </mesh>
      }>
        <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.35}>
          <ReaperModel />
        </Float>
        {/* Soft violet aura — Death is gentle here */}
        <pointLight position={[0, 1.8, 0]} intensity={14} color="#B388FF" distance={9} />
        <Text
          position={[0, 3.1, 0]}
          fontSize={0.26}
          color="#E1BEE7"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          Death
        </Text>
      </Suspense>
    </group>
  );
};

/** Colossal titan turtle drifting under the blank ball (Poly Pizza) */
const TurtleModel: React.FC = () => {
  const { scene } = useGLTF('/models/level7/turtle.glb');
  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    clone.scale.setScalar(computeScale('/models/level7/turtle.glb', 12, size.y));
    const center = box.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, -center.y, -center.z);
    return clone;
  }, [scene]);
  return <primitive object={prepared} />;
};

export const TitanTurtle: React.FC<{ position?: [number, number, number] }> = ({ position = [-20, -4.5, -22] }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });
  return (
    <Suspense fallback={null}>
      <group ref={ref} position={position} rotation={[0, 1.1, 0]}>
        <TurtleModel />
      </group>
    </Suspense>
  );
};

useGLTF.preload('/models/level7/grim_reaper.glb');
useGLTF.preload('/models/level7/turtle.glb');
