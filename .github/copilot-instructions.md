# Midnight Gospel 3D: AI Coding Agent Guide

## Project Overview
**Midnight Gospel 3D** is a browser-based immersive 3D experience adapting the Netflix animated series into an interactive "Multiverse Simulator." The architecture integrates React Three Fiber (R3F), Three.js WebGL, Google Gemini 3 for generative assets, and physics-driven interactivity.

## Architecture Pillars

### 1. React Three Fiber (R3F) Scene Graph
- **Core Pattern**: Declarative React components controlling 3D state and WebGL rendering
- **State Binding**: Scroll position, UI selection, and camera paths bind directly to 3D properties via React hooks
- **Key Structure**: `<Canvas>` wraps all 3D elements; `<Suspense>` handles asset loading (GLB models, environments)
- **Drei Integration**: Use `ScrollControls` (dampening: 0.2-0.3), `useGLTF`, `Environment` (HDRI), `PerformanceMonitor` for adaptive rendering

### 2. Navigation: Spline-Based Camera System
- **Core Mechanic**: User scroll input drives camera along a **Catmull-Rom spline** path (THREE.CatmullRomCurve3)
- **Path Design**: Downward spiral through 6 levels; points define pacing (dense spacing = slow, sparse = fast)
- **Look-Ahead Rig**: Every frame calculates camera position at `t` and looks toward `t + 0.1` to simulate natural banking through curves
- **Theatre.js Integration**: For narrative moments requiring fixed framing (character dialogue, artifact reveal)
- **Code Pattern**:
  ```javascript
  // useCameraOnPath hook example
  useFrame(({ camera }) => {
    const point = curve.getPointAt(scrollProgress);
    const ahead = curve.getPointAt(Math.min(scrollProgress + 0.1, 1));
    camera.position.copy(point);
    camera.lookAt(ahead);
  });
  ```

### 3. Visual Language: Psychedelic Chromatic Aesthetic
- **Shaders**: Generated via **Gemini 3 Shader Pilot** (GLSL code from natural language prompts)
- **Toon Shading**: `MeshToonMaterial` or Sobel-filter post-processing for "2D in 3D" linework
- **Post-Processing Pipeline** (@react-three/postprocessing):
  - **Bloom** (UnrealBloomPass): Neon glow around bright objects
  - **Chromatic Aberration**: RGB channel separation for trippy lens effect
  - **Noise/Grain**: Film grain overlay for analog tactile feel
  - **Glitch Pass**: Triggered on transitions; distorts geometry/colors
- **Color Palette**: Deep purples (#2E004F), hot pinks (#FF007F), electric cyans, pastel backdrops
- **SSS Materials**: Bio-organic tech uses subsurface scattering for flesh transparency

### 4. Asset Management & Optimization
- **Format**: GLTF/GLB with **Draco compression** (reduces file size ~90%)
- **Textures**: KTX2 format for GPU-direct upload (no decompression overhead)
- **Instancing**: `<InstancedMesh>` for crowds (zombies, space cats, clowns)—GPU renders thousands in single draw call
- **Tiered Rendering**: `PerformanceMonitor` downgrades quality on low FPS (disable Bloom, reduce particles, lower dpr)

### 5. Generative AI Pipeline: Gemini 3 Integration
- **Shader Pilot**: Prompt natural language → GLSL code
  - Example: "flowing neon ribbon with Perlin noise domain warping, purple/pink/cyan palette"
- **Voxel Toy Box**: Generate procedural 3D assets with physics pre-baked
  - Glitch Artifacts: Abstract blocky structures for ego-death/reality-break themes
  - Character variations: Space Cats, zombies with stylesheet consistency
- **JSON Prompting**: Enforce art style consistency across all generated assets
  ```json
  {
    "task": "generate_3d_asset",
    "style_guidelines": {
      "art_style": "surrealist_cartoon",
      "line_weight": "thick_outline",
      "color_palette": ["#2E004F", "#FF007F", "#00FFFF", "#F0F0F0"]
    },
    "object_parameters": {
      "type": "prop",
      "name": "SpaceCat",
      "geometry": "low_poly",
      "texture_resolution": "1024x1024"
    },
    "output_format": "glb"
  }
  ```

### 6. Physics & Interactivity: Rapier Integration
- **Cursor Collider**: Mouse position projects raycaster into scene; applies impulse forces to voxel objects
- **Voxel Destruction**: Instanced voxels are rigid bodies; breaking simulates "reality fragmentation"
- **Local Gravity Fields**: Planet-specific attractors (e.g., low gravity on Soul Prison moon, strong on Ass Cream)
- **Emergent Behavior**: Natural collisions and bouncing create non-scripted moments

### 7. Spatial Audio Architecture
- **Three.js PositionalAudio**: Sound sources attached to 3D objects (Deer Dog, machinery)
- **Doppler Effect**: Volume attenuation and panning as camera moves away/past objects
- **Soundscapes**: Lo-Fi Sci-Fi ambience (tape hiss, vinyl crackle, analog synth drones)
- **Generative Audio**: Gemini 3 creates procedural "spacecast intros" and glitch noises

### 8. UI/UX: Glassmorphism & HUD
- **Glassmorphism CSS**: Tailwind classes (`backdrop-blur-xl`, `bg-white/10`, `border-white/20`) create frosted glass panels over 3D world
- **UI Layer**: Z-index 10; translucent to show 3D world underneath
- **Glitch Animations**: CSS `clip-path` distortion on hover/interaction reinforces simulator instability
- **Typography**: Drei `<Text>` component renders 3D philosophical quotes; occluded by planets, casts shadows
- **Responsive**: Desktop (scroll-based), Mobile (swipe-based with simplified physics)

## Level Structure (6 Segments of Scrollable Journey)

| Level | Scroll | Episode Theme | Key Assets | Mechanic |
|-------|--------|---------------|-----------|----------|
| Chromatic Void | 0-15% | Intro/Simulator Hub | Floating tapes, pods | "Insert Head" prompt |
| Zombie Apocalypse | 15-35% | Taste of the King | White House, zombie crowd | Crowd flying, click splats |
| Clown Planet | 35-55% | Officers & Wolves | Deer Dog, meat factory | Grinder vertex displacement |
| Ass Cream | 55-75% | Hunters Without Home | Fish bowl, space cats, ship | Water shader, non-Euclidean geometry |
| Soul Prison Moon | 75-90% | Annihilation of Joy | Soul Bird, prisoners, Bosch landscape | High-contrast rim-lighting |
| The Exit | 90-100% | Climax | Horn artifact | Third Eye particle explosion → reset |

## Development Workflow & Build Tools

### Key Commands (Expected in package.json)
- **Build**: Compile React/TypeScript, bundle shaders, optimize assets
- **Dev Server**: Hot reload R3F canvas on code changes; preserve scroll state across reloads
- **Asset Generation**: Automated Gemini 3 prompting pipeline for shader/voxel output
- **Performance Testing**: Lighthouse WebGL profiling; ensure 60 FPS on target devices

### Critical Paths
1. **Shader Integration**: Store Gemini-generated GLSL in `shaders/` directory; import via THREE.ShaderMaterial or custom hooks
2. **Asset Versioning**: Draco-compressed GLBs in `assets/models/`; update references in `useGLTF` calls
3. **State Management**: React Context or Zustand for scroll progress, active level, camera mode (spline vs. Theatre.js)
4. **Post-Processing**: Chain effects in order (Bloom → Aberration → Noise → Glitch) to avoid z-fighting or visual artifacts

## Code Patterns & Conventions

### Custom Hook Pattern
```javascript
// hooks/useCameraPath.ts
export const useCameraPath = (curvePoints, dampingFactor) => {
  const curveRef = useRef(new THREE.CatmullRomCurve3(curvePoints));
  const scrollProgress = useScroll().offset; // from ScrollControls
  useFrame(({ camera }) => {
    // Smooth interpolation with dampening
    // lookAt ahead point for natural banking
  });
};
```

### Asset Loading Pattern
```javascript
// Compress with Draco, use Suspense boundaries
const Model = ({ path }) => {
  const { scene } = useGLTF(path, true); // true = draco compression
  return <primitive object={scene} />;
};
```

### Post-Processing Stack
```javascript
<EffectComposer>
  <Bloom intensity={2} kernelSize={3} luminanceThreshold={0.9} />
  <ChromaticAberration offset={[0.001, 0.001]} />
  <Film grayscale={0} noiseFactor={0.2} />
  <Glitch active={isTransitioning} />
</EffectComposer>
```

## Testing & Performance Optimization
- **Frame Rate Target**: Maintain 60 FPS; use PerformanceMonitor to auto-degrade visuals
- **Memory Profiling**: WebGL texture VRAM should not exceed 256MB on mobile
- **Load Time**: Target <3s initial load with progressive asset streaming
- **Audio Sync**: Ensure spatial audio panning is frame-locked to camera position

## AI Agent Productivity Notes
- **Priority**: Understand the spline-based camera system first—it's the backbone of navigation
- **Gemini Integration**: When adding new levels, prompt Gemini for shaders/voxels; use JSON prompting to maintain style consistency
- **Physics Testing**: Test voxel destruction on representative hardware before shipping
- **Narrative Sync**: Quotes and audio should fade in/out aligned with spline progress, not arbitrary scroll positions
- **Mobile Fallback**: Always test post-processing effects on lower-end devices; have graceful degradation ready
