import type { LevelId } from './levels';

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
  1: {
    levelId: 1,
    startNodeId: 'ep1-1',
    nodes: {
      'ep1-1': {
        id: 'ep1-1',
        speaker: 'Glasses Man',
        text: "I hate this idea of 'good' drugs and 'bad' drugs... it's the relationship that humans have with the substance that is the issue.",
        mood: { intensity: 0.8, colorTarget: '#8B0000', speed: 2.0 },
        nextNodeId: 'ep1-2'
      },
      'ep1-2': {
        id: 'ep1-2',
        speaker: 'Clancy',
        text: "So you're saying health isn't about avoidance, but about our relationship with reality?",
        mood: { intensity: 0.5, colorTarget: '#14C832', speed: 1.2 },
        nextNodeId: 'ep1-3'
      },
      'ep1-3': {
        id: 'ep1-3',
        speaker: 'Glasses Man',
        text: "Exactly. Health is about accepting and perceiving and dealing with reality on reality's terms.",
        mood: { intensity: 0.9, colorTarget: '#8B0000', speed: 2.5 },
        nextNodeId: null
      }
    }
  },
  2: {
    levelId: 2,
    startNodeId: 'ep2-1',
    nodes: {
      'ep2-1': {
        id: 'ep2-1',
        speaker: 'Baby Clown King',
        text: "We all wear makeup in this life. But when you take it off... what remains?",
        mood: { intensity: 0.3, colorTarget: '#FFB6C1', speed: 0.5 },
        nextNodeId: 'ep2-2'
      },
      'ep2-2': {
        id: 'ep2-2',
        speaker: 'Clancy',
        text: "Are you talking about death? Like, peeling back the layers?",
        mood: { intensity: 0.5, colorTarget: '#FFFACD', speed: 0.8 },
        nextNodeId: 'ep2-3'
      },
      'ep2-3': {
        id: 'ep2-3',
        speaker: 'Baby Clown King',
        text: "Death is just the ultimate stage wipe. The performance never actually ends, the audience just changes.",
        mood: { intensity: 0.8, colorTarget: '#FF69B4', speed: 1.5 },
        nextNodeId: null
      }
    }
  },
  3: {
    levelId: 3,
    startNodeId: 'ep3-1',
    nodes: {
      'ep3-1': {
        id: 'ep3-1',
        speaker: 'Fish Mage',
        text: "You think magic is pulling rabbits from hats. True magic is altering your own consciousness.",
        mood: { intensity: 0.4, colorTarget: '#4682B4', speed: 1.2 },
        nextNodeId: 'ep3-2'
      },
      'ep3-2': {
        id: 'ep3-2',
        speaker: 'Clancy',
        text: "So meditation is a form of magic?",
        mood: { intensity: 0.2, colorTarget: '#FFFDD0', speed: 0.6 },
        nextNodeId: 'ep3-3'
      },
      'ep3-3': {
        id: 'ep3-3',
        speaker: 'Fish Mage',
        text: "The greatest form. It's the alchemy of turning the lead of your anxieties into the gold of presence.",
        mood: { intensity: 0.7, colorTarget: '#1E90FF', speed: 1.8 },
        nextNodeId: null
      }
    }
  },
  4: {
    levelId: 4,
    startNodeId: 'ep4-1',
    nodes: {
      'ep4-1': {
        id: 'ep4-1',
        speaker: 'Knight',
        text: "I must avenge my fallen brother. Blood for blood.",
        mood: { intensity: 0.9, colorTarget: '#FF4500', speed: 2.0 },
        nextNodeId: 'ep4-2'
      },
      'ep4-2': {
        id: 'ep4-2',
        speaker: 'Clancy',
        text: "But won't that just create another brother who wants vengeance?",
        mood: { intensity: 0.6, colorTarget: '#FFA500', speed: 1.5 },
        nextNodeId: 'ep4-3'
      },
      'ep4-3': {
        id: 'ep4-3',
        speaker: 'Knight',
        text: "Forgiveness is a heavier sword to lift... but perhaps the only one that cuts the chain.",
        mood: { intensity: 0.3, colorTarget: '#8B4513', speed: 0.5 },
        nextNodeId: null
      }
    }
  },
  5: {
    levelId: 5,
    startNodeId: 'ep5-1',
    nodes: {
      'ep5-1': {
        id: 'ep5-1',
        speaker: 'Inmate',
        text: "We die, we're reborn, we die again. It's an endless karmic loop. A prison of our own making.",
        mood: { intensity: 0.8, colorTarget: '#8A2BE2', speed: 1.0 },
        nextNodeId: 'ep5-2'
      },
      'ep5-2': {
        id: 'ep5-2',
        speaker: 'Clancy',
        text: "How do we escape? Do we just... stop playing?",
        mood: { intensity: 0.4, colorTarget: '#00CED1', speed: 0.8 },
        nextNodeId: 'ep5-3'
      },
      'ep5-3': {
        id: 'ep5-3',
        speaker: 'Inmate',
        text: "You can't break the walls. You have to realize there are no walls. The bird flies out when it stops fighting the cage.",
        mood: { intensity: 0.9, colorTarget: '#9400D3', speed: 1.5 },
        nextNodeId: null
      }
    }
  },
  6: {
    levelId: 6,
    startNodeId: 'ep6-1',
    nodes: {
      'ep6-1': {
        id: 'ep6-1',
        speaker: 'Teacher',
        text: "Sit down. Close your eyes. Notice your breath. Let the thoughts pass like clouds.",
        mood: { intensity: 0.1, colorTarget: '#20B2AA', speed: 0.2 },
        nextNodeId: 'ep6-2'
      },
      'ep6-2': {
        id: 'ep6-2',
        speaker: 'Clancy',
        text: "It's so loud in here... I can't stop thinking about the simulator.",
        mood: { intensity: 0.5, colorTarget: '#F0E68C', speed: 1.0 },
        nextNodeId: 'ep6-3'
      },
      'ep6-3': {
        id: 'ep6-3',
        speaker: 'Teacher',
        text: "Don't fight the noise. Listen to it. The silence you seek is the space containing the noise.",
        mood: { intensity: 0.2, colorTarget: '#3CB371', speed: 0.3 },
        nextNodeId: null
      }
    }
  },
  7: {
    levelId: 7,
    startNodeId: 'ep7-1',
    nodes: {
      'ep7-1': {
        id: 'ep7-1',
        speaker: 'Death',
        text: "I am the shadow you cast. You run, but you always carry me with you.",
        mood: { intensity: 0.7, colorTarget: '#000000', speed: 0.5 },
        nextNodeId: 'ep7-2'
      },
      'ep7-2': {
        id: 'ep7-2',
        speaker: 'Clancy',
        text: "Are you going to hurt me?",
        mood: { intensity: 0.8, colorTarget: '#F58DFF', speed: 1.8 },
        nextNodeId: 'ep7-3'
      },
      'ep7-3': {
        id: 'ep7-3',
        speaker: 'Death',
        text: "I only hurt when you resist. Embrace me, and you'll find I am simply the soil for your next seed.",
        mood: { intensity: 0.4, colorTarget: '#2F6C8F', speed: 0.6 },
        nextNodeId: null
      }
    }
  },
  8: {
    levelId: 8,
    startNodeId: 'ep8-1',
    nodes: {
      'ep8-1': {
        id: 'ep8-1',
        speaker: 'Mom',
        text: "It's okay to cry, Clancy. The heart breaks so it can open wider.",
        mood: { intensity: 0.6, colorTarget: '#DC143C', speed: 1.0 },
        nextNodeId: 'ep8-2'
      },
      'ep8-2': {
        id: 'ep8-2',
        speaker: 'Clancy',
        text: "I don't want you to go. I don't want the simulation to end.",
        mood: { intensity: 0.9, colorTarget: '#FFD700', speed: 2.0 },
        nextNodeId: 'ep8-3'
      },
      'ep8-3': {
        id: 'ep8-3',
        speaker: 'Mom',
        text: "Just be here now. Presence is the only place where we are truly immortal.",
        mood: { intensity: 0.2, colorTarget: '#FFC0CB', speed: 0.5 },
        nextNodeId: null
      }
    }
  }
};
