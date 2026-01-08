---
description: Development workflow for Midnight Gospel 3D
---

# Development Workflow

## Quick Start

// turbo-all

1. Navigate to project directory:
```bash
cd /home/anubhavanand/Documents/midnight
```

2. Install dependencies (if needed):
```bash
npm install --legacy-peer-deps
```

3. Start dev server:
```bash
npm run dev
```

4. Open browser at http://localhost:5173/

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type check
npm run type-check

# Lint code
npm run lint
```

## Key Files to Edit

### Levels
- `src/components/levels/LevelContainer.tsx` - Level router
- `src/components/levels/[LevelName]/index.tsx` - Individual level components

### Scene
- `src/components/Scene.tsx` - Main 3D scene
- `src/components/CameraRig.tsx` - Camera control

### UI
- `src/components/ui/HUD.tsx` - Main overlay
- `src/components/ui/MobileUI.tsx` - Mobile controls

### State
- `src/store/sceneStore.ts` - Zustand state

### Configuration
- `src/utils/constants.ts` - Spline points, config
- `tailwind.config.ts` - Styling

## File Conventions

- Components use PascalCase: `LevelContainer.tsx`
- Hooks use camelCase with 'use' prefix: `useCameraPath.ts`
- Constants use SCREAMING_SNAKE_CASE
- CSS uses Tailwind classes

## Performance Tips

- Use `<instancedMesh>` for crowds
- Lazy load levels with `lazy()` + `<Suspense>`
- Monitor with `useStats()` hook
- Lower particle counts on mobile

## Git Commands

```bash
git status
git add .
git commit -m "message"
git push
```
