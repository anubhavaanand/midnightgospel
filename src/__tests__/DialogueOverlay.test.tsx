import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DialogueOverlay } from '../components/ui/DialogueOverlay';
import { useDialogueStore } from '../store/useDialogueStore';
import { useLevelStore } from '../store/useLevelStore';

vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop: string) => {
        return React.forwardRef(({ children, ...props }: any, ref: any) =>
          React.createElement(prop, { ...props, ref }, children)
        );
      },
    }
  ),
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

describe('DialogueOverlay Component', () => {
  beforeEach(() => {
    useLevelStore.setState({ activeLevelId: 1 });
    useDialogueStore.setState({
      isOpen: true,
      activeText: 'Welcome to Earth 4-16',
      activeSpeaker: 'Glasses Man',
      currentMood: { intensity: 0.8, colorTarget: '#14C832', speed: 1.0 },
    });
  });

  it('should render dialogue speaker and dialogue text when open', () => {
    render(<DialogueOverlay />);

    expect(screen.getByText('Glasses Man')).toBeDefined();
    expect(
      screen.getByText((_content, element) => element?.tagName.toLowerCase() === 'p' && (element?.textContent?.includes('Welcome to Earth 4-16') ?? false))
    ).toBeDefined();
  });

  it('should not render anything when isOpen is false', () => {
    useDialogueStore.setState({ isOpen: false });
    const { container } = render(<DialogueOverlay />);
    expect(container.firstChild).toBeNull();
  });

  it('should close dialogue when skip button is clicked', () => {
    render(<DialogueOverlay />);

    const skipButton = screen.getByText(/Skip/i);
    fireEvent.click(skipButton);

    expect(useDialogueStore.getState().isOpen).toBe(false);
  });

  it('should advance dialogue on Space or Enter keydown when dialogue is open', () => {
    const advanceSpy = vi.spyOn(useDialogueStore.getState(), 'advanceNode');
    render(<DialogueOverlay />);

    fireEvent.keyDown(window, { code: 'Space' });
    expect(advanceSpy).toHaveBeenCalled();
  });

  it('should NOT intercept or prevent Space key when user is typing in an input element', () => {
    render(
      <div>
        <DialogueOverlay />
        <input data-testid="chat-input" type="text" />
      </div>
    );

    const input = screen.getByTestId('chat-input');
    input.focus();

    const advanceSpy = vi.spyOn(useDialogueStore.getState(), 'advanceNode');
    advanceSpy.mockClear();

    const spaceEvent = new KeyboardEvent('keydown', { code: 'Space', bubbles: true });
    input.dispatchEvent(spaceEvent);

    expect(advanceSpy).not.toHaveBeenCalled();
  });
});
