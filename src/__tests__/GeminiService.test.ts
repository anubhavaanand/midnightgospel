import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiService } from '../services/gemini';

describe('GeminiService API Client Fallback Logic', () => {
  beforeEach(() => {
    // Mock global fetch to simulate offline/error state in unit tests
    vi.spyOn(global, 'fetch').mockImplementation(() => 
      Promise.reject(new Error("Simulated offline/test network state"))
    );
  });

  it('should procedurally fallback to Level 2 (Baby Clown King) for sad or anxious inputs', async () => {
    const result = await GeminiService.analyzeUserMood("I feel so sad and anxious");
    expect(result.recommendedLevel).toBe(2);
    expect(result.recommendedNPC).toBe("Baby Clown King");
    expect(result.mood.colorTarget).toBe("#FF00FF");
  });

  it('should procedurally fallback to Level 3 (Trudy the Fish) for angry inputs', async () => {
    const result = await GeminiService.analyzeUserMood("I am so angry right now");
    expect(result.recommendedLevel).toBe(3);
    expect(result.recommendedNPC).toBe("Trudy the Fish");
    expect(result.mood.colorTarget).toBe("#FF3366");
  });

  it('should return default cosmic diagnostic parameters for typical positive inputs', async () => {
    const result = await GeminiService.analyzeUserMood("I feel happy today!");
    expect(result.recommendedLevel).toBe(1);
    expect(result.recommendedNPC).toBe("Glasses Man");
  });
});
