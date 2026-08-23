/**
 * Native model heights measured offline via gltf-transform inspect.
 * Skinned meshes return garbage runtime bounding boxes, so we trust
 * these constants over Box3.setFromObject measurements.
 */
export const KNOWN_NATIVE_HEIGHTS: Record<string, number> = {
  '/models/level1/zombie_warrior.glb': 1.149,
  '/models/level1/zombie_dog.glb': 122.496,
  '/models/level1/white_house_2.glb': 17.842,
  '/models/hub/cyber_orb.glb': 2.008,
  '/models/hub/mars_form_gumball.glb': 10.594,
  '/models/hub/triple_twist_mobius_strip.glb': 5.572,
  // Poly Pizza batch (2026-08-22 hunt)
  '/models/level2/clown_baby.glb': 1.507,
  '/models/level3/sail_ship.glb': 6.375,
  '/models/level5/prison_cage.glb': 2.532,
  '/models/level7/grim_reaper.glb': 1.117,
  '/models/level7/turtle.glb': 9.537,
  '/models/level8/tram.glb': 63.946,
  '/models/level8/red_orb.glb': 3.826,
};

const MIN_SANE = 0.05;
const MAX_SANE = 400;

export function resolveNativeHeight(url: string, measuredY: number): number {
  const known = KNOWN_NATIVE_HEIGHTS[url];
  const candidate = known ?? measuredY;
  if (!Number.isFinite(candidate) || candidate < MIN_SANE || candidate > MAX_SANE) {
    return 1;
  }
  return candidate;
}

export function computeScale(url: string, targetHeight: number, measuredY: number): number {
  return targetHeight / resolveNativeHeight(url, measuredY);
}
