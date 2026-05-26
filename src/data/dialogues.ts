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
};
