# Rive Profile

This project has the Rive animation-runtime profile installed via the `setup-rive` skill.

## Prerequisite

The base `setup` skill must have run first — `setup-rive` assumes `lib/` and `pubspec.yaml`
already exist and fails with a clear message otherwise.

## ⚠️ Fixture pending

The example widget expects a fixture at `assets/rive/ui/example.riv` exposing a boolean View
Model property named `isActive` on an exported View Model instance. **That fixture is not shipped
yet** — it can only be authored in the Rive Editor or via `rive create`, not generated from code.
Until it is added:

- `lib/ui/rive/widgets/example_rive_widget.dart` installs and analyzes cleanly, but fails at
  runtime when it tries to load the asset.
- `test/rive/widgets/example_rive_widget_test.dart` cannot pass yet.

Separately, Rive widget tests need `rive_native`'s platform library present. A bare
`flutter test` does not always provision it (on Windows it fails with `Failed to load dynamic
library 'rive_native.dll'`) — run them where that library is built, or cover the behavior with an
integration test. See `rules/rive.md`'s testing section.

To finish it: create a single-artboard `.riv` with one state machine and one boolean View Model
property named `isActive` toggling two visibly distinct states, save it to
`assets/rive/ui/example.riv`, and (if contributing upstream) add it to this skill's
`templates/project/assets/rive/ui/` plus its `manifest.json` `project_files`.

## What it installs

- **Folders:** `lib/ui/rive/{widgets,controllers,adapters}`,
  `assets/rive/{characters,ui,effects}`, `test/rive/{widgets,controllers,adapters}`.
  (`rive_projects/` is not created by default — optional, only if the project adopts the Rive
  CLI/Editor authoring workflow.)
- **Dependencies:** `rive`.
- **Docs:** `docs/adr/ui/ADR-0010-rive-runtime-boundary.md` (state-ownership boundary and
  disposal rules, see `rules/rive.md`), `docs/flame-rive-integration.md` (adopting Rive and/or
  Flame together or separately — see [the integration guide](flame-rive-integration.md)).
- **Example:** `lib/ui/rive/widgets/example_rive_widget.dart` (wraps `RiveWidgetBuilder`, loads
  the fixture `assets/rive/ui/example.riv`, drives its boolean input via `RiveWidgetController`/
  Data Binding on a tap), with `test/rive/widgets/example_rive_widget_test.dart` asserting the
  state machine's boolean input actually flips after a simulated tap.

## How to run

```
/flutter:setup-rive
```

Independent of `setup-flame` — install either or both, in either order.

## What the example proves

`example_rive_widget_test.dart` exercises real state-machine/controller behavior, not just the
loading or error path: it simulates a tap, then asserts the fixture's boolean input flipped and
the controller reports the new state. Once real animation content exists, delete
`example_rive_widget.dart`/its test and the fixture `example.riv` — see
`docs/flame-rive-integration.md` for the cleanup note.

## Further reading

- `rules/rive.md` (plugin-native rule — runtime order, state ownership, disposal, renderer
  selection, testing; discovered automatically, not copied into this project).
- `docs/adr/ui/ADR-0010-rive-runtime-boundary.md` — why the boundary falls where it does.
