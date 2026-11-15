import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NavigationMenu } from '../components/ui/NavigationMenu';
import { useLevelStore } from '../store/useLevelStore';

vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop: string) => {
        return React.forwardRef(
          ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }, ref: React.ForwardedRef<unknown>) =>
            React.createElement(prop, { ...props, ref }, children)
        );
      },
    }
  ),
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

describe('NavigationMenu Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useLevelStore.setState({
      activeLevelId: 0,
      isMenuOpen: true,
      isTransitioning: false,
    });
  });

  it('should render all levels including the Hub and Level 8', () => {
    render(<NavigationMenu />);

    // Verify header
    expect(screen.getByText('MULTIVERSE SIMULATOR INDEX')).toBeDefined();

    // Verify levels render
    expect(screen.getByText('CHROMATIC RIBBON')).toBeDefined();
    expect(screen.getByText('ZOMBIE CAPITOL')).toBeDefined();
    expect(screen.getByText('LIFE CYCLE TRAINWORLD')).toBeDefined();
  });

  it('should close menu when close button is clicked', () => {
    render(<NavigationMenu />);

    const closeBtn = screen.getByText('✕ CLOSE');
    fireEvent.click(closeBtn);

    expect(useLevelStore.getState().isMenuOpen).toBe(false);
  });

  it('should trigger level transition and update activeLevelId when selecting a different dimension', () => {
    render(<NavigationMenu />);

    const level1Btn = screen.getByText('ZOMBIE CAPITOL');
    fireEvent.click(level1Btn);

    // Immediately starts transition wipe
    expect(useLevelStore.getState().isTransitioning).toBe(true);
    expect(useLevelStore.getState().isMenuOpen).toBe(false);

    // Fast-forward transition timeout (1000ms)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(useLevelStore.getState().activeLevelId).toBe(1);
    expect(useLevelStore.getState().isTransitioning).toBe(false);
  });

  it('should not trigger transition if selecting the current active level', () => {
    render(<NavigationMenu />);

    const hubBtn = screen.getByText('CHROMATIC RIBBON');
    fireEvent.click(hubBtn);

    expect(useLevelStore.getState().isTransitioning).toBe(false);
    expect(useLevelStore.getState().isMenuOpen).toBe(false);
  });
});
