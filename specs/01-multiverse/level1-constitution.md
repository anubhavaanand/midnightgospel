# Dialogue System Constitution - Level 1 (Zombie Capitol)

## Overview
This document defines the non-negotiable architectural and design principles specifically for the **Dialogue System in Level 1** (Episode 1 - "Taste of the King"). It ensures absolute fidelity to the source material and performant rendering of text in WebGL.

## Core Principles

### I. Absolute Transcript Fidelity (No Hallucinations)
All dialogue interactions with the President/NPCs must adhere strictly to the parsed `ep1_zombie_capitol.json` transcript.
- Generative AI must **NOT** hallucinate or alter any lines of dialogue. 
- Dialogue must be categorized strictly into ABSURDIST, PHILOSOPHICAL, and CONCLUSION branches as they appeared in the show.

### II. Mood-Driven Kinetic Text
The 3D Kinetic Text visualizer (`KineticDialogue.tsx`) must not be static. It must dynamically read the `mood` metadata embedded in the JSON dialogue nodes:
- **Color Targets:** Text must shift colors (e.g., Fuchsia, Cyan, Violet) based on the emotional weight of the specific line.
- **Speed & Scale:** Text animation speed must scale with the intensity of the spoken line.

### III. Decoupled State Management
The progression of dialogue nodes must be managed purely by `useDialogueStore.ts`. 
- The R3F rendering loop must read this state without triggering React re-renders on the canvas itself.

**Version**: 1.1.0 | **Ratified**: 2026-05-24
