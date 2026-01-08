---
description: Comprehensive project context for Midnight Gospel 3D - Read this first on context loss
---

# 🌌 Midnight Gospel 3D - Complete Project Context

## WHAT IS THIS PROJECT?

**Midnight Gospel 3D** is a browser-based immersive 3D experience adapting the Netflix animated series "The Midnight Gospel" into an interactive "Multiverse Simulator."

### Core Technologies
- **Frontend**: React 18 + TypeScript (strict mode)
- **3D Graphics**: Three.js r160 + React Three Fiber 8.15
- **State**: Zustand 4.4
- **Build**: Vite 5.0
- **Styling**: Tailwind CSS 3.3
- **AI**: Google Generative AI (Gemini 3)
- **Animation**: GSAP 3.12
- **Narrative**: Theatre.js 0.7

---

## CURRENT PROJECT STATUS

**Status**: ✅ **PROJECT COMPLETE & PRODUCTION READY**

### Completed Phases:
- ✅ **Phase 1**: Foundation (Research + Architecture)
- ✅ **Phase 2**: Level Implementation (6 levels, 5,000+ lines)
- ✅ **Phase 3**: Production Readiness (TypeScript cleanup, optimization, audio, mobile)
- ✅ **Phase 4**: Launch Preparation (Bundle optimization, final testing, deployment ready)

### Build Status:
- TypeScript: 0 errors ✅
- Build: SUCCESS ✅
- Bundle Size: 869.35 kB gzipped
- Dev Server: http://localhost:5173/

---

## PROJECT STRUCTURE

```
/home/anubhavanand/Documents/midnight/
├── src/
│   ├── components/
│   │   ├── Scene.tsx              # Main 3D scene wrapper
│   │   ├── CameraRig.tsx          # Spline camera system
│   │   ├── levels/
│   │   │   ├── LevelContainer.tsx # Router (0.00 → 1.00 scroll)
│   │   │   ├── ChromaticVoid/     # Level 0: Intro
│   │   │   ├── ZombieApocalypse/  # Level 1: 500 zombies
│   │   │   ├── ClownPlanet/       # Level 2: Grinder + clowns
│   │   │   ├── AssCream/          # Level 3: Water + space cats
│   │   │   ├── BlindedByEnd/      # Level 4: Medieval (forgivness)
│   │   │   ├── SoulPrison/        # Level 5: Skeletal landscape
│   │   │   └── TheExit/           # Level 6: Particle explosion
│   │   ├── effects/               # Post-processing
│   │   ├── ui/                    # HUD, navigation, debug
│   │   ├── landing/               # Landing page components
│   │   └── audio/                 # Spatial audio system
│   ├── hooks/                     # Custom React hooks
│   ├── shaders/                   # Custom GLSL shaders
│   ├── store/                     # Zustand state management
│   ├── utils/                     # Constants, helpers
│   └── pages/                     # App entry points
├── public/                        # Static assets
├── package.json                   # Dependencies
└── [Various .md documentation files]
```

---

## KEY FILES TO READ FIRST

1. **`.github/copilot-instructions.md`** - Architecture guide for AI agents
2. **`README.md`** - Project overview and quick start
3. **`QUICK_REFERENCE.md`** - Commands and deployment steps
4. **`INDEX.md`** - Complete documentation index
5. **`PHASE_4_STARTUP_REPORT.md`** - Latest status report

---

## ESSENTIAL COMMANDS

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel --prod

# Type check
npm run type-check
```

---

## LEVEL STRUCTURE (6 Levels)

| Level | Scroll Range | Episode Theme | Key Visual |
|-------|--------------|---------------|------------|
| 0 | 0-15% | Chromatic Void (Intro) | Floating tapes, pods |
| 1 | 15-30% | Zombie Apocalypse | White House, zombie crowd |
| 2 | 30-45% | Clown Planet | Meat factory, deer dogs |
| 3 | 45-60% | Ass Cream | Water shader, space cats |
| 4 | 60-75% | Blinded by My End | Medieval, warm lighting |
| 5 | 75-90% | Soul Prison | Bosch landscape, soul bird |
| 6 | 90-100% | The Exit | Particle explosion |

---

## COLOR PALETTE

| Color | Hex | Usage |
|-------|-----|-------|
| Deep Purple | #2E004F | 78% - Primary background |
| Hot Pink | #FF007F | 12% - Accent |
| Electric Cyan | #00FFFF | 8% - Secondary accent |
| White | #F0F0F0 | 2% - Highlights |

---

## DESIGN PRINCIPLES (NON-NEGOTIABLE)

1. **Smooth lines & consistent geometry** (enforced via house style)
2. **Backgrounds as active narrative** (metaphors mirror dialogue)
3. **Color palette discipline** (#2E004F, #FF007F, #00FFFF, #F0F0F0)
4. **Wackiness + realism balance** (surreal yet navigable)
5. **Trojan horse structure** (spectacle → philosophy)

---

## ARCHITECTURE PILLARS

1. **React Three Fiber (R3F) Scene Graph** - Declarative 3D with React
2. **Spline-Based Camera Navigation** - Catmull-Rom curves for scroll movement
3. **Psychedelic Chromatic Aesthetic** - Custom shaders, toon shading
4. **Instanced Rendering** - GPU-efficient crowds (500+ entities)
5. **Generative AI Pipeline** - Gemini 3 for shader/asset generation
6. **Rapier Physics** - Voxel destruction, cursor interaction
7. **Spatial Audio** - Three.js PositionalAudio
8. **Glassmorphism UI** - Frosted glass panels over 3D world

---

## RESEARCH DATA AVAILABLE

The file `MIDNIGHT_GOSPEL_RESEARCH.json` contains:
- All character information and voice actors
- Episode summaries and themes
- Color palette specifications
- Design element descriptions
- Production details
- Critical reception

---

## TROUBLESHOOTING

### Build Fails
```bash
rm -rf dist node_modules
npm install --legacy-peer-deps
npm run build
```

### TypeScript Errors
```bash
npm run type-check
npm run lint -- --fix
```

### Dev Server Won't Start
```bash
pkill -f "npm run dev"
npm run dev
```
