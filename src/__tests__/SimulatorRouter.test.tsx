import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SimulatorRouter } from '../components/scene/SimulatorRouter';
import { useLevelStore } from '../store/useLevelStore';

// Mock R3F Html component to render normal DOM div
vi.mock('@react-three/drei', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@react-three/drei')>();
  return {
    ...actual,
    Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

// Mock lazy level components relative to SimulatorRouter.tsx
vi.mock('../levels/Hub/ChromaticRibbon', () => ({
  default: () => <div data-testid="hub-level">Chromatic Ribbon Hub</div>,
}));

vi.mock('../levels/Episode1/ZombieCapitol', () => ({
  default: () => {
    throw new Error('GLTF parsing failed for WhiteHouse model');
  },
}));

describe('SimulatorRouter and LevelErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    useLevelStore.setState({ activeLevelId: 0 });
  });

  it('should render active level successfully when no error occurs', async () => {
    render(<SimulatorRouter />);
    expect(await screen.findByTestId('hub-level')).toBeDefined();
  });

  it('should catch level crashes, display paradox fallback UI and provide return to hub button', async () => {
    useLevelStore.setState({ activeLevelId: 1 });
    render(<SimulatorRouter />);

    expect(await screen.findByText(/SIMULATION PARADOX \/\/ LEVEL ERROR/i)).toBeDefined();
    expect(screen.getByText(/GLTF parsing failed for WhiteHouse model/i)).toBeDefined();

    const returnBtn = screen.getByText(/RETURN TO HUB/i);
    expect(returnBtn).toBeDefined();

    fireEvent.click(returnBtn);
    expect(useLevelStore.getState().activeLevelId).toBe(0);
  });

  it('should reset document body cursor to auto when changing levels', () => {
    document.body.style.cursor = 'pointer';
    render(<SimulatorRouter />);
    expect(document.body.style.cursor).toBe('auto');
  });
});
