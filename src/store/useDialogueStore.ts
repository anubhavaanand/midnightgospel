import { create } from 'zustand';
import { DIALOGUE_TREES, type AIMood, type ActiveQuest } from '../data/dialogues';
import type { LevelId } from '../data/levels';

export type NarrativePhase = 'CHAOS_INTRO' | 'DEBATE' | 'ACCEPTANCE_TURN' | 'CURE_COLLAPSE' | 'ZOMBIE_MUSICAL';

interface DialogueState {
  progressMap: Record<LevelId, string>;
  activeText: string | null;
  activeSpeaker: string | null;
  currentMood: AIMood;
  isOpen: boolean;
  narrativePhase: NarrativePhase;
  audioMetrics: {
    bass: number;
    mid: number;
    treble: number;
    rms: number;
  };
  activeQuest: ActiveQuest | null;
  openDialogue: (levelId: LevelId) => void;
  advanceNode: (levelId: LevelId) => void;
  closeDialogue: () => void;
  setNarrativePhase: (phase: NarrativePhase) => void;
  updateAudioMetrics: (metrics: Partial<DialogueState['audioMetrics']>) => void;
  setActiveQuest: (quest: ActiveQuest | null) => void;
}

export const useDialogueStore = create<DialogueState>((set, get) => ({
  progressMap: {} as Record<LevelId, string>,
  activeText: null,
  activeSpeaker: null,
  currentMood: { intensity: 0, colorTarget: '#000000', speed: 1.0 },
  isOpen: false,
  narrativePhase: 'CHAOS_INTRO',
  audioMetrics: { bass: 0, mid: 0, treble: 0, rms: 0 },
  activeQuest: null,

  openDialogue: (levelId: LevelId) => {
    const tree = DIALOGUE_TREES[levelId];
    if (!tree) return;

    let nodeId = get().progressMap[levelId];
    if (!nodeId) {
      nodeId = tree.startNodeId;
    }

    const node = tree.nodes[nodeId];
    if (node) {
      set((state) => ({
        isOpen: true,
        activeText: node.text,
        activeSpeaker: node.speaker,
        currentMood: node.mood,
        progressMap: { ...state.progressMap, [levelId]: nodeId }
      }));
    }
  },

  advanceNode: (levelId: LevelId) => {
    const tree = DIALOGUE_TREES[levelId];
    if (!tree) return;

    const currentId = get().progressMap[levelId];
    if (!currentId) return;

    const currentNode = tree.nodes[currentId];
    if (!currentNode) return;

    let nextId = currentNode.nextNodeId;
    if (!nextId) {
      // Loop back to the start if at the end of the conversation tree
      nextId = tree.startNodeId;
    }

    const nextNode = tree.nodes[nextId];
    if (nextNode) {
      set((state) => ({
        activeText: nextNode.text,
        activeSpeaker: nextNode.speaker,
        currentMood: nextNode.mood,
        progressMap: { ...state.progressMap, [levelId]: nextId }
      }));
    } else {
      get().closeDialogue();
    }
  },

  closeDialogue: () => {
    set({ isOpen: false, activeText: null, activeSpeaker: null });
  },

  setNarrativePhase: (phase: NarrativePhase) => set({ narrativePhase: phase }),
  
  updateAudioMetrics: (metrics) => set((state) => ({ 
    audioMetrics: { ...state.audioMetrics, ...metrics } 
  })),

  setActiveQuest: (quest) => set({ activeQuest: quest })
}));
