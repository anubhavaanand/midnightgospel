# Development Quick Start

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env.local
   # Add your VITE_GOOGLE_API_KEY from Google AI Studio
   ```

3. **Run dev server**:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/
│   ├── Scene.tsx              # ScrollControls wrapper
│   ├── CameraRig.tsx          # Theatre.js camera (narrative moments)
│   ├── GeneratedShaderMesh.tsx# Gemini-powered shaders
│   ├── levels/
│   │   ├── ChromaticVoid/     # Level 0: Intro
│   │   ├── ZombieApocalypse/  # Level 1: Episode 1
│   │   ├── ClownPlanet/       # Level 2: Episode 2
│   │   ├── AssCream/          # Level 3: Episode 3
│   │   ├── SoulPrison/        # Level 4: Episode 5
│   │   ├── TheExit/           # Level 5: Climax
│   │   └── LevelContainer.tsx # Active level router
│   ├── physics/
│   │   ├── Voxel.tsx          # Individual destructible cube
│   │   └── VoxelCluster.tsx   # Grid of voxels
│   ├── effects/
│   │   └── PostProcessingEffects.tsx # Bloom, aberration, glitch
│   └── ui/
│       ├── HUD.tsx            # Main overlay
│       ├── NavigationPanel.tsx# Level selector
│       ├── DebugPanel.tsx     # Stats & metrics
│       ├── FloatingQuote.tsx  # 3D text quotes
│       └── Loading.tsx        # Splash screen
├── hooks/
│   ├── useCameraPath.ts       # Spline camera controller
│   ├── useScrollProgress.ts   # Scroll → Zustand sync
│   ├── useGeneratedShader.ts  # Gemini shader hook
│   ├── useMousePhysics.ts     # Raycasting & impulses
│   └── usePhysics.ts          # Gravity & attractors
├── shaders/
│   ├── ChromaticVoidMaterial.ts # Procedural void
│   └── (other generated shaders)
├── store/
│   └── sceneStore.ts          # Zustand state
├── utils/
│   ├── constants.ts           # Spline points, config
│   └── gemini.ts              # AI integration
├── styles/
│   └── global.css             # Tailwind + custom
└── pages/
    └── App.tsx                # Root canvas setup
```

## Key Development Tasks

### Add a New Level

1. Create `src/components/levels/[LevelName]/index.tsx`
2. Implement level components (background, props, lighting)
3. Add entry to `LEVEL_RANGES` in `constants.ts`
4. Import and conditionally render in `LevelContainer.tsx`

### Generate a Shader with Gemini

```typescript
import { generateShader, buildShaderPrompt } from '@utils/gemini';

const shaderCode = await generateShader({
  task: 'generate_shader',
  style_guidelines: {
    art_style: 'psychedelic_surreal',
    color_palette: ['#2E004F', '#FF007F', '#00FFFF'],
    effect_description: 'Perlin noise with iridescent color shift',
  },
  shader_type: 'fragment',
});
```

### Create Destructible Voxels

```typescript
import VoxelCluster from '@components/physics/VoxelCluster';

<VoxelCluster
  position={[0, 0, -10]}
  size={[5, 5, 5]}
  colorPalette={['#FF007F', '#00FFFF', '#2E004F']}
  isPhysical={true}
/>
```

### Add 3D Text to Scene

```typescript
import FloatingQuote from '@components/ui/FloatingQuote';

<FloatingQuote
  text="You can't die in a sim prison. You can only be reborn."
  position={[0, 5, 0]}
  color="#FF007F"
  scale={1.5}
/>
```

## Performance Optimization

1. **PerformanceMonitor**: Auto-degrades Bloom, particles on low FPS
2. **Asset Compression**: Use Draco for GLB, KTX2 for textures
3. **Instancing**: Use `<InstancedMesh>` for crowds
4. **Code Splitting**: Vite handles chunks for three, r3f, rapier

## Debugging

- **HUD Panel**: Shows current level, scroll %, camera mode, FPS
- **Debug Panel**: Real-time metrics (VRAM, FPS, state)
- **Three.js DevTools**: Inspect scene graph, materials

## Deployment

```bash
npm run build
# Deploy `dist/` to any static host
```

## Resources

- [Copilot Instructions](.github/copilot-instructions.md)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Three.js Docs](https://threejs.org/)
- [Gemini API](https://ai.google.dev/)
