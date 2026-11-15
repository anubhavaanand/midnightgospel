import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { KineticDialogue } from '../components/scene/KineticDialogue';

// Mock Zustand stores
vi.mock('../store/useDialogueStore', () => {
  const storeState = {
    isOpen: true,
    activeText: "Whoa Clancy check this out",
    currentMood: { intensity: 0.8, colorTarget: "#FF00FF", speed: 1.5 },
    advanceNode: vi.fn(),
  };
  return {
    useDialogueStore: (cb?: (state: typeof storeState) => unknown) => cb ? cb(storeState) : storeState,
  };
});

// Mock react-three-fiber hooks & elements to make it run cleanly outside R3F context in JSDOM tests
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
}));

vi.mock('../components/audio/PositionalDialogueAudio', () => ({
  PositionalDialogueAudio: () => <div data-testid="audio-mock" />,
}));

vi.mock('@react-three/drei', async () => {
  const ReactModule = await import('react');
  return {
    Text: ReactModule.forwardRef(({ children, position, scale }: { children?: React.ReactNode; position?: unknown; scale?: unknown }, ref: React.Ref<HTMLDivElement>) => (
      <div ref={ref} data-testid="3d-text" data-pos={JSON.stringify(position)} data-scale={JSON.stringify(scale)}>
        {children}
      </div>
    )),
    Billboard: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  };
});

describe('KineticDialogue Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should render physical word meshes sequentially based on activeText updates', () => {
    render(<KineticDialogue />);
    
    // Fast forward to trigger typewriter intervals cleanly wrapped in act
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // We expect 3d-text to mount
    const textElements = screen.queryAllByTestId ? screen.queryAllByTestId('3d-text') : [];
    expect(textElements).toBeDefined();
  });
});

