---
description: Workflow for adding or modifying 3D levels
---

# Adding/Editing Levels Workflow

## Level Structure

Each level follows this pattern:
```
src/components/levels/[LevelName]/
├── index.tsx          # Main level component
├── [Subcomponent].tsx # Additional 3D elements
└── styles.ts          # Level-specific styles (optional)
```

## Level Component Template

```tsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function LevelName({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state) => {
    if (groupRef.current && isActive) {
      timeRef.current += state.delta;
      // Animation logic here
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Lighting */}
      <ambientLight color="#color" intensity={0.4} />
      <pointLight position={[0, 5, 0]} color="#color" intensity={0.8} />

      {/* 3D Elements */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#color" />
      </mesh>
    </group>
  );
}
```

## Registering a New Level

1. Create level component in `src/components/levels/[LevelName]/index.tsx`

2. Add lazy import in `LevelContainer.tsx`:
```tsx
const NewLevel = lazy(() => import('./NewLevel'));
```

3. Add to render section in `LevelContainer.tsx`:
```tsx
<NewLevel isActive={activeLevel === N} />
```

4. Update `LEVEL_RANGES` in `src/utils/constants.ts`:
```ts
{ level: N, scrollStart: 0.XX, scrollEnd: 0.YY }
```

## Level Design Principles

1. **Color Palette**: Use only #2E004F, #FF007F, #00FFFF, #F0F0F0
2. **Instancing**: Use `<instancedMesh>` for crowds (100+ entities)
3. **Lighting**: 3-4 lights per level (ambient + point lights)
4. **Animation**: Use `useFrame` for smooth animations
5. **isActive**: Only animate when `isActive` is true

## Common 3D Patterns

### Particles
```tsx
const particleGeometry = useMemo(() =>
  new THREE.BufferGeometry().setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  ), [positions]);

<points geometry={particleGeometry}>
  <pointsMaterial size={0.1} color="#color" />
</points>
```

### Instanced Mesh
```tsx
<instancedMesh args={[geometry, material, count]}>
  // Matrix4 transforms set via ref
</instancedMesh>
```

### Custom Shader
```tsx
<shaderMaterial
  uniforms={{ uTime: { value: 0 } }}
  vertexShader={vertexShader}
  fragmentShader={fragmentShader}
/>
```

## Testing Levels

1. Start dev server: `npm run dev`
2. Scroll to level position
3. Watch console for errors
4. Check performance (target 60 FPS desktop, 30 FPS mobile)
