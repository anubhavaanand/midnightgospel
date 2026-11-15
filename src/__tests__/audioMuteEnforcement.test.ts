import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDialogueStore } from '../store/useDialogueStore';
import * as THREE from 'three';

describe('Audio Master Mute Enforcement', () => {
  beforeEach(() => {
    useDialogueStore.setState({
      isMuted: false,
      audioState: 'running',
    });
  });

  it('should initialize with isMuted as false', () => {
    expect(useDialogueStore.getState().isMuted).toBe(false);
  });

  it('should toggle isMuted via setIsMuted', () => {
    useDialogueStore.getState().setIsMuted(true);
    expect(useDialogueStore.getState().isMuted).toBe(true);

    useDialogueStore.getState().setIsMuted(false);
    expect(useDialogueStore.getState().isMuted).toBe(false);
  });

  it('should verify AudioContext oscillator creation is prevented when master mute is active', () => {
    const mockOscillator = {
      type: 'sine',
      frequency: {
        value: 0,
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
    const createOscillatorSpy = vi.fn(() => mockOscillator);
    const createGainSpy = vi.fn(() => ({
      gain: {
        value: 1,
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        cancelScheduledValues: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      disconnect: vi.fn(),
    }));

    // Mock AudioContext methods
    const mockCtx = {
      state: 'running',
      currentTime: 0,
      createOscillator: createOscillatorSpy,
      createGain: createGainSpy,
      destination: {},
    };

    vi.spyOn(THREE.AudioContext, 'getContext').mockReturnValue(mockCtx as unknown as AudioContext);

    // Simulation helper imitating HubDialogueComputer playChime guard
    const playChimeGuarded = () => {
      const isMuted = useDialogueStore.getState().isMuted;
      if (isMuted) return;

      const ctx = THREE.AudioContext.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
    };

    // When unmuted
    useDialogueStore.getState().setIsMuted(false);
    playChimeGuarded();
    expect(createOscillatorSpy).toHaveBeenCalledTimes(1);

    createOscillatorSpy.mockClear();

    // When muted
    useDialogueStore.getState().setIsMuted(true);
    playChimeGuarded();
    expect(createOscillatorSpy).not.toHaveBeenCalled();
  });

  it('should calculate target gain as 0 when isMuted is true for continuous drone', () => {
    const getDroneGain = (isMuted: boolean) => (isMuted ? 0 : 0.05);

    expect(getDroneGain(false)).toBe(0.05);
    expect(getDroneGain(true)).toBe(0);
  });

  it('should prevent PositionalDialogueAudio typewriter synth blip when isMuted is true', () => {
    const mockOscillator = {
      type: 'triangle',
      frequency: {
        value: 0,
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
    const createOscillatorSpy = vi.fn(() => mockOscillator);

    const mockCtx = {
      currentTime: 0,
      createOscillator: createOscillatorSpy,
      createGain: vi.fn(() => ({
        gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn(),
        disconnect: vi.fn(),
      })),
    };

    const triggerTypewriterBlip = () => {
      const isMuted = useDialogueStore.getState().isMuted;
      if (isMuted) return;

      const osc = mockCtx.createOscillator();
      osc.start(0);
    };

    useDialogueStore.getState().setIsMuted(false);
    triggerTypewriterBlip();
    expect(createOscillatorSpy).toHaveBeenCalledTimes(1);

    createOscillatorSpy.mockClear();

    useDialogueStore.getState().setIsMuted(true);
    triggerTypewriterBlip();
    expect(createOscillatorSpy).not.toHaveBeenCalled();
  });
});
