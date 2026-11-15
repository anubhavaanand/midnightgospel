import { describe, it, expect } from 'vitest';
import { resolveNativeHeight, computeScale, KNOWN_NATIVE_HEIGHTS } from '../lib/modelScales';

describe('modelScales utility', () => {
  it('should resolve exact native height for known models', () => {
    const url = '/models/level1/zombie_warrior.glb';
    expect(resolveNativeHeight(url, 5.0)).toBe(KNOWN_NATIVE_HEIGHTS[url]);
  });

  it('should fall back to measured height for unknown models if within sane bounds', () => {
    const unknownUrl = '/models/custom/dragon.glb';
    expect(resolveNativeHeight(unknownUrl, 4.2)).toBe(4.2);
  });

  it('should fall back to 1.0 if measured height is sub-sane (too tiny)', () => {
    const unknownUrl = '/models/custom/atom.glb';
    expect(resolveNativeHeight(unknownUrl, 0.001)).toBe(1);
  });

  it('should fall back to 1.0 if measured height is mega-sane (too massive)', () => {
    const unknownUrl = '/models/custom/galaxy.glb';
    expect(resolveNativeHeight(unknownUrl, 99999)).toBe(1);
  });

  it('should fall back to 1.0 if measured height is NaN or Infinity', () => {
    expect(resolveNativeHeight('/models/foo.glb', NaN)).toBe(1);
    expect(resolveNativeHeight('/models/foo.glb', Infinity)).toBe(1);
  });

  it('should accurately compute scale based on targetHeight and nativeHeight', () => {
    const url = '/models/hub/cyber_orb.glb'; // native 2.008
    const scale = computeScale(url, 4.016, 10.0);
    expect(scale).toBeCloseTo(2.0, 2);
  });
});
