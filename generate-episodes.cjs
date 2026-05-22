const fs = require('fs');
const path = require('path');

const episodes = [
  { id: 2, name: 'BabyClown', color: '#FFB6C1', bg: '#FFFACD', geom: 'planeGeometry' },
  { id: 3, name: 'CreamOcean', color: '#FFFDD0', bg: '#4682B4', geom: 'planeGeometry' },
  { id: 4, name: 'VengeanceKingdom', color: '#8B4513', bg: '#FF4500', geom: 'icosahedronGeometry' },
  { id: 5, name: 'SoulPrison', color: '#8A2BE2', bg: '#00CED1', geom: 'cylinderGeometry' },
  { id: 6, name: 'MeditationCave', color: '#20B2AA', bg: '#F0E68C', geom: 'sphereGeometry' },
  { id: 7, name: 'PlanetBlankBall', color: '#2F6C8F', bg: '#F58DFF', geom: 'sphereGeometry' },
  { id: 8, name: 'Trainworld', color: '#FFD700', bg: '#DC143C', geom: 'tubeGeometry' }
];

episodes.forEach(ep => {
  const dir = path.join(__dirname, 'src', 'levels', `Episode${ep.id}`);
  fs.mkdirSync(dir, { recursive: true });

  const shaderCode = `import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { baseUniforms, commonShaderChunks } from '../../shaders/base.glsl';

export const ${ep.name}ShaderMaterial = shaderMaterial(
  {
    ...baseUniforms,
    uTime: 0,
    uIntensity: 0.5,
    uColorPrimary: new THREE.Color('${ep.color}'),
    uColorBloom: new THREE.Color('${ep.color}'),
    uSpeed: 1.0,
  },
  \`\${commonShaderChunks}
    varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
    void main() { vUv = uv; vNormal = normal; vPosition = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  \`,
  \`\${commonShaderChunks}
    varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
    void main() { gl_FragColor = vec4(mix(uColorPrimary, uColorBloom, sin(uTime * uSpeed) * 0.5 + 0.5), 1.0); }
  \`
);

extend({ ${ep.name}ShaderMaterial });
`;
  fs.writeFileSync(path.join(dir, `${ep.name}Shader.ts`), shaderCode);

  const sceneCode = `import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { ${ep.name}ShaderMaterial } from './${ep.name}Shader';
import { useLevelStore } from '../../store/useLevelStore';
import { useDialogueStore } from '../../store/useDialogueStore';

const ${ep.name}: React.FC = () => {
  const materialRef = useRef<any>(null);
  const setLevel = useLevelStore((state) => state.setLevel);
  const setTransitioning = useLevelStore((state) => state.setTransitioning);
  const isTransitioning = useLevelStore((state) => state.isTransitioning);
  const openDialogue = useDialogueStore((state) => state.openDialogue);

  useFrame((state) => {
    if (materialRef.current) materialRef.current.uTime = state.clock.elapsedTime;
  });

  const handleBackToHub = (e: any) => {
    e.stopPropagation();
    if (isTransitioning) return;
    setTransitioning(true);
    setTimeout(() => { setLevel(0); setTransitioning(false); }, 500);
  };

  return (
    <group>
      <OrbitControls makeDefault maxDistance={20} minDistance={5} />
      <Environment preset="night" />
      
      <mesh position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); openDialogue(${ep.id}); }} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="${ep.color}" wireframe />
      </mesh>

      <mesh>
        <${ep.geom} args={[15, 64, 64]} />
        {/* @ts-ignore */}
        <${ep.name[0].toLowerCase() + ep.name.slice(1)}ShaderMaterial ref={materialRef} side={THREE.BackSide} />
      </mesh>

      <group position={[0, -4, 5]}>
        <mesh onClick={handleBackToHub} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
          <boxGeometry args={[4, 1, 1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <Text position={[0, 0, 0.6]} fontSize={0.4} color="white" anchorX="center" anchorY="middle">Return to Hub</Text>
      </group>
    </group>
  );
};
export default ${ep.name};
`;
  fs.writeFileSync(path.join(dir, `${ep.name}.tsx`), sceneCode);
});
console.log("Scaffolding complete.");
