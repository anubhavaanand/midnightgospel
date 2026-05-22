# Implementation Tasks: Zombie Capitol

## Phase 1: Foundational Setup (Audio & State)
- [x] T001 [P] Create the narrative state manager in `src/store/useDialogueStore.ts` defining `CHAOS_INTRO`, `DEBATE`, `ACCEPTANCE_TURN`, `CURE_COLLAPSE`, `ZOMBIE_MUSICAL`.
- [x] T002 Implement `src/components/audio/AudioAnalyzerNode.tsx` using the Web Audio API to compute `bass`, `mid`, `treble`, `rms` uniformly.

## Phase 2: Cognitive Dissonance Visuals [US1] & [US2]
- [x] T003 [P] [US1] Write the melting vertex math in `src/components/episodes/episode1/shaders/ZombieVertex.glsl`.
- [x] T004 [P] [US1] Write the 3-palette lerp logic in `src/components/episodes/episode1/shaders/ZombieFragment.glsl`.
- [x] T005 [P] [US1] Create the `LittlePresident.tsx` component that pulses its scale directly from the `useDialogueStore` audio metrics.
- [x] T006 [US2] Create the master scene `src/components/episodes/episode1/ZombieCapitol.tsx` to mount the shaders and pipe the `AudioAnalyzerNode` uniforms to the materials.


## Phase 3: Integration & Polish
- [x] T007 Mount `<ZombieCapitol />` into the main `App.tsx` router or portal entry point.
- [x] T008 Perform a local performance audit ensuring the Vertex shader does not drop frames below 60fps on chaotic audio spikes.

