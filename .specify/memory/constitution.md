<!--
### Sync Impact Report
- Version change: Template → v1.0.0
- List of modified principles:
  - PRINCIPLE 1: [PRINCIPLE_1_NAME] → I. 60 FPS Performance Floor (Mobile Targets)
  - PRINCIPLE 2: [PRINCIPLE_2_NAME] → II. State Isolation (Per-Frame Rendering Rules)
  - PRINCIPLE 3: [PRINCIPLE_3_NAME] → III. Draco Asset Validation (GLB/GLTF Compression)
  - PRINCIPLE 4: [PRINCIPLE_4_NAME] → IV. Decoupled Service Architecture (Google Gemini Isolation)
  - PRINCIPLE 5: [PRINCIPLE_5_NAME] → V. Test-First Rigor (Comprehensive Vitest/JSDOM coverage)
- Added sections:
  - Performance & Asset Budgets
  - Development Workflow & Quality Gates
- Removed sections: None
- Templates requiring updates:
  - plan-template.md: ✅ updated
  - spec-template.md: ✅ updated
  - tasks-template.md: ✅ updated
- Follow-up TODOs: None
-->

# Midnight Gospel 3D Experience Constitution

## Core Principles

### I. 60 FPS Performance Floor (Mobile Targets)
All WebGL/R3F scenes must satisfy a strict 60 FPS minimum execution frame-rate under mobile target emulation. Development iterations must enforce lightweight custom vertex shaders, performative MSDF typography buffers, and strict garbage collection on texture/mesh unmounts to prevent catastrophic memory degradation.

### II. State Isolation (Per-Frame Rendering Rules)
Enforce strict isolation between Zustand narrative stores and React per-frame rendering hooks (`useFrame`). Zero React-state updates or direct set/get interactions are allowed inside rendering loops to prevent rendering overhead, re-render cycles, and frame-rate drops.

### III. Draco Asset Validation (GLB/GLTF Compression)
Compulsory Draco compression for all 3D assets (`.glb` / `.gltf`) and texture compression checks. All meshes must be crunched and clean of redundant vertex parameters before mounting.

### IV. Decoupled Service Architecture (Google Gemini Isolation)
Generative API and network-reliant communication services must be completely decoupled from React viewports. All model fetching logic resides strictly inside dedicated, pure TypeScript service layers (`src/services/`) with robust local fallbacks.

### V. Test-First Rigor (NON-NEGOTIABLE)
We run a rigorous, automated testing gate. Unit and integration tests must validate all store parameters, joystick controller states, and layout transitions before code is reviewed.

## Performance & Asset Budgets
To secure mobile target execution, meshes must be checked for redundant node structures and textures kept at 1024x1024 maximum sizes. Renderer frames must actively invoke `.dispose()` on all geometry and material buffers during portal warps.

## Development Workflow & Quality Gates
Every new multiversal feature is subjected to the strict Speckit SDD Pipeline:
1. Initialize core boundaries via `/speckit.constitution` in `.specify/memory/constitution.md`.
2. Generate user specifications in `specs/01-multiverse/spec.md`.
3. Interrogate technical requirements and gaps via `/speckit.clarify`.
4. Validate compliance checklists under `checklists/requirements.md`.
5. Map architectural state flows in `specs/01-multiverse/plan.md`.
6. Convert roadmap blueprints into tasks in `specs/01-multiverse/tasks.md`.
7. Execute automated cross-checking checks via `/speckit.analyze`.
8. Implement code via automated tasks under `/speckit.implement`.

## Governance
This Constitution supersedes all standard repository practices. Amendments require a semantic version increment:
- **MAJOR:** Principle removal or backward-incompatible structural redefinition.
- **MINOR:** New principle or performance constraint addition.
- **PATCH:** Formatting, clarifications, or non-semantic wording updates.

**Version**: 1.0.0 | **Ratified**: 2026-05-24 | **Last Amended**: 2026-05-24
