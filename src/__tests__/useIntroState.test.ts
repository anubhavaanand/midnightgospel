import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIntroState } from '../components/intro/useIntroState';

const createStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

const storageMock = createStorageMock();

Object.defineProperty(window, 'localStorage', {
  value: storageMock,
  writable: true,
});
Object.defineProperty(globalThis, 'localStorage', {
  value: storageMock,
  writable: true,
});

describe('useIntroState Hook', () => {
  beforeEach(() => {
    storageMock.clear();
  });

  it('should initialize hasSeenIntro as false when localStorage is empty', () => {
    const { result } = renderHook(() => useIntroState());
    expect(result.current.hasSeenIntro).toBe(false);
  });

  it('should initialize hasSeenIntro as true when localStorage has seen flag', () => {
    localStorage.setItem('midnight-intro-seen', 'true');
    const { result } = renderHook(() => useIntroState());
    expect(result.current.hasSeenIntro).toBe(true);
  });

  it('should mark intro as seen and persist to localStorage', () => {
    const { result } = renderHook(() => useIntroState());
    act(() => {
      result.current.markIntroSeen();
    });
    expect(result.current.hasSeenIntro).toBe(true);
    expect(localStorage.getItem('midnight-intro-seen')).toBe('true');
  });

  it('should reset intro and remove from localStorage', () => {
    localStorage.setItem('midnight-intro-seen', 'true');
    const { result } = renderHook(() => useIntroState());
    act(() => {
      result.current.resetIntro();
    });
    expect(result.current.hasSeenIntro).toBe(false);
    expect(localStorage.getItem('midnight-intro-seen')).toBeNull();
  });
});
