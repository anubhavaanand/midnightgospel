import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HubComputerChat } from '../components/ui/HubComputerChat';

describe('HubComputerChat Component', () => {
  it('should render the chat input', () => {
    render(<HubComputerChat />);
    expect(screen.getByPlaceholderText(/what's on your mind/i)).toBeDefined();
  });
});
