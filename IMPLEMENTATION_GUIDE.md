# Midnight Gospel 3D: Design Implementation Guide

## Visual Design House Rules (From Liam Cobb's Methodology)

### Strict Visual Consistency Parameters

```json
{
  "line_style": {
    "rule": "every_graphic_element_has_smooth_straight_line",
    "corner_diameter": "all_corners_same_radius",
    "implementation": "Sobel_filter_post_processing + consistent_line_weights"
  },
  "spatial_logic": {
    "rule": "maintain_realism_despite_surrealism",
    "principle": "if_spotted_object_imagine_clancy_using_it",
    "test": "characters_navigate_without_awkwardness"
  },
  "composition": {
    "rule": "simplify_busy_compositions",
    "depth": "ensure_foreground_midground_background_distinction",
    "layering": "mark_and_group_each_layer_for_animation"
  }
}
```

### Balance Formula: Wackiness + Realism
- **Exaggerate**: Proportions, colors, geometry, physics
- **Ground**: By maintaining architectural/spatial logic
- **Result**: Surreal yet explorable environments

---

## Color Palette Implementation Strategy

### Strict Palette Adherence
```javascript
const MIDNIGHT_GOSPEL_PALETTE = {
  void_base: '#2E004F',      // 78% of backgrounds
  neon_accent_1: '#FF007F',  // 12% highlights
  neon_accent_2: '#00FFFF',  // 8% tech/transcendence
  text_highlight: '#F0F0F0', // 2% important text
  shadow_depth: '#0A0E27',   // Rim lighting complement
};

// JSON Prompt Rule: Enforce this palette in all Gemini-generated assets
const GEMINI_PALETTE_CONSTRAINT = {
  "color_palette": ["#2E004F", "#FF007F", "#00FFFF", "#F0F0F0"],
  "dominant_color": "#2E004F",
  "accent_ratio": "hot_pink_50%_cyan_50%",
  "no_desaturation_allowed": true,
};
```

### Texture & Atmosphere
- **Film Grain**: 0.15-0.2 opacity (analog feel)
- **Bloom Intensity**: 2.0 with 0.9 luminance threshold
- **Chromatic Aberration**: [0.001, 0.001] offset
- **Glitch Duration**: 0.1-0.5s on transitions
- **RGB Shift Moments**: During "ego death" sequences

---

## Character & Asset Generation Framework

### Procedural Character Naming (for Gemini Prompts)
Follow pattern: `[Episode_Name]_[Character_Role]_[Visual_Descriptor]`

Examples:
- `Zombie_Apocalypse_Horde_MutatedHuman`
- `Soul_Prison_Guardian_SkeletalEntity`
- `Space_Cat_CivilianCrew_FuturisticSuit`

### JSON Prompt Template for Character Generation
```json
{
  "task": "generate_3d_character",
  "episode": "Soul_Prison_Moon",
  "style_guidelines": {
    "art_style": "surrealist_cartoon_gothic",
    "line_weight": "thick_consistent_outline",
    "shading": "cel_shaded_with_rim_lighting",
    "color_palette": ["#2E004F", "#FF007F", "#00FFFF", "#F0F0F0"],
    "emotional_tone": "existential_dread_with_dark_comedy",
    "anatomical_realism": "organic_with_alien_distortion"
  },
  "character_parameters": {
    "type": "npc_prisoner",
    "visual_markers": ["no_tongue", "prison_garb", "haunted_expression"],
    "silhouette": "humanoid_with_bosch_inspired_distortion",
    "geometry": "low_poly_with_vertex_displacement",
    "texture_resolution": "1024x1024",
    "physics_integration": "ragdoll_for_death_animation"
  },
  "output_format": "glb_with_draco_compression"
}
```

### Asset Verification Checklist
After generating with Gemini, verify each asset:
- [ ] Color palette strictly adheres to constraint
- [ ] Lines are smooth and consistent diameter
- [ ] Geometry feels navigable (not impossible shapes)
- [ ] Silhouette is readable at distance
- [ ] Symbolic meaning maps to episode theme
- [ ] Texture resolution matches target platform
- [ ] Physics parameters are reasonable

---

## Level Design: Background-as-Narrative

### Episode-to-Environment Mapping

#### Level 0: Chromatic Void (0-15%)
**Visual Metaphor**: The void before consciousness
- **Background Style**: Liquid membrane with Perlin noise
- **Color Focus**: Deep purple base with cyan accents
- **Symbolic Elements**: Floating tapes (media), pods (consciousness entry), swirling void (potential)
- **Design Principle**: "Infinite possibility; choose to enter"

#### Level 1: Zombie Apocalypse (15-35%)
**Visual Metaphor**: Death as mundane reality; humor as coping mechanism
- **Background Style**: Warping White House, decay animations
- **Color Focus**: Dark purples with flesh-tone zombie variations
- **Symbolic Elements**: Zombie crowds (humanity as collective), hover-chairs (transcendence attempts)
- **Design Principle**: "Chaos normalized; find mindfulness in mess"
- **Shader**: Displacement animation on buildings, glitchy grid overlay

#### Level 2: Clown Planet / Meat Factory (35-55%)
**Visual Metaphor**: Body acceptance; death is natural process
- **Background Style**: Industrial machinery combined with organic shapes
- **Color Focus**: Hot pink (life force), purple (introspection)
- **Symbolic Elements**: Grinding machinery (entropy), soft creatures (vulnerability)
- **Design Principle**: "Suffering is transition; meat is impermanent"
- **Shader**: Vertex displacement for grinder, subsurface scattering for Deer Dogs

#### Level 3: Ass Cream / Underwater World (55-75%)
**Visual Metaphor**: Non-Euclidean consciousness; space itself is negotiable
- **Background Style**: Water refraction, impossible geometry, ice formations
- **Color Focus**: Cyan (transcendence), purple depths
- **Symbolic Elements**: Space cats (technology mastering void), fish in bowl (consciousness trapped/free)
- **Design Principle**: "Reality is negotiable; perspective shifts everything"
- **Shader**: Complex water with refraction, non-Euclidean geometry tricks (recursive mirrors)

#### Level 4: Soul Prison Moon (75-90%)
**Visual Metaphor**: Existential dread; the bardo loop of suffering
- **Background Style**: Twisted earth formations, skeletons, Bosch-inspired apocalypse
- **Color Focus**: High-contrast purples, red rim-lighting, deep blacks
- **Symbolic Elements**: Soul bird (consciousness), prisoners (trapped egos), skeletal earth (death imagery)
- **Design Principle**: "This is the darkest moment; breakthrough requires surrender"
- **Shader**: Rim-lighting (red/cyan), high-contrast shadows, dramatic AO

#### Level 5: The Exit (90-100%)
**Visual Metaphor**: Transcendence; death as white light awakening
- **Background Style**: Horn artifact, particle explosion, white-out
- **Color Focus**: Neon pinks/cyans → pure white
- **Symbolic Elements**: Third eye opening, consciousness expanding, loop resets
- **Design Principle**: "You can choose to begin again; or watch the series"
- **Shader**: Particle system expanding from center, post-processing fade to white

---

## Shader Generation Workflow

### Step 1: Define Visual Intent
```json
{
  "episode": "Soul_Prison_Moon",
  "visual_goal": "existential_dread_landscape",
  "color_mood": "high_contrast_red_purple_black",
  "emotional_intent": "danger_without_hope"
}
```

### Step 2: Build Gemini Prompt
```javascript
const shaderPrompt = {
  task: 'generate_shader',
  style_guidelines: {
    art_style: 'dark_surrealist_horror',
    color_palette: ['#2E004F', '#FF007F', '#8B0000', '#000000'],
    effect_description: 'Twisted earth formation with rim-lighting, suggesting conscious entities crawling from geological depth. Bosch-inspired shadows and distorted geometry. High contrast between void and lit areas.'
  },
  shader_type: 'fragment',
  parameters: {
    noise_type: 'multiple_octave_perlin_with_voronoi',
    distortion: 'domain_warping_with_time_feedback',
    lighting: 'rim_light_at_45_degree_angle',
    rim_color_start: '#FF007F',
    rim_color_end: '#8B0000',
    base_color: '#2E004F'
  }
};
```

### Step 3: Call generateShader()
```typescript
const glslCode = await generateShader(shaderPrompt);
```

### Step 4: Validate & Integrate
- Test shader on low-end GPU
- Verify color accuracy in high-intensity Bloom
- Check for artifacts at extreme camera angles
- Profile GPU load (target <5ms)

---

## Physics Integration: Voxel Destruction as Ego Death

### Conceptual Mapping
```javascript
const EGO_DEATH_SIMULATION = {
  // When user destroys voxel objects:
  before: {
    state: "unified_form",
    meaning: "fixed_self_identity",
    visual: "coherent_mesh"
  },
  during: {
    state: "dissolution",
    meaning: "ego_boundaries_dissolving",
    visual: "individual_voxels_separating_falling"
  },
  after: {
    state: "dispersed_particles",
    meaning: "no_self_separate_from_universe",
    visual: "dust_floating_through_void"
  }
};
```

### Voxel Cluster Configuration by Level
```javascript
const VOXEL_CLUSTERS_BY_LEVEL = {
  0: { // Chromatic Void
    size: [3, 3, 3],
    colors: ['#FF007F', '#00FFFF'],
    brittleness: 0.9,
    glow_intensity: 2.0,
  },
  1: { // Zombie Apocalypse
    size: [5, 5, 5],
    colors: ['#2E004F', '#FF007F', '#8B4513'],
    brittleness: 0.6,
    glow_intensity: 0.5,
  },
  4: { // Soul Prison
    size: [8, 8, 8],
    colors: ['#2E004F', '#FF007F', '#8B0000', '#000000'],
    brittleness: 1.0,
    glow_intensity: 1.5,
  },
};
```

### Click-to-Destroy Feedback
- **Visual**: Voxel shatters, individual cubes fall with gravity
- **Audio**: Glitch sound effect (low-fi sci-fi aesthetic)
- **Particle**: Dust trail following falling voxels
- **Post-Processing**: Brief glitch effect (clip-path distortion)

---

## Spatial Audio Integration

### PositionalAudio by Level

#### Level 1: Zombie Apocalypse
- **Ambient**: Crowd groaning, machinery hum
- **Spatial**: Zombie sounds pan as camera moves past crowds
- **Dialogue**: Dr. Drew's podcast excerpt (spatialized to character)
- **Doppler**: Volume decreases as camera moves away

#### Level 2: Clown Planet
- **Ambient**: Grinding machinery, creaking gears
- **Spatial**: Deer Dog whimpering audio, left-to-right pan as camera flies past
- **Dialogue**: Anne Lamott's words about death, appearing from Deer Dog position
- **Mechanic**: Grinder sound intensifies during vertex displacement animation

#### Level 4: Soul Prison
- **Ambient**: Hollow wind, breathing sounds, heartbeat distortion
- **Spatial**: Soul Bird crying from above, reverberating in stone cavern
- **Dialogue**: Jason Louv discussing bardo, voice echoing from multiple prisoners
- **Atmosphere**: Silence punctuated by sudden sounds (psychological tension)

### Lo-Fi Sci-Fi Sound Assets
- Source: Grindhouse, Lo-Fi Sci-Fi libraries
- Elements: Tape hiss, vinyl crackle, analog synth drones, distorted stuttering
- Integration: Layered in background ambience at 0.2 opacity
- Purpose: Reinforce "retro-future" feel, ground surrealism in analog texture

---

## Mobile Optimization (Responsive Design)

### Desktop vs. Mobile Degradation

#### Desktop (Full Experience)
- All post-processing effects enabled
- Full voxel cluster counts (8x8x8)
- Complex water shaders with refraction
- 60 FPS target

#### Mobile (Simplified)
- Bloom only (disable Aberration, Noise, Glitch)
- Reduced voxel clusters (3x3x3)
- Simplified water (no refraction)
- Swipe-based scroll control
- UI: Bottom-sheet layout (thumb-friendly)
- Target: 30 FPS (acceptable on mid-range phones)

```javascript
const QUALITY_CONFIG = {
  desktop: {
    dpr: 1.0,
    postProcessing: ['bloom', 'aberration', 'noise', 'glitch'],
    voxelComplexity: 8,
    particleCount: 5000,
    textureResolution: 2048,
  },
  mobile: {
    dpr: 0.75,
    postProcessing: ['bloom'],
    voxelComplexity: 3,
    particleCount: 1000,
    textureResolution: 1024,
  },
};
```

---

## Testing Checklist for Each Level

### Visual Quality
- [ ] Colors match palette (use color picker to verify hex codes)
- [ ] Lines are smooth and consistent weight
- [ ] Bloom doesn't blow out important details
- [ ] Chromatic aberration isn't too disorienting
- [ ] Glitch effects reinforce theme (not just visual noise)

### Navigation
- [ ] Camera moves smoothly along spline
- [ ] Look-ahead banking feels natural (not nauseating)
- [ ] Floating text is legible and positioned clearly
- [ ] Level transitions are seamless

### Performance
- [ ] 60 FPS on desktop target GPU (RTX 2060)
- [ ] <3s load time (with progressive asset streaming)
- [ ] Mobile 30 FPS on mid-range phone
- [ ] No VRAM overflow (target <256MB on mobile)

### Narrative Integration
- [ ] Background metaphors align with dialogue/theme
- [ ] Audio cues sync to visual moments
- [ ] Quote placement enhances rather than distracts
- [ ] Voxel destruction opportunities feel intentional

---

## Summary: From Research to Implementation

1. **Research** (completed): Gathered visual design rules, thematic mappings, character archetypes
2. **Design** (apply here): Use JSON prompts to enforce Liam Cobb's house style in all Gemini generations
3. **Implement** (code it): Create levels following background-as-narrative principle
4. **Test** (verify): Checklist ensures quality matches show's aesthetic
5. **Deploy** (launch): Mobile-optimized build with graceful degradation

The 3D adaptation succeeds when users feel the same "trojan horse" effect as the show: drawn in by visual spectacle, then hit with existential depth.
