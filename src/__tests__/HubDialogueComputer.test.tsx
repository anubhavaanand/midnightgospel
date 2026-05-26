import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HubDialogueComputer } from '../components/ui/HubDialogueComputer';

// Mock framer-motion to bypass animation delays in JSDOM tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style, className, onClick }: any) => (
      <div style={style} className={className} onClick={onClick}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the Zustand stores
vi.mock('../store/useDialogueStore', () => ({
  useDialogueStore: (cb: any) => cb({
    setActiveQuest: vi.fn(),
  })
}));

vi.mock('../store/useLevelStore', () => ({
  useLevelStore: (cb: any) => cb({
    activeLevelId: 0, // In Hub
    setLevel: vi.fn(),
    setTransitioning: vi.fn(),
  })
}));

describe('HubDialogueComputer Component', () => {
  it('should render the input element when expanded', () => {
    render(<HubDialogueComputer />);
    expect(screen.getByPlaceholderText(/speak to the computer/i)).toBeDefined();
  });

  it('should toggle to minimized state on clicking minimize button', () => {
    render(<HubDialogueComputer />);
    const minBtn = screen.getByRole('button', { name: /_/i });
    fireEvent.click(minBtn);
    
    expect(screen.queryByPlaceholderText(/speak to the computer/i)).toBeNull();
    expect(screen.getByText(/Simulation Computer/i)).toBeDefined();
  });
});
