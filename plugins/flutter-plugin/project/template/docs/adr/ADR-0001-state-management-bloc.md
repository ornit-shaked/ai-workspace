# ADR-0001: State Management — Bloc/Cubit

## Context

Flutter's official architecture guidance defaults to `ChangeNotifier` + `ListenableBuilder` for
state management, and the official Flutter AI Rules baseline says not to introduce a third-party
state-management package unless explicitly requested. This project explicitly requests one: it
needs an explicit event → state contract and strict, mockable testability across a codebase that
multiple people (and AI agents) will touch concurrently.

## Decision

Use `flutter_bloc` (Bloc or Cubit) for all non-trivial UI state. No Riverpod, GetX, MobX, or
`setState` for anything beyond purely local, ephemeral widget state. `provider` is retained, but
only for dependency injection of repositories — not as a state-management pattern.

## Consequences

- **Easier:** deterministic, testable state transitions (`bloc_test`); consistent pattern across
  every feature; clear separation between "what happened" (event) and "what changed" (state).
- **Harder:** more boilerplate than `ChangeNotifier` for trivial cases; contributors unfamiliar
  with Bloc have a learning curve.
- **Forecloses:** mixing state-management approaches across features — this is the only one.

## Source

- Flutter Architecture Guide, §3.1 — default is `ChangeNotifier`, overridden here.
- Flutter AI Rules, §3.7 — "do not use a third-party package unless explicitly requested"; this
  is that explicit request.
- [Bloc Library](https://bloclibrary.dev), §3.10 — patterns, `bloc_test`, `HydratedBloc`.
- Decision Source Matrix row 17 (Project Override).
