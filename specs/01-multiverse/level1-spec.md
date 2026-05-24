# Feature Specification: Level 1 Dialogue System

**Feature Branch**: `004-zombie-capitol-dialogue`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User workflow progression for Level 1 Dialogue constraints.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Proximity Attention Catcher
Clancy approaches the President in the Level 1 environment. When he gets close enough, a spatial UI bubble appears calling out to him.
*   **Why this priority:** Guides the player to the interactive narrative points without intrusive full-screen UI.
*   **Independent Test:** Verify that `NPCAttentionCatcher` mounts and displays the prompt only when $R < 5$ units.
*   **Acceptance Scenarios:**
    1.  **Given** Clancy is near the President, **When** he stops moving, **Then** the "Come talk!" floating UI bubble appears.

### User Story 2 - Verbatim Narrative Playback
Clancy clicks the prompt to talk. The `KineticDialogue` UI takes over, rendering the exact dialogue from the podcast transcript sequentially.
*   **Why this priority:** Non-negotiable fidelity to the podcast transcript (Absurdist, Philosophical, Conclusion branches).
*   **Independent Test:** Verify that advancing the dialogue node pulls the exact string and mood from `ep1_zombie_capitol.json`.
*   **Acceptance Scenarios:**
    1.  **Given** the dialogue is active, **When** the user clicks "Next", **Then** the text updates to the next JSON node and the kinetic text colors transition smoothly to match the new mood.

---

## Requirements *(mandatory)*

### Functional Requirements
*   **FR-001:** The dialogue system MUST load nodes from `ep1_zombie_capitol.json`.
*   **FR-002:** The `useDialogueStore` MUST track the current node, speaker, and dialogue branch.
*   **FR-003:** The 3D text MUST use MSDF (Multi-channel Signed Distance Field) fonts for crisp, performant rendering at any scale.

### Key Entities
*   **`useDialogueStore`:** The Zustand store managing the conversation state tree.
*   **`KineticDialogue.tsx`:** The 3D visualizer that renders the current node's text.
*   **`NPCAttentionCatcher.tsx`:** The proximity trigger that initiates the dialogue state.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes
*   **SC-001:** Advancing dialogue nodes causes zero frame drops on the main WebGL canvas.
*   **SC-002:** Dialogue text matches the source JSON transcript with 100% accuracy.
