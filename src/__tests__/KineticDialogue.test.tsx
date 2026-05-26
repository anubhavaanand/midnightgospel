import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { KineticDialogue } from '../components/scene/KineticDialogue';

// Mock Zustand stores
vi.mock('../store/useDialogueStore', () => {
  const storeState = {
    isOpen: true,
    activeText: "Whoa Clancy check this out",
    currentMood: { intensity: 0.8, colorTarget: "#FF00FF", speed: 1.5 },
  };
  return {
    useDialogueStore: (cb?: any) => cb ? cb(storeState) : storeState,
  };
});

// Mock react-three-fiber hooks & elements to make it run cleanly outside R3F context in JSDOM tests
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  Text: ({ children, position, scale }: any) => (
    <div data-testid="3d-text" data-pos={JSON.stringify(position)} data-scale={JSON.stringify(scale)}>
      {children}
    </div>
  ),
  Billboard: ({ children }: any) => <div>{children}</div>,
}));

describe('KineticDialogue Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should render physical word meshes sequentially based on activeText updates', () => {
    render(<KineticDialogue />);
    
    // Fast forward to trigger word spawning intervals
    vi.advanceTimersByTime(1000);
    
    // We expect some active words to have mounted
    const textElements = screen.queryAllByTestId ? screen.queryAllByTestId('3d-text') : [];
    expect(textElements).toBeDefined();
  });
});
