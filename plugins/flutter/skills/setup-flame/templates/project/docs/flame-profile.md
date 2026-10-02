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
  `rules/flame.md`), `docs/flame-rive-integration.md` (adopting Flame and/or Rive together or
  separately — see [the integration guide](flame-rive-integration.md)).
- **Example:** `lib/game/game/app_game.dart` (a bare `FlameGame`) and
  `lib/game/components/example_component.dart` (a `PositionComponent` that moves at constant
  velocity), with `test/game/components/example_component_test.dart` proving the component's
  position changes after `game.update(dt)`.

## How to run

```
/flutter:setup-flame
```

Independent of `setup-rive` — install either or both, in either order.

## What the example proves

`example_component_test.dart` exercises the real Flame test harness (`testWithFlameGame`,
`flame_test`) end to end: it adds the example component to a game, advances it with an explicit
`game.update(dt)`, and asserts its position actually moved. Once real game logic exists, delete
`app_game.dart`'s example wiring and `example_component.dart`/its test — see
`docs/flame-rive-integration.md` for the cleanup note.

## Further reading

- `rules/flame.md` (plugin-native rule — lifecycle, Flutter/Flame boundary, state ownership,
  performance, testing; discovered automatically, not copied into this project).
- `docs/adr/ui/ADR-0009-flame-runtime-boundary.md` — why the boundary falls where it does.
