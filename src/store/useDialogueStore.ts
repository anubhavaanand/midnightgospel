import { create } from 'zustand';
import { DIALOGUE_TREES, type AIMood } from '../data/dialogues';
import type { LevelId } from '../data/levels';

interface DialogueState {
  progressMap: Record<LevelId, string>;
  activeText: string | null;
  currentMood: AIMood;
  isOpen: boolean;
  openDialogue: (levelId: LevelId) => void;
  advanceNode: (levelId: LevelId) => void;
  closeDialogue: () => void;
}

export const useDialogueStore = create<DialogueState>((set, get) => ({
  progressMap: {} as Record<LevelId, string>,
  activeText: null,
  currentMood: { intensity: 0, colorTarget: '#000000', speed: 1.0 },
  isOpen: false,

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
        currentMood: nextNode.mood,
        progressMap: { ...state.progressMap, [levelId]: nextId }
      }));
    } else {
      get().closeDialogue();
    }
  },

  closeDialogue: () => {
    set({ isOpen: false });
  }
}));
