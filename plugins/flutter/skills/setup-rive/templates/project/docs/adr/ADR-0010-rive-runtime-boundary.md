# ADR-0010: Rive Runtime Boundary

## Context

`ADR-0001-state-management-bloc.md` decided this project uses `flutter_bloc` for all non-trivial
UI state. Adding the Rive animation runtime introduces a third state surface — the Rive state
machine driving a rendered animation — and that surface needs its own ownership line and
disposal contract. This does not reopen ADR-0001.

## Decision

- **State-ownership boundary:** Bloc/Cubit (and Flame, if installed) → a semantic adapter →
  Rive View Model Instance → state machine → rendered animation. The adapter sends semantic
  values (`progress`, `isCorrect`, `status`) into the View Model Instance. Business logic never
  mirrors a whole Bloc state into Rive, and never reads a visual transition back out as business
  truth — Rive is a rendering target, not a source of state.
- **Disposal:** View Model Instances, controllers, files, and listeners are disposed by their
  owner. `RiveWidgetBuilder` handles most of this automatically, but a manually created
  `FileLoader` is disposed explicitly by whoever created it.

Full rules and rationale: the flutter plugin's `rules/rive.md` (plugin-native rule, not a project
file — discovered automatically by Claude Code/Devin, not copied into this project).

## Consequences

- **Easier:** a single, explicit place (the adapter) where Bloc/Flame state turns into Rive
  inputs — no scattered ad hoc `setState`-on-Rive-callback code.
- **Harder:** every value Rive needs must be translated explicitly through the adapter; no
  shortcut of handing a whole Bloc state object to a Rive controller.
- **Forecloses:** using Rive's state machine as a second source of business truth, and skipping
  disposal of manually created `FileLoader`s.

## Source

- `ADR-0001-state-management-bloc.md` — the Bloc decision this ADR extends, not re-decides.
- [Rive Flutter runtime docs](https://rive.app/docs/runtimes/flutter/flutter)
- spec.md D2, D4 (this feature).
