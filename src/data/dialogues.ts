import type { LevelId } from './levels';

export interface AIMood {
  intensity: number;
  colorTarget: string;
  speed: number;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  mood: AIMood;
  nextNodeId: string | null;
}

export interface DialogueTree {
  levelId: LevelId;
  nodes: Record<string, DialogueNode>;
  startNodeId: string;
}

export const DIALOGUE_TREES: Partial<Record<LevelId, DialogueTree>> = {
  0: {
    levelId: 0,
    startNodeId: 'hub-1',
    nodes: {
      'hub-1': {
        id: 'hub-1',
        speaker: 'Clancy',
        text: "Whoa... where am I? Is this the Chromatic Ribbon? My simulator is actually working!",
        mood: { intensity: 0.1, colorTarget: '#FF00FF', speed: 1.0 },
        nextNodeId: 'hub-2'
      },
      'hub-2': {
        id: 'hub-2',
        speaker: 'Clancy',
        text: "I should probably stick my head in one of these portals and interview whoever's inside.",
        mood: { intensity: 0.3, colorTarget: '#00FFFF', speed: 1.5 },
        nextNodeId: null
      }
    }
  },
  1: {
    levelId: 1,
    startNodeId: 'ep1-1',
    nodes: {
      'ep1-1': {
        id: 'ep1-1',
        speaker: 'Glasses Man',
        text: "There's no such thing as a bad drug. It's the circumstances and the user.",
        mood: { intensity: 0.8, colorTarget: '#8B0000', speed: 2.0 },
        nextNodeId: 'ep1-2'
      },
      'ep1-2': {
        id: 'ep1-2',
        speaker: 'Clancy',
        text: "So you're saying even the zombies outside aren't inherently bad?",
        mood: { intensity: 0.5, colorTarget: '#14C832', speed: 1.2 },
        nextNodeId: null
      }
    }
  }
};
