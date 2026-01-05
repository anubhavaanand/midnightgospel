import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Environment, PerspectiveCamera } from '@react-three/drei';
import LandingBackground from './LandingBackground';
import { FloatingOrbs, PortalCore, ParticleTrail, SimulationCube } from './FloatingElements';
import { UniverseConfig } from './types';

interface SceneProps {
    config: UniverseConfig;
    analyzer: AnalyserNode | null;
}

const LandingScene: React.FC<SceneProps> = ({ config, analyzer }) => {
    return (
        <div className="fixed inset-0 z-0">
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                <color attach="background" args={['#010101']} />
                <fog attach="fog" args={['#010101', 5, 20]} />

                <ambientLight intensity={0.2} />
                <pointLight position={[5, 5, 5]} intensity={2} color={config.accentColor} />
                <spotLight position={[-5, 10, 5]} angle={0.3} penumbra={1} intensity={3} color={config.primaryColor} />

                <LandingBackground config={config} analyzer={analyzer} />

                <Stars radius={50} depth={50} count={3000} factor={4} saturation={1} fade speed={2} />

                <ParticleTrail config={config} analyzer={analyzer} />

                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <PortalCore config={config} analyzer={analyzer} />
                </Float>

                <Float speed={3} rotationIntensity={2} floatIntensity={2}>
                    <SimulationCube config={config} analyzer={analyzer} />
                </Float>

                <FloatingOrbs config={config} analyzer={analyzer} />

                <Environment preset="city" />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    rotateSpeed={0.4}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                />
            </Canvas>
        </div>
    );
};

export default LandingScene;
