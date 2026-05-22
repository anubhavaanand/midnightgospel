import { describe, it, expect, beforeEach } from 'vitest';
import { useDialogueStore } from '../store/useDialogueStore';
import { DIALOGUE_TREES } from '../data/dialogues';

describe('useDialogueStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useDialogueStore.setState({
      progressMap: {} as any,
      activeText: null,
      currentMood: { intensity: 0, colorTarget: '#000000', speed: 1.0 },
      isOpen: false,
    });
  });

  it('should initialize closed with empty state', () => {
    const state = useDialogueStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.activeText).toBe(null);
  });

  it('should open dialogue and set activeText and mood', () => {
    useDialogueStore.getState().openDialogue(0);
    
    const state = useDialogueStore.getState();
    expect(state.isOpen).toBe(true);
    
    // Level 0 starts with 'hub-1'
    const firstNode = DIALOGUE_TREES[0]!.nodes['hub-1'];
    expect(state.activeText).toBe(firstNode.text);
    expect(state.currentMood).toEqual(firstNode.mood);
    expect(state.progressMap[0]).toBe('hub-1');
  });

  it('should advance to the next node and eventually close', () => {
    const store = useDialogueStore.getState();
    
    // Open dialogue
    store.openDialogue(0);
    
    // Advance to 'hub-2'
    useDialogueStore.getState().advanceNode(0);
    
    let state = useDialogueStore.getState();
    const secondNode = DIALOGUE_TREES[0]!.nodes['hub-2'];
    expect(state.activeText).toBe(secondNode.text);
    expect(state.progressMap[0]).toBe('hub-2');
    
    // Advance again, hub-2 has nextNodeId: null, so it should loop to start or close?
    // Based on our implementation: if nextId is null, it loops to startNodeId ('hub-1')
    useDialogueStore.getState().advanceNode(0);
    
    state = useDialogueStore.getState();
    const firstNode = DIALOGUE_TREES[0]!.nodes['hub-1'];
    expect(state.activeText).toBe(firstNode.text);
    expect(state.progressMap[0]).toBe('hub-1');
  });
});
