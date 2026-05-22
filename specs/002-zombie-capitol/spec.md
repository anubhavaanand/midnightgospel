# Feature Specification: Zombie Capitol (Episode 1)

**Feature Branch**: `[002-zombie-capitol]`

**Created**: 2026-05-22

**Status**: Draft

**Input**: User description: "Researching Episode 1: Taste of the King. Cognitive dissonance between calm audio and chaotic, melting zombie apocalypse visuals."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cognitive Dissonance Introduction (Priority: P1)

The player spawns into Episode 1 and is immediately subjected to the dissonance between a calm, intellectual podcast interview (Dr. Drew) and a horrifying, visually melting zombie apocalypse.

**Why this priority**: This establishes the core aesthetic and thematic hook of the entire simulator. It teaches the player that the environment reacts to the dialogue's emotional weight.

**Independent Test**: Can be fully tested by loading the level and observing the `chaosFactor` uniformly driving the Vertex Shader melt and the audio-reactive pulse without crashing the WebGL context.

**Acceptance Scenarios**:
1. **Given** the episode phase is `CHAOS_INTRO`, **When** the audio RMS spikes (loud noises/zombies), **Then** the Vertex Shader melt distortion (`meltAmount`) increases, sagging the geometry downwards.
2. **Given** the episode phase is `DEBATE`, **When** the environment renders, **Then** the color palette lerps towards the toxic neon `#FF5EBC` and `#9CD93A` palette.

---

### User Story 2 - The Acceptance Turn (Priority: P2)

As the conversation shifts toward mindfulness and "dealing with reality on reality's terms," the violent environment visually yields to a softer, eerie calm, culminating in the "Zombie Musical" surrender.

**Why this priority**: The resolution of the thematic arc is necessary for the episode to feel complete, otherwise it's just endless chaos.

**Independent Test**: Can be independently tested by forcing the `phase` state to `ZOMBIE_MUSICAL` and verifying the Fragment Shader successfully interpolates to the pastel palette.

**Acceptance Scenarios**:
1. **Given** the `useDialogueStore` triggers the `ACCEPTANCE_TURN` state, **When** Dr. Drew speaks the key quote on reality, **Then** the Post-Processing chromatic aberration effect smoothly decreases.
2. **Given** the episode reaches the `ZOMBIE_MUSICAL` state, **When** rendering the scene, **Then** the Fragment Shader smoothly transitions to the 1960s pastel palette (`#9BD7FF`, `#A6F3C0`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST track the episode's narrative progression through 5 distinct phases (`CHAOS_INTRO`, `DEBATE`, `ACCEPTANCE_TURN`, `CURE_COLLAPSE`, `ZOMBIE_MUSICAL`).
- **FR-002**: System MUST capture real-time audio metrics (`bass`, `mid`, `treble`, `rms`) from the dialogue track using the Web Audio API.
- **FR-003**: System MUST feed the current `phase` and audio metrics into custom WebGL Uniforms (`uChaosFactor`, `uAcceptanceFactor`, `uRMS`) every render frame.
- **FR-004**: System MUST apply a custom Vertex Shader to level geometry (buildings, zombies) that displaces vertices along their normals and sags downwards based on `uChaosFactor`.
- **FR-005**: System MUST apply a custom Fragment Shader that lerps between three distinct color palettes (Chaos, Neutral, Musical) based on the narrative phase.

### Key Entities 

- **EpisodeClock**: A Zustand store state managing the current narrative `phase` and the exact timestamp of the dialogue.
- **AudioAnalyzer**: A non-rendering utility that computes Fast Fourier Transform (FFT) data from the audio track and normalizes it to 0.0-1.0 ranges.
- **ShaderUniforms**: The bridge data layer that maps Zustand/Audio state to the GPU each frame.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The custom Vertex and Fragment shaders execute at a stable 60 FPS on desktop and 30 FPS on mobile.
- **SC-002**: The shader `uChaosFactor` and `uAcceptanceFactor` transitions occur seamlessly over a 5-second interpolation window without sudden popping.
- **SC-003**: The audio-reactive displacement syncs visually with the dialogue track with less than 50ms of latency.

## Assumptions

- We are assuming the player's device supports WebGL 2.0 (already verified by `App.tsx` fallback).
- We assume the Dr. Drew audio track is pre-loaded or streams fast enough to prevent desync with the internal `EpisodeClock`.
- We assume complex meshes (like the White House) will be heavily decimated (low poly) to allow the Vertex Shader noise function to run performantly.
