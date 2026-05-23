import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TouchJoystick } from '../components/ui/TouchJoystick';

describe('TouchJoystick Component', () => {
  const originalMaxTouchPoints = navigator.maxTouchPoints;

  beforeEach(() => {
    // Reset maxTouchPoints and ontouchstart
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      configurable: true,
    });
    if ('ontouchstart' in window) {
      // @ts-ignore
      delete window.ontouchstart;
    }
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: originalMaxTouchPoints,
      configurable: true,
    });
  });

  it('should render null on desktop devices', () => {
    const { container } = render(<TouchJoystick />);
    expect(container.firstChild).toBeNull();
  });

  it('should render joystick on touch-enabled mobile devices', () => {
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 5,
      writable: true,
      configurable: true,
    });

    const { container } = render(<TouchJoystick />);
    expect(container.firstChild).not.toBeNull();
  });
});
