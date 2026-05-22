# Midnight Gospel 3D Specification

## Project Overview
A scroll-driven 3D "Multiverse Simulator" based on *The Midnight Gospel*, featuring immersive levels, AI-generated visuals, and physics-based interactions.

## Functional Requirements

### 1. Multiverse Traversal (Scroll-Driven)
- Smooth navigation through 7 distinct 3D levels based on scroll progress.
- Adaptive camera path using splines or Theatre.js.
- Interactive transitions between levels with visual and audio feedback.

### 2. Generative Assets (Gemini AI)
- Runtime GLSL shader generation for environmental effects and meshes.
- Voxel asset generation for dynamic, destructible artifacts.
- Intelligent caching and fallback systems for offline/no-API-key scenarios.

### 3. Level Content
- **Level 0: Chromatic Void** - Abstract, color-shifting gateway.
- **Level 1: Zombie Apocalypse** - Physics-driven chaos and destruction.
- **Level 2: Clown Planet** - Surreal, interactive 3D environment.
- **Level 3: Ass Cream** - Volumetric, viscous fluid/physics world.
- **Level 4: Blinded by My End** - Cinematic, high-contrast atmosphere.
- **Level 5: Soul Prison** - Complex geometries and restrictive physics.
- **Level 6: The Exit** - Final transition and transcendence.

### 4. Game Mechanics & State
- Collectible items and easter eggs in each level.
- Achievement system and persistent progress tracking via Zustand.
- Floating quotes and philosophical narrative elements.

### 5. UI/UX
- HUD for tracking progress, collectibles, and stats.
- Mobile-responsive UI with touch-to-scroll support.
- Cinematic intro and smooth onboarding experience.

## Non-Functional Requirements

### 1. Performance
- 60 FPS target for desktop (Mid-to-High end GPUs).
- 30+ FPS for mobile with adaptive quality scaling.
- Lazy loading for 3D assets and levels to minimize initial bundle size.

### 2. Compatibility
- Full support for modern browsers (Chrome, Firefox, Safari).
- Responsive design for mobile and tablet devices.

### 3. Reliability
- Graceful error handling for AI API failures.
- Robust state persistence to handle page reloads.

## Technical Architecture (High-Level)
- **Engine:** React Three Fiber (R3F) for scene orchestration.
- **Physics:** Rapier for real-time collisions and destructible objects.
- **State:** Zustand for global game state and scene synchronization.
- **AI:** Gemini 2.0 Flash for low-latency asset generation.

## Milestones
1. **Phase 1: Core Engine & Navigation** (Completed)
2. **Phase 2: Level Implementation (0-2)** (In Progress)
3. **Phase 3: AI Integration & Shaders** (In Progress)
4. **Phase 4: Advanced Physics & Interactions** (Pending)
5. **Phase 5: UI, HUD & Achievements** (Pending)
6. **Phase 6: Optimization & Polish** (Pending)
