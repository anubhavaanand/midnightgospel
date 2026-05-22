# Implementation Plan: Zombie Capitol (Episode 1)

**Branch**: `[002-zombie-capitol]` | **Date**: 2026-05-22 | **Spec**: [specs/002-zombie-capitol/spec.md]

**Input**: Feature specification from `/specs/002-zombie-capitol/spec.md`

## Summary

Implement the interactive WebGL environment for Midnight Gospel Episode 1. This involves building a Zustand audio/dialogue state manager, an AudioAnalyzerNode to capture raw FFT data, and complex GLSL Vertex/Fragment shaders that visually interpolate between "Chaos" (flesh melting, toxic colors) and "Acceptance" (harmonious pastels) based on the dialogue.

## Technical Context

**Language/Version**: TypeScript 5.x, GLSL (WebGL 2.0)

**Primary Dependencies**: React Three Fiber, Three.js, Zustand, Web Audio API

**Target Platform**: Modern Desktop/Mobile Browsers

**Performance Goals**: 60 FPS on desktop, 30 FPS minimum on mobile. Strict vertex displacement optimization.

**Constraints**: Audio-reactive uniforms must map accurately to visual changes within 50ms to prevent desync cognitive dissonance.

## Constitution Check

*GATE: Passed*
- **I. Performance-First 3D**: Hand-written GLSL ensures no CPU-side mapping of vertices.
- **VI. Level Design: Cognitive Dissonance**: This entire plan specifically engineers the Cognitive Dissonance rule.

## Project Structure

### Documentation (this feature)

```text
specs/002-zombie-capitol/
├── spec.md              
├── plan.md              
├── checklists/
│   └── requirements.md
└── tasks.md             
```

### Source Code

```text
src/
├── store/
│   └── useDialogueStore.ts       # Zustand store tracking the narrative phase
├── components/
│   ├── audio/
│   │   └── AudioAnalyzerNode.tsx # Web Audio API integration
│   └── episodes/
│       └── episode1/
│           ├── ZombieCapitol.tsx # Main Scene component
│           ├── LittlePresident.tsx # Dr. Drew Avatar
│           └── shaders/
│               ├── ZombieVertex.glsl   # Flesh-melting math
│               └── ZombieFragment.glsl # Audio-reactive palette lerp
```

**Structure Decision**: A dedicated `episodes/episode1/` directory is created to encapsulate all Level 1 specific assets and shaders, preventing pollution of the global `/components` folder.

## Complexity Tracking

None. The separation of Audio analysis into its own node and the Shader math into external `.glsl` files ensures strict, maintainable modularity.
