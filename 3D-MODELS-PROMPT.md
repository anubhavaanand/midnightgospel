# Midnight Gospel 3D Models — Agent Brief (Corrected & Enhanced)

## Project Overview

An immersive React Three Fiber (R3F) + Three.js 3D simulator adapting *The Midnight Gospel* Netflix series. The simulator features 10 levels (Hub + 9 episode worlds). Currently, the codebase uses procedural geometry placeholders (spheres, boxes, cylinders, etc.) for all characters and key elements. We need real, stylized 3D models to replace these placeholders.

## Tech Specs

- **Engine:** React Three Fiber (R3F) + Three.js (v0.160.0)
- **Format:** GLB with Draco mesh compression enabled
- **Max poly count:** ~50K tris per character, ~200K per environment piece (Target total budget: <200K tris per level)
- **Textures:** JPEG, max 2048x2048, PBR workflow
- **Animations:** Skeletal animations in GLB if applicable (seamlessly looping idle breathing, floating, or subtle movements). Use standard animation action names like `idle`, `float`, or `breathe`.
- **Required tools:** Blender 3.6+, export with the provided `scripts/export-models.py` script to enforce Draco settings.

## Delivery Format & Paths

Each model should be placed in its respective level subdirectory under `public/models/`:

```
public/models/
├── hub/
│   ├── space_exploration.glb (existing)
│   └── island_in_the_space.glb (existing)
├── zombie-capitol/
├── baby-clown-pastures/
├── cream-ocean/
├── vengeance-kingdom/
├── soul-prison/
├── meditation-cave/
├── planet-blank-ball/
├── trainworld/
└── the-core/
```

Include a brief README per level folder explaining the scale, material slots, and animations of the delivered models.

---

## Models Needed Per Level

### 1. HUB — Chromatic Ribbon (Level 0)
*Already has 2 GLB models (`space_exploration.glb`, `island_in_the_space.glb`). No modifications needed.*

---

### 2. Episode 1 — Zombie Capitol (Level 1)
**Theme:** Political satire, zombie apocalypse, meditation vs addiction
**Level Slug:** `zombie-capitol`

| Model File Name | Description / Details | Bounding Box Scale (Match Placeholder) | Replaces (Procedural Geometry) |
|---|---|---|---|
| **glasses-man.glb** | Drew Pinsky / President NPC. Distorted, wise, gentle. Dressed in an unkempt suit with glasses. Subtle standing sway. | `0.6m x 1.2m x 0.6m` | Distorted orange double-sphere + torus ring |
| **clancy-avatar.glb** | Beach body Clancy in Hawaiian shirt. Floating idle. | `0.8m x 2.2m x 0.8m` | Fuchsia glowing cylinder + head sphere |
| **zombie-a.glb** | Zombie mesh variant A (shambling). Stylized green, low-poly. | `0.4m x 1.2m x 0.4m` | Green octahedrons |
| **zombie-b.glb** | Zombie mesh variant B (crawling). Stylized green, low-poly. | `0.4m x 0.6m x 1.2m` | Green octahedrons |
| **zombie-c.glb** | Zombie mesh variant C (reaching). Stylized green, low-poly. | `0.4m x 1.2m x 0.4m` | Green octahedrons |
| **white-house.glb** | Simplified, decaying White House facade with glowing red windows. | `10.0m x 5.0m x 6.0m` | Red wireframe box |
| **cure-cannon.glb** | Neon green medical cannon towers. | `1.0m x 6.0m x 1.0m` | Green pillars (x2) |

---

### 3. Episode 2 — Baby Clown Pastures (Level 2)
**Theme:** Death, acceptance, grief, sobriety, new life
**Level Slug:** `baby-clown-pastures`

| Model File Name | Description / Details | Bounding Box Scale (Match Placeholder) | Replaces (Procedural Geometry) |
|---|---|---|---|
| **baby-clown-king.glb** | Anne Lamott / Annie character. Pastel clown with red nose, big sad eyes, gentle smile. Fluffy/puffy body. | `2.0m x 2.0m x 2.0m` | Pink sphere with separate eyes/nose shapes |
| **clancy-avatar.glb** | Balloon-dog Clancy. Inflatable-looking, colorful, pastel pinks and yellows. Wobble animation. | `1.0m x 1.8m x 1.4m` | Pastel cylinder body + sphere head/ears |
| **pasture-prop-flower.glb** | Procedural/scattered psychedelic flowers to decorate hills. | `0.3m x 0.6m x 0.3m` | N/A (Additive props) |

---

### 4. Episode 3 — Cream Ocean Planet (Level 3)
**Theme:** Magic, forgiveness, suffering, spiritual practice
**Level Slug:** `cream-ocean`

| Model File Name | Description / Details | Bounding Box Scale (Match Placeholder) | Replaces (Procedural Geometry) |
|---|---|---|---|
| **fish-mage.glb** | Damien Echols / Darryl character. Golden fish-humanoid mage with flowing robes, wizard staff. Floating/swimming idle. | `1.2m x 2.2m x 1.2m` | Golden rotated cylinder + tail torus + orb |
| **clancy-avatar.glb** | Octopus/alien Clancy. Purple bioluminescent octopus with glowing cyan spots and a single glowing eye. Wave animation. | `1.5m x 1.8m x 1.5m` | Purple distorted cylinder + eye sphere |

---

### 5. Episode 4 — Vengeance Kingdom (Level 4)
**Theme:** Death positivity, mortality, body after death
**Level Slug:** `vengeance-kingdom`

| Model File Name | Description / Details | Bounding Box Scale (Match Placeholder) | Replaces (Procedural Geometry) |
|---|---|---|---|
| **knight.glb** | Caitlin Doughty / Captain character (referred to as Trudy Knight in code). Dark armor, neon orange visor slit, red plume. | `0.8m x 1.8m x 0.8m` | Dark stacked boxes + visor box + cylinder plume |
| **clancy-avatar.glb** | Warrior Clancy. Crimson/fuchsia armored warrior holding a neon cyan sword. | `0.8m x 2.0m x 0.8m` | Distorted pink cylinder |
| **neon-sword.glb** | Distinct neon cyan glowing broadsword. | `0.08m x 1.2m x 0.04m` | Box geometry sword placeholder |

---

### 6. Episode 5 — Soul Prison (Level 5)
**Theme:** Buddhism, hope, letting go, interconnected consciousness
**Level Slug:** `soul-prison`

| Model File Name | Description / Details | Bounding Box Scale (Match Placeholder) | Replaces (Procedural Geometry) |
|---|---|---|---|
| **inmate.glb** | Jason Louv / Jason character. Cosmic prisoner. Semi-translucent cyan body inside a wireframe cage/lock ring. Slowly rotating. | `1.8m x 1.8m x 1.8m` | Stacked cyan octahedrons + wireframe + torus |
| **clancy-avatar.glb** | Rainbow Clancy. Prismatic shifting glass cylinder with a pulsing white core. | `0.7m x 1.5m x 0.7m` | Distorted cyan cylinder + inner core cylinder |

---

### 7. Episode 6 — Meditation Cave (Level 6)
**Theme:** Heartbreak, relationships, existential loneliness
**Level Slug:** `meditation-cave`

| Model File Name | Description / Details | Bounding Box Scale (Match Placeholder) | Replaces (Procedural Geometry) |
|---|---|---|---|
| **teacher-trudy.glb** | Trudy Goodman / Trudy character (referred to as Teacher David in code). Serene double-cone form with golden ring. | `1.2m x 2.0m x 1.2m` | Cone + inverted cone + golden torus ring |
| **clancy-avatar.glb** | Zen Clancy. Warm gold and violet, floating meditation ring around body. | `1.1m x 1.8m x 1.1m` | Distorted gold cylinder + torus ring |

---

### 8. Episode 7 — Planet Blank Ball (Level 7)
**Theme:** Meditation mastery, enlightenment, cosmic awareness
**Level Slug:** `planet-blank-ball`

| Model File Name | Description / Details | Bounding Box Scale (Match Placeholder) | Replaces (Procedural Geometry) |
|---|---|---|---|
| **death.glb** | David Nichtern / Teacher character. Tall black obsidian monolith, gold trim, single glowing eye/skull core at center. | `1.4m x 2.5m x 1.4m` | Black column box + gold torus + core sphere |
| **clancy-avatar.glb** | Golden Sphere Clancy. Perfect golden sphere inside a transparent glass shell. Floating and rotating. | `1.1m x 1.1m x 1.1m` | Golden sphere + distorted glass shell |

---

### 9. Episode 8 — Life Cycle Trainworld (Level 8)
**Theme:** Mother-son love, presence, death, rebirth, letting go
**Level Slug:** `trainworld`

| Model File Name | Description / Details | Bounding Box Scale (Match Placeholder) | Replaces (Procedural Geometry) |
|---|---|---|---|
| **mom.glb** | Duncan's mom character. Double sphere maternal figure. Soft golden light, orbiting rings. | `2.0m x 2.0m x 2.0m` | Double spheres + clockwork torus ring |
| **clancy-avatar.glb** | Heart Clancy. Golden heart-shaped cylinder with a warm amber glow. | `0.8m x 1.8m x 0.8m` | Distorted cylinder + clock torus ring |

---

### 10. Episode 9 — The Core / Sandbox (Level 9)
**Theme:** Final integration, cosmic awareness, chaos/order
**Level Slug:** `the-core`

> [!NOTE]
> This level runs on a zero-gravity Physics simulator (`@react-three/rapier`). Objects are wrapped in `RigidBody` components. Do not modify the raymarched fractal shader or physics simulation.

| Model File Name | Description / Details | Bounding Box Scale (Match Placeholder) | Replaces (Procedural Geometry) |
|---|---|---|---|
| **simulator-centerpiece.glb** | Abstract crystalline structure that sits alongside the raymarched fractal centerpiece. | `4.0m x 4.0m x 4.0m` | N/A (renders alongside fractal shader) |
| **clancy-final.glb** | Fully realized Clancy — all forms combined. Prismatic, morphing, iridescent. | `1.3m x 2.0m x 1.3m` | Octahedron + icosahedron + sphere + torus |

---

## Style Guide: "Psychedelic Minimalism"

- **Low-poly stylized:** Avoid high-frequency realism. Think Gorillaz meets Adult Swim.
- **Color matching:** Colors must coordinate with each episode's color scheme (defined in `src/data/levels.ts`).
- **Glow & Emissive channels:** Every character should have an emissive texture channel (subtle to strong depending on the character).
- **Facial Features styling:**
  > [!IMPORTANT]
  > Do not model realistic human faces or eyes. Characters are abstract representations. Use stylized geometric features (visors, single glowing spherical eyes, glowing cores, energy ring halos, or simplified pastel clown makeup details) to define expressions.
- **Terrain custom shaders:** The undulating ground terrains use custom vertex/fragment noise shaders. Do not model the ground/terrain; keep the shader-based planes.

---

## Technical & Integration Requirements

1. **Draco compression:** All files must run through Draco compression. Example configuration for the export script:
   - position: 14bit, normal: 10bit, texcoord: 12bit.
2. **Scale & Pivot:** 1 unit = 1 meter in Three.js. Pivot/origin must be at the base center of the feet (y=0) for standing entities, or geometric center for floating ones, facing +Z.
3. **Materials:** Use standard Principled BSDF in Blender. Keep materials low (<5 per model) and bake or embed all textures.
4. **Draco Decoder Setup:** Before loading compressed models, the React application must register the Draco decoder path:
   ```typescript
   import { useGLTF } from '@react-three/drei';
   useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
   ```
5. **R3F Loading Pattern:** Use `@react-three/drei`'s `useGLTF` hook. Clone the scene if multiple instances are needed (like zombies). Use `<Resize>` and `<Center>` to normalize dimensions if scaling inconsistencies arise.
   ```tsx
   import React, { Suspense } from 'react';
   import { useGLTF, Resize, Center, Float } from '@react-three/drei';

   const NPCCharacter = ({ position }) => {
     const { scene } = useGLTF('/models/zombie-capitol/glasses-man.glb');
     
     // Clone scene for multiple instances or to prevent shared material mutation
     const clonedScene = React.useMemo(() => scene.clone(), [scene]);

     return (
       <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
         <group position={position}>
           <Resize scale={1.2}>
             <Center>
               <primitive object={clonedScene} />
             </Center>
           </Resize>
         </group>
       </Float>
     );
   };

   // Always preload models at module level to prevent render-blocking lag
   useGLTF.preload('/models/zombie-capitol/glasses-man.glb');
   ```
