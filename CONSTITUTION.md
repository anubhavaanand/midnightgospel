# Midnight Gospel 3D Constitution

## Core Principles

### I. Performance-First 3D
Every 3D component and effect must be optimized for 60 FPS on desktop and 30+ FPS on mobile. Adaptive quality scaling is mandatory to ensure accessibility across devices.

### II. Generative-First Assets
Leverage Gemini AI for runtime asset generation (shaders, voxels, and dynamic textures). The simulation should feel "alive" and evolving, using AI to push the boundaries of procedural storytelling.

### III. Immersive Narrative & "Vibe"
Prioritize the psychedelic, experimental aesthetic of "The Midnight Gospel." Every interaction, transition, and visual effect should contribute to a sense of cosmic wonder and philosophical exploration.

### IV. Type-Safe Architecture
Strict TypeScript enforcement across the entire stack. All R3F components, stores (Zustand), and utility functions must have comprehensive type definitions to ensure stability and maintainability.

### V. Declarative Scene Management
Utilize React Three Fiber (R3F) and Drei for a clean, declarative scene graph. Avoid direct Three.js imperative manipulations unless absolutely necessary for performance or complex logic.

## Technical Stack & Constraints

- **Frontend:** React 18, Vite, TypeScript
- **3D Engine:** Three.js, React Three Fiber, @react-three/drei
- **Physics:** @react-three/rapier (locked to v1.5.x for React 18 compatibility)
- **AI Integration:** Google Gemini (Generative AI SDK)
- **State Management:** Zustand (with persistence)
- **Animation:** GSAP, Framer Motion, Theatre.js
- **Styling:** Tailwind CSS, Post-processing (R3F)

## Development Workflow

- **SDD Compliance:** All major features must follow the Constitution -> Specify -> Clarify -> Plan -> Tasks -> Implement pipeline.
- **Verification:** Changes are only considered complete once verified via local preview and, where applicable, automated tests.
- **Documentation:** Maintain `README.md` and `docs/` as the project evolves to ensure smooth onboarding and architectural clarity.

## Governance
This Constitution is the foundational mandate for Midnight Gospel 3D. Any significant architectural shifts or principle changes must be documented and ratified before implementation.

**Version**: 1.0.0 | **Ratified**: 2026-05-17 | **Last Amended**: 2026-05-17
