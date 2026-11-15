import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { LayoutOverlay } from '../components/ui/LayoutOverlay';
import { useLevelStore } from '../store/useLevelStore';
import { useDialogueStore } from '../store/useDialogueStore';

describe('LayoutOverlay Component', () => {
  beforeEach(() => {
    useLevelStore.setState({
      activeLevelId: 0,
      isMenuOpen: false,
      scrollProgress: 0.5,
    });
    useDialogueStore.setState({
      isMuted: false,
      audioState: 'running',
    });
  });

  it('should render Spacecast HUD and telemetry for the Hub level', () => {
    render(<LayoutOverlay />);

    expect(screen.getByText('SPACECAST')).toBeDefined();
    expect(screen.getByText('SIMULATOR DIAGNOSTICS')).toBeDefined();
    expect(screen.getByText(/Simulation Farmer Online/)).toBeDefined();
  });

  it('should render accurate episode telemetry when active level changes', () => {
    useLevelStore.setState({ activeLevelId: 1 });
    render(<LayoutOverlay />);

    expect(screen.getByText(/98.7% Zombie Overrun/)).toBeDefined();
  });

  it('should render canonical show lore guest for Episode 8 (Mouse of Silver)', () => {
    useLevelStore.setState({ activeLevelId: 8 });
    render(<LayoutOverlay />);

    expect(screen.getByText(/Mom \(Deneen Fendig\)/)).toBeDefined();
    expect(screen.getByText(/Life Cycle in Transit/)).toBeDefined();
  });

  it('should toggle menu open state when dimension selector button is clicked', () => {
    render(<LayoutOverlay />);

    const menuButton = screen.getByText('LEVELS');
    fireEvent.click(menuButton);

    expect(useLevelStore.getState().isMenuOpen).toBe(true);
  });

  it('should toggle mute state when audio speaker button is clicked', () => {
    render(<LayoutOverlay />);

    const muteButton = screen.getByTitle('Toggle Ambient Audio');
    fireEvent.click(muteButton);

    expect(useDialogueStore.getState().isMuted).toBe(true);
  });

  it('should display prompt to enable audio when audioState is suspended or uninitialized', () => {
    useDialogueStore.setState({ audioState: 'suspended' });
    render(<LayoutOverlay />);

    expect(screen.getByText(/INITIATE AUDIO/i)).toBeDefined();
  });
});
