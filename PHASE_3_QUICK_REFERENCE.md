# ⚡ Phase 3 Quick Reference

## 🚀 Quick Start (Day 1)

```bash
# 1. Fix TypeScript errors
npm run type-check  # identify remaining issues
npm run build      # attempt build

# 2. Start dev server with performance monitoring
npm run dev

# 3. Open Chrome DevTools
# Performance tab → Start recording → Scroll through levels → Stop
# Identify FPS drops, GPU load spikes
```

## 📋 Daily Standup Template

```
Today's Focus: [Task + Subtask]
├─ Completed: [List PRs/commits]
├─ Blocked: [Issues + owners]
├─ Next: [Tomorrow's work]
└─ Metrics: FPS@Level[X], Bundle: YYMBMaintenance
```

## 🎯 Critical Metrics (Track Daily)

| Metric | Desktop Target | Mobile Target | Current |
|--------|---|---|---|
| Level 0 FPS | 60 | 30 | ? |
| Level 1 FPS | 60 | 30 | ? |
| Level 2 FPS | 58 | 30 | ? |
| Level 3 FPS | 58 | 28 | ? |
| Level 4 FPS | 59 | 29 | ? |
| Level 5 FPS | 55 | 25 | ? |
| Bundle Size | <10MB | <8MB | ? |
| Load Time | <3s | <5s | ? |
| Memory (VRAM) | <512MB | <256MB | ? |

## 🔧 Common Fixes Cheatsheet

### TypeScript Error: Property 'delta' does not exist
```typescript
// ❌ Before
useFrame((state) => {
  const delta = state.delta; // error
});

// ✅ After
import type { RootState } from '@react-three/fiber';
useFrame((state: RootState) => {
  const delta = state.delta; // fixed
});
```

### Performance Issue: FPS Drop at Level X
```typescript
// 1. Check instance count
<instancedMesh args={[geometry, material, COUNT]}>
  {/* If COUNT > 500, consider reducing on mobile */}
</instancedMesh>

// 2. Check post-processing
<EffectComposer>
  {isMobile ? null : <Bloom ... />}  {/* disable on mobile */}
  {isMobile ? null : <Aberration ... />}
</EffectComposer>

// 3. Profile in DevTools
// Chrome DevTools > Performance > Record > analyze
```

### Mobile UI Not Responsive
```typescript
// Use this media query hook
const isMobile = useMediaQuery({ maxWidth: 768 });

return isMobile ? (
  <MobileBottomSheet />
) : (
  <DesktopFloatingPanel />
);
```

## 📁 File Locations

```
/src/
├─ components/
│  └─ levels/
│     ├─ ChromaticVoid/
│     ├─ ZombieApocalypse/
│     ├─ ClownPlanet/
│     ├─ AssCream/
│     ├─ SoulPrison/
│     └─ TheExit/
├─ audio/          {← NEW: Audio setup goes here}
├─ hooks/
│  └─ useFrame* {← Using from @react-three/fiber}
└─ shaders/

/docs/
├─ PHASE_3_PLANNING.md  {← Full task breakdown}
└─ PHASE_3_QUICK_REFERENCE.md {← This file}
```

## 🎨 Color Palette (Copy-Paste)

```typescript
const palette = {
  deepPurple: '#2E004F',   // 78% - base
  hotPink: '#FF007F',      // 12% - accents
  cyan: '#00FFFF',         // 8% - energy
  white: '#F0F0F0',        // 2% - highlights
  darkVoid: '#0A0E27',     // background
};
```

## 📱 Mobile Breakpoints

```typescript
// Desktop (1024px+)
// Tablet (768px - 1023px)
// Mobile (< 768px)

const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
};
```

## 🔗 Key Hooks & Utils

```typescript
// From @react-three/fiber
import { useFrame } from '@react-three/fiber';
import type { RootState } from '@react-three/fiber';

// From @react-three/drei
import { PerformanceMonitor, useGLTF, Environment } from '@react-three/drei';

// Custom hooks
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useGeneratedShader } from '@/hooks/useGeneratedShader';

// Utils
import { generateAsset } from '@/utils/gemini';
import { PALETTE, CAMERA_PATH } from '@/utils/constants';
```

## 🚨 Debugging Commands

```bash
# Check all TypeScript errors
npm run type-check 2>&1 | grep "error TS"

# Build and check bundle
npm run build
du -h dist/

# Analyze bundle composition
# (requires vite-plugin-visualizer)
npm run visualize

# Check for memory leaks (in DevTools)
# 1. Open Performance Monitor
# 2. Scroll for 5 mins
# 3. Memory should plateau (not grow)
```

## ✅ Task Completion Criteria

### Task 1: TypeScript Cleanup
- [ ] `npm run type-check` returns 0 errors
- [ ] `npm run build` succeeds
- [ ] No `@ts-ignore` comments (except approved workarounds)

### Task 2: Performance Profiling
- [ ] Baseline FPS recorded for all 6 levels
- [ ] Performance report document created
- [ ] Bottlenecks identified & ranked

### Task 3: Render Optimization
- [ ] Desktop: 60 FPS all levels
- [ ] Mobile: 30 FPS all levels (with adaptive rendering)
- [ ] 10-minute stability test passes

### Task 4: Audio Integration
- [ ] 6 ambient tracks loaded
- [ ] Positional audio working
- [ ] Audio synced to scroll progress

### Task 5: Mobile Responsiveness
- [ ] Swipe navigation working
- [ ] UI responsive at 320px-1080px widths
- [ ] Tested on iPhone + Android

### Task 6: Production Deployment
- [ ] Production build < 10MB gzipped
- [ ] CDN setup complete
- [ ] Analytics & error tracking working
- [ ] Live at production URL

## 🎬 Phase 3 → Phase 4 Handoff

After Phase 3, Phase 4 begins with:
- Gemini integration for procedural generation
- Advanced shader/character animation
- Advanced testing & QA
- Launch preparation

---

**Version**: 1.0  
**Last Updated**: Jan 4, 2026
