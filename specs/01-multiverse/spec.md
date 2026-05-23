# Feature Specification: Multiverse Simulator Core

**Feature Branch**: `003-baby-clown-dialogues`

**Created**: 2026-05-24

**Status**: Approved

**Input**: User description: "Core functional requirements: Layout mechanics of the 9-world matrix, the podcast audio-streaming integration, spatial user navigation, and the simulation core interactivity matrix."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Multiversal Layout & World Matrix (Priority: P1)
Clancy stands in his trailer Hub and interacts with the portal terminal. He selects any of the 9 unique simulation levels (Level 0: Hub, Level 1: Zombie Capitol, Level 2: Baby Clown Pastures, Level 3: Trudy's Depth, etc.) to warp seamlessly.
*   **Why this priority:** Fundamental layout mechanism. Clancy cannot enter worlds without a stable selection and portal transition system.
*   **Independent Test:** Verify that selecting a portal from the selection panel triggers a full-screen `<TransitionWipe />`, loads the corresponding level viewport, and updates the narrative status.
*   **Acceptance Scenarios:**
    1.  **Given** Clancy is in the Hub (Level 0), **When** he selects Level 1 and warps, **Then** the screen fades and initializes the Zombie Capitol.
    2.  **Given** Clancy is on a planet, **When** he steps on the "Return to Hub" platform, **Then** he returns safely to Level 0.

### User Story 2 - Podcast Audio-Streaming Integration (Priority: P2)
As Clancy explores a planet, the background audio stream begins playing. Positional, multi-channel streams of the Duncan Trussell Family Hour (DTFH) podcast are fed into real-time audio analysis modules, emitting frequency metrics (bass, mid, treble, rms) that sync visually to the surrounding procedural textures.
*   **Why this priority:** Crucial thematic element of Midnight Gospel. The visually pulsing environment is driven by the dialogue audio.
*   **Independent Test:** Verify that loading a planet starts playing the streaming audio track and generates frequency state metrics in the store.
*   **Acceptance Scenarios:**
    1.  **Given** a planet is active, **When** the audio stream plays, **Then** the global store updates `audioMetrics` at 60fps.
    2.  **Given** Clancy pauses or leaves a planet, **When** the warp transition starts, **Then** the current audio stream is cleanly disposed of.

### User Story 3 - Core Simulator Interactivity Matrix (Priority: P3)
Clancy navigates the 3D environments using his keyboard or virtual mobile touch joysticks, approaching recommended NPCs to trigger spatial calling speech bubbles and branching dialogue overlays.
*   **Why this priority:** Fulfills the interactive gameplay and quest requirements.
*   **Independent Test:** Verify that getting near a guide NPC launches proximity popups and clicking opens dialogue.
*   **Acceptance Scenarios:**
    1.  **Given** Clancy approaches the Baby Clown King, **When** he is within $R < 5$ units, **Then** a floating spatial text box prompts him to talk.
    2.  **Given** Clancy uses a touch-enabled mobile browser, **When** he drags the on-screen joystick, **Then** he moves smoothly across the planet mesh.

### Edge Cases
*   **Audio Loading Stutter:** If an audio stream fails to stream due to network loss, the system must degrade gracefully without crashing the R3F render loop, displaying a local computer glitch state.
*   **Context Loss:** If WebGL2/WebGPU context loss occurs on older mobile devices, the Canvas must render a high-fidelity fallback screen cleanly prompting a simulation reboot.

---

## Requirements *(mandatory)*

### Functional Requirements
*   **FR-001:** The system MUST support a 9-world portal layout matrix indexed from Level 0 (Hub) to Level 8 (Metaphysical Void).
*   **FR-002:** The system MUST support decoupled spatial movement, translating virtual touch gamepad vector outputs (`joystickDelta`) and keyboard keys into movement coordinates.
*   **FR-003:** The system MUST stream positional podcast audio corresponding to each active world.
*   **FR-004:** The system MUST run real-time fast Fourier transform (FFT) analysis on the playing audio stream and update Zustand stores.
*   **FR-005:** NPCs MUST display interactive spatial text billboards when the player is in quest proximity.

### Key Entities
*   **Portal Matrix:** The coordinates and state metadata of all 9 multiversal worlds.
*   **Audio Analyzer Node:** Decoupled HTML5 audio context and frequency analysers.
*   **Narrative Quest:** State containing the `userContext` and `recommendedNPC`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes
*   **SC-001:** The simulator must maintain a stable 60 FPS frame-rate floor under mobile target emulation.
*   **SC-002:** Mesh cleanup routines must completely dispose of materials, textures, and geometry to maintain zero heap leaks upon warp.
*   **SC-003:** Proximity detectors must evaluate spatial coordinates in `useFrame` without causing React state re-renders.

---

## Assumptions
*   **Asset Draco Compression:** All 3D meshes uploaded to the simulator are compressed using Draco validation standards.
*   **Browser Audio Policy:** Audio streaming respects modern browser gesture policies, beginning playback immediately after the user interacts with the canvas or terminal window.
