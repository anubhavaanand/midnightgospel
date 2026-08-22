# 3D Asset Status & Download Manifest

> Live tracking of `~/Documents/3D_ASSET_REQUIREMENTS.md` against actual repo inventory.
> Legend: ✅ **IN REPO** · ⬇️ **DOWNLOAD** (URL listed, needs your Sketchfab login) · 🔧 **CUSTOM MODEL** · 🟢 **PROCEDURAL** (code-built, good enough for now)
> Synced with production `8ed6bf0` · last audit 2026-08-22

---

## Current Repo Inventory (17 GLBs shipped)

```
public/models/hub/      clancy_trailer, satellite_dish, cyber_orb, mars_form_gumball,
                        triple_twist_mobius_strip, psx_solar_system
public/models/level1/   white_house_2, zombie_warrior, zombie_dog, kureiji_ollie,
                        opt-cursed_soldier, opt-president_loki
public/models/shared/   deep_space_skybox, mystery_egg, steampunk_plane
public/models/*.glb     island_in_the_space, space_exploration (hub originals)
```

All shipped models pass QA: metalRough materials (three r160 compatible), Draco+WebP optimized, scale constants pinned in `src/lib/modelScales.ts`.

---

## Hub — Chromatic Ribbon

| Asset | Doc requirement | Status | Notes |
|---|---|---|---|
| Mobius ribbon | ✅ Triple Twist Mobius | ✅ **IN REPO** | orbiting halo, hub decorations |
| Clancy's Trailer | ⚠️ Retro Motorhome "needs modding" | ✅ **IN REPO** | 136MB→5MB, parked beside island |
| Satellite dish | ✅ | ✅ **IN REPO** | 30MB→3.1MB |
| VR Simulator Pod | ⚠️ Alien Egg adaptation | 🟡 **mystery_egg stands in** (L2); true yonic pod = 🔧 custom |
| Charlotte the dog | ✅ fan scene / Free3D dogs | ⬇️ **DOWNLOAD** or 🔧 | zombie_dog ≠ Charlotte; she's fluffy-white, black-hole throat |
| Resource orbs | ✅ Glowing Orb | ✅ **IN REPO** | cyber_orb ×3 drifting |

## Level 1 — Earth 4-169

| Asset | Status | Notes |
|---|---|---|
| Beach Body Clancy | ⬇️ **DOWNLOAD** → `public/models/level1/clancy.glb` | https://sketchfab.com/3d-models/clancy-the-midnight-gospel-c183e0cf973d46eaba37c71ebede6e45 (AlejoAlderete) — replaces fuchsia capsule |
| Glasses Man / Pinsky | 🔧 CUSTOM | `opt-president_loki.glb` is a temporary stand-in candidate |
| White House Keep | ✅ **IN REPO** | doc said ❌ custom — we found & shipped one! |
| Zombie hordes | ✅ **IN REPO** | warrior ×8 SkeletonUtils-cloned + dogs ×3 |
| Cure Cannons | 🟢 PROCEDURAL | green emissive pillars |

## Level 2 — Baby Clown Pastures

| Asset | Status |
|---|---|
| Chicken-head wrecking-ball avatar | 🔧 CUSTOM |
| Deer-Dog Annie | 🔧 CUSTOM |
| Slaughterhouse grinder | 🔧 CUSTOM (carousel ring is a stand-in) |
| Baby Clown flocks | ⬇️ **DOWNLOAD** → `public/models/level2/clown_baby.glb` · https://sketchfab.com/3d-models/clown-baby-neighbor-rigged-8c767cf285ac473e9ad66771fcbb247c |
| Clown-Spiders | 🔧 CUSTOM |

## Level 3 — Ass Cream Ocean

| Asset | Status |
|---|---|
| Egg Monkey avatar | ⚠️ Hobbin Constrictor (.stl→glb) or 🔧 |
| Captain Darryl (fishbowl head) | 🔧 CUSTOM |
| Sailor Cat crew | 🔧 CUSTOM (tiny cats procedural on ship already) |
| Wooden Pirate Ship | ⬇️ **DOWNLOAD** → `public/models/level3/pirate_ship.glb` · https://sketchfab.com/3d-models/pirate-ship-rigged-f78e4e29b78c422b8db540459882e601 — replaces procedural cat-ship hull |
| Ritual sigil circles | 🟢 PROCEDURAL (gold emissive rings) |

## Level 4 — Vengeance Kingdom

| Asset | Status |
|---|---|
| Orange Warrior avatar | 🔧 CUSTOM |
| Barbarian Trudy | 🔧 CUSTOM |
| Blood-Rose weapon | 🔧 CUSTOM (healing rose prop exists as relic) |
| Battlefield monoliths | ⬇️ optional · https://sketchfab.com/3d-models/stylized-medieval-room-d4b79ca5e18e4ac19ec0a85aa2322c82 |
| Gothic Throne Room backdrop | ⬇️ **DOWNLOAD** → `public/models/level4/throne_room.glb` · https://sketchfab.com/3d-models/throne-room-c5cb8bdcb92b421bb5d6dccf25a9bdcc |

## Level 5 — Moon R3T8

| Asset | Status |
|---|---|
| Rainbow Entity avatar | 🔧 shader work |
| Jason soul bird | 🔧 CUSTOM (soul-string orbs exist) |
| Shaft & rail-cages | ⬇️ optional · https://sketchfab.com/tags/prison · https://sketchfab.com/3d-models/prisoner-d7378649f56e48e5ae1eeb2ba9e6fbdf |
| Heart-Clock artifact | 🔧 CUSTOM (Bardo scale exists procedurally!) |

## Level 6 — Buton 78914

| Asset | Status |
|---|---|
| Octopus Sheriff | 🔧 CUSTOM (+ cowboy hat: https://sketchfab.com/3d-models/cowboy-hat-free-bd968c68d7b74629a7e062af0842082b) |
| Master David | 🔧 CUSTOM |
| Sanctuary cave set | 🔧 CUSTOM (bowls/lanterns/crystals procedural) |
| Thought totems | 🔧 CUSTOM |

## Level 7 — Planet Blank Ball

| Asset | Status |
|---|---|
| Cream Clancy | ♻️ reuse downloaded Clancy + white material override |
| **Death NPC** | ⬇️ **HIGH VALUE** → `public/models/level7/grim_reaper.glb` · https://sketchfab.com/3d-models/grim-reaper-headless-dark-angel-of-death-aea3aad08ef14897ad9f6eaa6c833ffc · alt: https://sketchfab.com/3d-models/grim-reaper-faceless-death-black-wings-poly-aedbff3928964abb9ebabfdc94c9f435 |
| Titan Turtle shell | ⚠️ https://sketchfab.com/3d-models/hq-turtle-shell-f5b8242e6c1346708a815117d4761e78 + 🔧 industrial add-ons |
| Funeral parlor caskets | 🔧 CUSTOM |
| Chakra symbols | 🟢 PROCEDURAL (light pillars exist) |

## Level 8 — Mouse of Silver

| Asset | Status |
|---|---|
| Aging Clancy | ♻️ reuse Clancy + morph targets |
| Deneen | 🔧 CUSTOM (emotional core of finale) |
| Morphing train car interior | ⬇️ **HIGH VALUE** → `public/models/level8/train_interior.glb` · https://sketchfab.com/3d-models/subway-train-interior-f90d26d89ad44da4af508648f870a816 · https://sketchfab.com/3d-models/space-train-b740878277704ee3af0df058b1aa79da |
| Swirling Red Orb | ⬇️ → `public/models/level8/red_orb.glb` · https://sketchfab.com/3d-models/glowing-orb-glb-file-28db17493a15450e93d2874b19366a02 |
| Memory props (IV, bottles) | 🔧 CUSTOM |

---

## Scoreboard vs Original Doc

| Level | Required | In repo | Downloadable | Custom |
|---|---|---|---|---|
| Hub | 5 | **4** | 0 (Charlotte) | 1 (pod) |
| EP1 | 5 | **3** (WH upgraded from ❌!) | 1 (Clancy) | 1 (Pinsky*) |
| EP2 | 5 | 0 | 1 | 4 |
| EP3 | 5 | 1 | 1 | 3 |
| EP4 | 5 | 0 | 2 | 3 |
| EP5 | 4 | 0 | 1 | 3 |
| EP6 | 4 | 0 | 0 | 4 |
| EP7 | 5 | 0 | 3 | 2 |
| EP8 | 5 | 0 | 3 | 2 |
| **Total** | **43** | **8** | **12** | **23** |

\* president_loki as interim stand-in.

## Download Runbook (after you grab files from Sketchfab)

Drop each file anywhere, then run:

```bash
# 1. Convert legacy spec/gloss materials (Sketchfab exports) — REQUIRED for three r160
~/node/bin/gltf-transform metalrough <downloaded>.glb <output>.glb

# 2. Optimize: Draco + WebP (targets ~95% reduction like our other assets)
~/node/bin/gltf-transform optimize <output>.glb public/models/<level>/<name>.glb \
  --compress draco --texture-compress webp --texture-size 2048

# 3. Measure native height for src/lib/modelScales.ts
~/node/bin/gltf-transform inspect public/models/<level>/<name>.glb | grep bboxMin -A1
```

Then wire into the level's Props file following the `usePreparedModel` pattern (see `src/levels/Episode1/ZombieCapitol.tsx`) and add its native height to `KNOWN_NATIVE_HEIGHTS`.
