import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll } from '@react-three/drei';
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useScrollProgress } from '@hooks/useScrollProgress';
import { useSceneStore } from '@store/sceneStore';
import CameraRig from '@components/CameraRig';
import LODWrapper from '@components/optimization/LODWrapper';

const ChromaticVoid = lazy(() => import('@components/levels/ChromaticVoid/Level0'));
const ZombieApocalypse = lazy(() => import('@components/levels/ZombieApocalypse'));
const ClownPlanet = lazy(() => import('@components/levels/ClownPlanet'));
const AssCream = lazy(() => import('@components/levels/AssCream'));
const BlindedByEnd = lazy(() => import('@components/levels/BlindedByEnd'));
const SoulPrison = lazy(() => import('@components/levels/SoulPrison'));
const TheExit = lazy(() => import('@components/levels/TheExit'));

const CURVE_POINTS = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, -8, -30),
  new THREE.Vector3(10, -20, -60),
  new THREE.Vector3(-10, -35, -90),
  new THREE.Vector3(5, -50, -120),
  new THREE.Vector3(-5, -65, -150),
  new THREE.Vector3(8, -80, -180),
  new THREE.Vector3(0, -95, -210),
  new THREE.Vector3(0, -105, -240),
] as const;

const LEVELS = [
  { id: 'chromatic-void', pointIndex: 1, Component: ChromaticVoid },
  { id: 'clown-planet', pointIndex: 2, Component: ClownPlanet },
  { id: 'zombie-apocalypse', pointIndex: 3, Component: ZombieApocalypse },
  { id: 'soul-prison', pointIndex: 4, Component: SoulPrison },
  { id: 'blinded-by-end', pointIndex: 5, Component: BlindedByEnd },
  { id: 'ass-cream', pointIndex: 6, Component: AssCream },
  { id: 'the-exit', pointIndex: 7, Component: TheExit },
] as const;

const SCROLL_HEIGHT_VH = 700;
const LEVEL_FADE_RANGE = 0.15;
const LEVEL_RENDER_DISTANCE = 40;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

interface OpacityGroupProps {
  readonly opacity: number;
  readonly children: React.ReactNode;
}

function OpacityGroup({ opacity, children }: OpacityGroupProps) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    group.traverse((obj) => {
      const maybeMaterial = (obj as THREE.Mesh).material;
      if (!maybeMaterial) return;

      const materials = Array.isArray(maybeMaterial) ? maybeMaterial : [maybeMaterial];

      materials.forEach((material) => {
        if (!material) return;
        material.transparent = opacity < 0.999;
        material.opacity = opacity;
        material.depthWrite = opacity >= 0.999;
        material.needsUpdate = true;
      });
    });
  }, [opacity]);

  return <group ref={groupRef}>{children}</group>;
}

interface ScrollSyncSceneProps {
  readonly externalProgress: number;
}

function ScrollSyncScene({ externalProgress }: ScrollSyncSceneProps) {
  const scroll = useScroll();
  const internalProgress = useScrollProgress();
  const setStoreProgress = useSceneStore((state) => state.setScrollProgress);

  useFrame(() => {
    const maxScroll = scroll.el.scrollHeight - scroll.el.clientHeight;
    if (maxScroll <= 0) return;

    scroll.el.scrollTop = clamp01(externalProgress) * maxScroll;
  });

  useEffect(() => {
    setStoreProgress(internalProgress);
  }, [internalProgress, setStoreProgress]);

  return <SimulatorScene scrollProgress={internalProgress} />;
}

interface SimulatorSceneProps {
  readonly scrollProgress: number;
}

function SimulatorScene({ scrollProgress }: SimulatorSceneProps) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(CURVE_POINTS.slice()), []);
  const clancyRef = useRef<THREE.Mesh>(null);

  const clampedProgress = clamp01(scrollProgress);
  const cameraPosition = useMemo(() => curve.getPointAt(clampedProgress), [curve, clampedProgress]);

  useFrame(({ camera, clock }) => {
    const progress = clamp01(scrollProgress);
    const point = curve.getPointAt(progress);
    const tangent = curve.getTangentAt(progress).normalize();

    camera.position.copy(point);
    camera.lookAt(point.clone().add(tangent.multiplyScalar(6)));

    if (clancyRef.current) {
      const clancyProgress = Math.min(progress + 3 / curve.getLength(), 1);
      const clancyPos = curve.getPointAt(clancyProgress);
      clancyRef.current.position.copy(clancyPos);
      clancyRef.current.position.y += Math.sin(clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <>
      <color attach="background" args={[0x000000]} />
      <ambientLight intensity={0.25} color="#77aaff" />
      <pointLight position={[0, 10, 0]} intensity={0.8} color="#66ffff" distance={80} />

      <CameraRig />

      {LEVELS.map(({ id, pointIndex, Component }) => {
        const position = CURVE_POINTS[pointIndex];
        const levelProgress = pointIndex / (CURVE_POINTS.length - 1);
        const progressDistance = Math.abs(clampedProgress - levelProgress);
        const opacity = clamp01(1 - progressDistance / LEVEL_FADE_RANGE);
        const cameraDistance = cameraPosition.distanceTo(position);
        const shouldRender = cameraDistance <= LEVEL_RENDER_DISTANCE;

        if (!shouldRender) {
          return null;
        }

        return (
          <group key={id} position={position.toArray()}>
            <Suspense fallback={null}>
              <OpacityGroup opacity={opacity}>
                <LODWrapper
                  thresholds={{ high: 20, medium: 40 }}
                  high={<Component isActive={true} />}
                />
              </OpacityGroup>
            </Suspense>
          </group>
        );
      })}

      <mesh ref={clancyRef}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial color="#66ffff" emissive="#00ffff" emissiveIntensity={2.5} />
      </mesh>
    </>
  );
}

const SimulatorPage: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollElement = document.documentElement;
      const maxScroll = scrollElement.scrollHeight - globalThis.innerHeight;
      const progress = maxScroll > 0 ? globalThis.scrollY / maxScroll : 0;
      setScrollProgress(clamp01(progress));
    };

    updateProgress();

    globalThis.addEventListener('scroll', updateProgress, { passive: true });
    globalThis.addEventListener('resize', updateProgress);

    return () => {
      globalThis.removeEventListener('scroll', updateProgress);
      globalThis.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className="relative bg-black">
      <div className="relative z-0" style={{ height: `${SCROLL_HEIGHT_VH}vh` }} aria-hidden="true" />

      <div className="fixed inset-0 z-10">
        <Canvas
          camera={{ position: [0, 0, 0], fov: 55 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <ScrollControls pages={7} damping={0} enabled={false}>
            <ScrollSyncScene externalProgress={scrollProgress} />
          </ScrollControls>
        </Canvas>
      </div>
    </div>
  );
};

export default SimulatorPage;
