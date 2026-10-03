# Flame Profile

This project has the Flame game-engine profile installed via the `setup-flame` skill.

## Prerequisite

The base `setup` skill must have run first — `setup-flame` assumes `lib/` and `pubspec.yaml`
already exist and fails with a clear message otherwise.

## What it installs

- **Folders:** `lib/game/{game,world,components,systems,adapters/bloc,adapters/rive}`,
  `assets/{sprites,audio/music,audio/sfx,audio/voice,tiles}`,
  `test/game/{components,systems,game}`, `integration_test/game`.
- **Dependencies:** `flame`, `flame_bloc` (`dev`: `flame_test`).
- **Docs:** `docs/adr/ui/ADR-0009-flame-runtime-boundary.md` (where the Flame/Bloc line falls, see
  `rules/flame.md`).
- **Example:** `lib/game/game/app_game.dart` (a bare `FlameGame`) and
  `lib/game/components/example_component.dart` (a `PositionComponent` that moves at constant
  velocity), with `test/game/components/example_component_test.dart` proving the component's
  position changes after `game.update(dt)`.

## How to run

```
/flutter:setup-flame
```

Independent of `setup-rive` — install either or both, in either order. Each records its own
section in `.ai-workspace/plugins/flutter.md`, so installing one never affects the other, and
re-running either is idempotent.

## What the example proves

`example_component_test.dart` exercises the real Flame test harness (`testWithFlameGame`,
`flame_test`) end to end: it adds the example component to a game, advances it with an explicit
`game.update(dt)`, and asserts its position actually moved. Once real game logic exists, delete
`app_game.dart`'s example wiring and `example_component.dart`/its test — nothing else in the
scaffolding imports them.

## Using Flame & Rive together

If `setup-rive` is also installed and you want Rive animations rendered inside the Flame world,
use the official `flame_rive` bridge (`RiveComponent`) — do not hand-roll the integration.
`lib/game/adapters/rive/` exists for that adapter code. See `rules/flame.md`'s Rive-integration
note and `docs/adr/ui/ADR-0010-rive-runtime-boundary.md` for where Rive's own state-ownership
line falls.

## Further reading

- `rules/flame.md` (plugin-native rule — lifecycle, Flutter/Flame boundary, state ownership,
  performance, testing; discovered automatically, not copied into this project).
- `docs/adr/ui/ADR-0009-flame-runtime-boundary.md` — why the boundary falls where it does.
