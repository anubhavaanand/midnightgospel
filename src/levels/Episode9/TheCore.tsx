
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { FluidFloor } from './FluidFloor';
import { RaymarchedFractal } from './RaymarchedFractal';
import { PhysicsOrbs } from './PhysicsOrbs';

const TheCore = () => {
  return (
    <>
      <OrbitControls makeDefault maxDistance={30} minDistance={2} />
      <Environment preset="night" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={2} color="#00FFCC" />
      <pointLight position={[0, -10, 0]} intensity={2} color="#FF007F" />

      {/* Physics Sandbox Wrapper */}
      <Physics gravity={[0, 0, 0]}>
        
        {/* The Central Artifact (4D Raymarched SDF + Spatial Audio) */}
        <RaymarchedFractal />

        {/* Floating Physics Orbs */}
        <PhysicsOrbs count={30} />

        {/* The Liquid Consciousness Floor */}
        <FluidFloor />

      </Physics>
    </>
  );
};

export default TheCore;
