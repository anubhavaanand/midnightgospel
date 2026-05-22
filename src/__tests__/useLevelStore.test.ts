import { describe, it, expect, beforeEach } from 'vitest';
import { useLevelStore } from '../store/useLevelStore';

describe('useLevelStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useLevelStore.setState({
      activeLevelId: 0,
      previousLevelId: null,
      isTransitioning: false,
    });
  });

  it('should initialize with Hub level (0)', () => {
    const state = useLevelStore.getState();
    expect(state.activeLevelId).toBe(0);
    expect(state.isTransitioning).toBe(false);
  });

  it('should set level and remember previous level', () => {
    useLevelStore.getState().setLevel(1);
    
    const state = useLevelStore.getState();
    expect(state.activeLevelId).toBe(1);
    expect(state.previousLevelId).toBe(0);
  });

  it('should toggle transitioning state', () => {
    useLevelStore.getState().setTransitioning(true);
    expect(useLevelStore.getState().isTransitioning).toBe(true);
    
    useLevelStore.getState().setTransitioning(false);
    expect(useLevelStore.getState().isTransitioning).toBe(false);
  });
});
