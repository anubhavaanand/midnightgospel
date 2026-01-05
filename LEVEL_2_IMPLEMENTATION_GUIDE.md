# Phase 2 Next Steps: Level 2 Implementation Guide

## 🎯 Objective: Implement Level 2 - Clown Planet

**Episode**: "Officers & Wolves"  
**Scroll Range**: 35-55% of journey  
**Theme**: Entropy, grinding down, loss of control  
**Visual Metaphor**: Meat grinder = institutional machinery consuming individuals  

---

## 📋 Implementation Checklist

### Step 1: Create Level 2 Directory & Components
```bash
mkdir -p src/components/levels/ClownPlanet
# Create these files:
# - index.tsx (main level component)
# - GrindingMechanism.tsx (animated grinder)
# - ClownCrowd.tsx (procedural crowd variations)
# - GrindingShader.tsx (vertex displacement effect)
```

### Step 2: Design Meat Grinder Mechanism
Use vertex shader for organic grinding animation:
```glsl
// Pseudo-code for grinder vertex displacement
float grindingWave = sin(position.y * 5.0 + time * 3.0) * 0.3;
vec3 ground = position + normal * grindingWave;
// Combine with vortex forces pulling toward center
```

**Reference**: Use `DecayShader.ts` as template  
**Colors**: #FF007F (meat), #2E004F (machinery), #00FFFF (error/chaos)

### Step 3: Implement Clown Crowd
Similar to ZombieCrowd but with:
- Colorful variants (3-4 different color schemes)
- Different animation speeds per instance
- Bouncy walk cycle instead of shambling

**Pseudo-code**:
```typescript
// 3 clown types with color variations
const clownColors = ['#FF007F', '#00FFFF', '#F0E68C'];
const clownType = i % 3;
const clownColor = clownColors[clownType];
// Apply different scale/jump height per type
```

### Step 4: Generate Grinder Shader via Gemini
Test shader generation from Gemini:
```typescript
const shaderPrompt: ShaderPromptTemplate = {
  task: 'generate_shader',
  style_guidelines: {
    art_style: 'mechanical_surreal',
    color_palette: ['#FF007F', '#2E004F', '#00FFFF'],
    effect_description: 'grinding vortex with swirling meat into center, institutional machinery'
  },
  shader_type: 'fragment'
};

const glslCode = await generateShader(shaderPrompt);
// Validate color accuracy, compile, cache result
```

### Step 5: Performance Profiling
Test on target hardware:
- Desktop (RTX 2060): Should be 55+ FPS
- Mobile (mid-range Android): Should be 25+ FPS

**Metrics to track**:
- GPU time per level (DevTools Performance tab)
- Memory usage (target <400MB)
- Particle count impact (how many before drop?)

### Step 6: Integrate into Level Router
Update `LevelContainer.tsx`:
```typescript
import ClownPlanet from './ClownPlanet';

// In the router:
{activeLevel === 2 && <ClownPlanet isActive={true} />}
```

---

## 🎨 Visual Design Guidelines

### Color Usage (Strict Adherence)
```
Level 2 Dominant Colors:
├── #FF007F (80%) — Meat/organic, visceral feel
├── #2E004F (15%) — Machinery/shadow
└── #00FFFF (5%) — Error/digital glitches
```

### House Style Rules (Liam Cobb)
✅ **Must Follow**:
1. Smooth curved geometry (no hard mechanical edges)
2. All corners same radius (consistent aesthetic)
3. Navigable space (camera can move through)
4. Background comments on theme (grinding = loss of autonomy)
5. Organic forms within mechanical framework

### Lighting Setup
```
3-light hierarchy (same as Level 1):
├── ambientLight(1.0) color:#FF007F (meat tone)
├── pointLight(position:[0,5,0], intensity:1.2) color:#FF007F (main)
└── pointLight(position:[-8,2,0], intensity:0.8) color:#00FFFF (accent)
```

---

## 💻 Code Template (Use This)

### GrindingMechanism.tsx Template
```typescript
import { useRef } from 'react';
import { useFrame } from '@react-three/drei';
import * as THREE from 'three';

export default function GrindingMechanism() {
  const mechanismRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state) => {
    if (mechanismRef.current) {
      timeRef.current += state.delta;
      
      // Rotation animation
      const spin = timeRef.current * 2.0;
      mechanismRef.current.rotation.z = spin;
      
      // Pulsing scale for grinding effect
      const pulse = Math.sin(timeRef.current * 3.0) * 0.05 + 1.0;
      mechanismRef.current.scale.set(pulse, 1, pulse);
    }
  });

  return (
    <group ref={mechanismRef} position={[0, 0, -5]}>
      {/* Grinder body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[4, 4, 2, 32]} />
        <meshStandardMaterial
          color="#2E004F"
          roughness={0.3}
          metalness={0.7}
          emissive="#FF007F"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Grinding blades - 4 rotating */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0, 0]} rotation={[0, (i / 4) * Math.PI * 2, 0]}>
          <boxGeometry args={[0.3, 3, 0.1]} />
          <meshStandardMaterial
            color="#FF007F"
            roughness={0.5}
            metalness={0.5}
            emissive="#FF007F"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Center vortex (visual indication of pull) */}
      <mesh position={[0, -0.5, 0]}>
        <coneGeometry args={[2, 1.5, 32]} />
        <meshStandardMaterial
          color="#00FFFF"
          roughness={0.8}
          emissive="#00FFFF"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}
```

### ClownPlanet/index.tsx Template
```typescript
import GrindingMechanism from './GrindingMechanism';
import ClownCrowd from './ClownCrowd';

interface ClownPlanetProps {
  isActive: boolean;
}

export default function ClownPlanet({ isActive }: ClownPlanetProps) {
  if (!isActive) return null;

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.6} color="#FF007F" />
      <pointLight position={[0, 5, 0]} intensity={1.2} color="#FF007F" castShadow distance={40} />
      <pointLight position={[-8, 2, 0]} intensity={0.8} color="#00FFFF" castShadow distance={30} />

      {/* Main mechanic */}
      <GrindingMechanism />

      {/* Crowd of clowns being processed */}
      <ClownCrowd />

      {/* Ground */}
      <mesh position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#0A0E27"
          roughness={0.9}
          emissive="#2E004F"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
}
```

---

## 🔧 Integration Steps

### 1. Create Files
```bash
touch src/components/levels/ClownPlanet/{index.tsx,GrindingMechanism.tsx,ClownCrowd.tsx}
```

### 2. Copy Template Code
Use templates above to create base implementations

### 3. Update LevelContainer
```typescript
import ClownPlanet from './ClownPlanet';

// In router function:
const activeLevel = getActiveLevel(scrollProgress);

// Add:
{activeLevel === 2 && <ClownPlanet isActive={true} />}
```

### 4. Test in Browser
```bash
npm run dev
# Scroll to 35-55% range
# Should see grinding mechanic + clown crowd
```

### 5. Optimize & Profile
- Use Chrome DevTools Performance tab
- Target <16.67ms per frame
- Adjust particle/instance counts if needed

---

## 📊 Expected Metrics

### File Sizes
```
GrindingMechanism.tsx: ~150 lines
ClownCrowd.tsx: ~180 lines (similar to ZombieCrowd)
ClownPlanet/index.tsx: ~120 lines
Total: ~450 lines
```

### Performance
```
GPU Time Target: 6-10ms per frame (similar to Level 1)
Draw Calls: 3-5 (main grinder + instances)
Memory: +50-100MB (similar crowd size)
```

### Completion Time
```
Experienced Developer: 3-4 hours
Using AI Pair Programming: 1-2 hours
Testing & Optimization: 1 hour
Total: 4-5 hours per level
```

---

## 🎬 Quality Checklist

Before merging Level 2:

- [ ] Component files created and imported
- [ ] GrindingMechanism renders and rotates
- [ ] ClownCrowd renders with 300+ instances
- [ ] Scroll detection works (35-55% range)
- [ ] Colors match palette exactly
- [ ] Lighting looks correct (no blown-out areas)
- [ ] GPU time <16ms (60 FPS achievable)
- [ ] No console errors
- [ ] House style rules followed
- [ ] Background-as-narrative metaphor clear

---

## 🧪 Testing Framework

### Browser Testing
```javascript
// Check Level 2 is active
import { useSceneStore } from './src/store/sceneStore'
// Scroll to 45% (middle of level)
// Verify: activeLevel === 2
```

### Performance Testing
```
Chrome DevTools → Performance Tab
1. Click Record
2. Scroll through level 2
3. Stop recording
4. Check "Rendering" section for GPU time
5. Should be <16.67ms per frame for 60 FPS
```

### Visual Testing
```
Checklist:
☐ Meat color (#FF007F) is vivid and visible
☐ Machinery color (#2E004F) creates depth
☐ Cyan accents (#00FFFF) highlight key areas
☐ No visible Z-fighting or clipping
☐ Shadows render correctly
☐ Emissive materials glow appropriately
```

---

## 🚀 Success Criteria

✅ Level 2 is complete when:
1. Grinder mechanism animates smoothly (rotating + pulsing)
2. Clown crowd renders and wanders (300+ instances)
3. Scroll navigation works (35-55% triggers level)
4. Performance: 55+ FPS on desktop, 25+ on mobile
5. All colors verified (#FF007F, #2E004F, #00FFFF)
6. No console errors or warnings
7. House style rules adhered (smooth lines, navigable space)
8. Theme is clear (institutional machinery consuming individuals)

---

## 📚 Reference Materials

**Use These When Building Level 2:**

1. **Existing Components**
   - `src/components/levels/ZombieApocalypse/` (template for crowd)
   - `src/components/levels/ChromaticVoid/` (template for particles)
   - `src/shaders/DecayShader.ts` (template for shader)

2. **Utilities**
   - `src/utils/gemini.ts` (for shader generation)
   - `src/utils/constants.ts` (for level configuration)

3. **Documentation**
   - `RESEARCH_VISUAL_REFERENCE.md` (color specs)
   - `IMPLEMENTATION_GUIDE.md` (technical patterns)
   - `PHASE_2_QUICK_REFERENCE.md` (recent examples)

---

## 💡 Pro Tips

1. **Start Simple**: Get basic geometry rendering before animations
2. **Use Instancing**: 300+ clowns = InstancedMesh (not individual meshes)
3. **Profile Early**: Check GPU time after first render
4. **Cache Gemini Results**: Don't regenerate same shaders
5. **Test Mobile**: Often reveals performance issues early
6. **Use Emissive**: Makes colors pop (required for palette)
7. **Document Metaphors**: Comment why each visual choice exists

---

## 🎯 Timeline

**Suggested Pace for Phase 2 Remaining:**
```
Days 1-2: Implement Level 2 (this guide)
Days 3-4: Implement Level 3-4
Days 5-6: Implement Level 5 + Polish
Days 7-8: Performance optimization + Mobile
```

**Estimated Total**: 8 days to Phase 2 completion

---

**Last Updated**: January 4, 2026  
**For**: Level 2 (Clown Planet) Implementation  
**Difficulty**: Medium (builds on Level 1 template)  
**Estimated Duration**: 4-6 hours with pair programming
