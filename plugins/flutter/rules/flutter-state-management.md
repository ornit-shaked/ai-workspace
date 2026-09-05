---
description: Flutter state management — Bloc/Cubit enforcement
globs: "lib/ui/**/*.dart, test/ui/**/*.dart"
---

# Rule: State Management — Bloc/Cubit

Use `flutter_bloc` (Bloc or Cubit) for all non-trivial state in the UI layer. Do not introduce
Riverpod, GetX, MobX, or `setState` for anything beyond purely local, ephemeral widget state
(e.g. a text field's focus state). `provider` is permitted only for dependency injection of
repositories into the widget tree — not as a state-management pattern in its own right.

- One Bloc/Cubit per feature/screen, not shared globally unless the state is genuinely
  cross-feature.
- Bloc/Cubit states and events are Freezed classes — see [`models.md`](models.md).
- Every Bloc/Cubit ships with `bloc_test` coverage for its state transitions.
- Views consume state via `BlocBuilder`/`BlocListener`/`BlocConsumer`; do not reach into a
  Bloc's internals from a widget.

This overrides the Flutter default of `ChangeNotifier` + `ListenableBuilder`
(see [Flutter AI Rules](https://docs.flutter.dev/ai/ai-rules), which otherwise governs baseline
Flutter/Dart coding standards). Rationale and trade-offs: see `docs/adr/ADR-0001-state-management-bloc.md`.

**Upstream reference:** [Bloc Library](https://bloclibrary.dev) — patterns, `bloc_test`,
`HydratedBloc` (as needed). This rule states the project's choice; it does not duplicate Bloc's
own documentation.
