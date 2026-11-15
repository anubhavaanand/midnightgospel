import type { LevelId } from './levels';

import ep1 from './transcripts/ep1.json';
import ep2 from './transcripts/ep2.json';
import ep3 from './transcripts/ep3.json';
import ep4 from './transcripts/ep4.json';
import ep5 from './transcripts/ep5.json';
import ep6 from './transcripts/ep6.json';
import ep7 from './transcripts/ep7.json';
import ep8 from './transcripts/ep8.json';

export interface AIMood {
  intensity: number;
  colorTarget: string;
  speed: number;
}

export interface ActiveQuest {
  recommendedLevel: number;
  recommendedNPC: string;
  userContext: string;
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
  1: ep1 as unknown as DialogueTree,
  2: ep2 as unknown as DialogueTree,
  3: ep3 as unknown as DialogueTree,
  4: ep4 as unknown as DialogueTree,
  5: ep5 as unknown as DialogueTree,
  6: ep6 as unknown as DialogueTree,
  7: ep7 as unknown as DialogueTree,
  8: ep8 as unknown as DialogueTree,
  9: {
    levelId: 9,
    startNodeId: 'core-1',
    nodes: {
      'core-1': {
        id: 'core-1',
        speaker: 'Simulator Core',
        text: 'CRITICAL SYSTEM STATUS: Bio-organic simulator core wobbling... All realities are merging into pure consciousness.',
        mood: { intensity: 0.8, colorTarget: '#00FFCC', speed: 2.0 },
        nextNodeId: 'core-2',
      },
      'core-2': {
        id: 'core-2',
        speaker: 'Clancy',
        text: 'Wait, Computer! If all the simulated worlds are collapsing, what happens to the spacecast? Where do we go now?',
        mood: { intensity: 0.9, colorTarget: '#FF007F', speed: 1.8 },
        nextNodeId: 'core-3',
      },
      'core-3': {
        id: 'core-3',
        speaker: 'Simulator Core',
        text: 'Nowhere to go, Master. You cry, you let go, and you just be here now.',
        mood: { intensity: 0.5, colorTarget: '#00FFCC', speed: 1.2 },
        nextNodeId: null,
      },
    },
  },
};
