---
description: Flame game engine — lifecycle, Flutter/Flame boundary, state ownership, performance, testing
paths:
  - "lib/game/**/*.dart"
  - "test/game/**/*.dart"
---

# Rule: Flame Game Engine

Component lifecycle order: `onLoad` → `onGameResize` → `onMount` → `update(dt)`/`render` (loop) →
`onRemove` → `dispose`. (`onGameResize` fires before `onMount`, not after `onRemove` — a common
misreading.)

**Flutter/Flame boundary:**

| Owns | Flutter | Flame |
|---|---|---|
| Navigation, forms, menus, overlays | ✓ | |
| World simulation, position, collision, camera, input | | ✓ |

`GameWidget` is the only embedding point between the two. Use its actual API surface —
`loadingBuilder`, `errorBuilder`, `backgroundBuilder`, `overlayBuilderMap` (+ `overlays.add`/
`.remove`) — to place Flutter widgets over the game surface. Reaching for a hand-rolled
`Stack`/`Positioned` over the game instead of an overlay is the failure mode this rule exists to
prevent.

**State ownership:** Bloc/Cubit is authoritative for durable state; Flame is authoritative for
per-frame/transient state (see [`state-management.md`](state-management.md) and
`docs/adr/ui/ADR-0001-state-management-bloc.md`, which this rule extends into the Flame domain —
it does not re-decide "why Bloc", only where the Flame/Bloc line falls; see
`docs/adr/ui/ADR-00NN-flame-runtime-boundary.md`). Bridge the two with `flame_bloc`'s own
widgets — `FlameBlocProvider`, `FlameMultiBlocProvider`, `FlameBlocListener`, `FlameBlocListenable`,
`FlameBlocReader` — never a custom bridge.

**Performance:** no per-frame allocation; `CollisionType.passive` for static/non-moving hitboxes;
pool recurring short-lived components with `ComponentPool` instead of churn; preload assets in
`onLoad`.

**Testing:** use `flame_test`'s `testWithFlameGame`; advance game state with an explicit
`game.update(dt)`, never a real clock; avoid text rendering in golden tests (font rendering isn't
deterministic across platforms).

**Rive integration:** if Rive is also installed (`setup-rive`), render Rive inside Flame via the
official `flame_rive` bridge — do not hand-roll the integration. `RiveComponent` is a
`PositionComponent` built from an **already-loaded** `Artboard` (plus an optional `StateMachine`),
not from an asset path: load with `flame_rive`'s own
`loadArtboard(file, {artboardName})` in `onLoad`, then pass the result as
`RiveComponent(artboard: ..., stateMachine: ...)`. Verified against flame_rive 1.11.2. See
[`rive.md`](rive.md).

**Tile-based maps:** when a game spec requires tile-based maps (Tiled editor / `.tmx` / JSON grid
layouts), use the official `flame_tiled` bridge package — do not hand-roll a tile renderer. Load
maps with the async `TiledComponent.load(fileName, destTileSize, …)` factory inside a component's
`onLoad`; its default `prefix` is `assets/tiles/`, matching this plugin's folder convention.
`flame_tiled` does not auto-convert Tiled object layers into Flame components — retrieve them with
`getLayer<ObjectGroup>(name)` and instantiate the corresponding components yourself from each
object's position/size. Apply the collision guidance above (`CollisionType.passive`) to static
level geometry built this way; this is standard Flame practice, not a `flame_tiled`-specific API.

**Upstream reference:** [Flame docs](https://docs.flame-engine.org/latest/flame/components/components.html),
[flame_bloc](https://docs.flame-engine.org/latest/bridge_packages/flame_bloc/bloc.html),
[flame_tiled](https://docs.flame-engine.org/latest/bridge_packages/flame_tiled/tiled.html). This
rule states the project's integration choices; it does not duplicate Flame's own documentation.
