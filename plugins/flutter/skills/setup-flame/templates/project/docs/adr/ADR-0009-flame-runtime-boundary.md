# ADR-0009: Flame Runtime Boundary

## Context

`ADR-0001-state-management-bloc.md` decided this project uses `flutter_bloc` for all non-trivial
UI state. Adding the Flame game engine introduces a second runtime loop (component
lifecycle/`update`/`render`) alongside Flutter's widget tree, and that second loop needs its own
state-ownership line — it does not reopen "why Bloc": ADR-0001 stands as written.

## Decision

- **Flutter/Flame boundary:** Flutter owns navigation, forms, menus, and overlays. Flame owns
  world simulation, position, collision, camera, and input. `GameWidget` is the only embedding
  point between the two — place Flutter widgets over the game surface via its `overlayBuilderMap`
  (+ `overlays.add`/`.remove`), `loadingBuilder`, `errorBuilder`, and `backgroundBuilder`, never a
  hand-rolled `Stack`/`Positioned` over the game.
- **State ownership:** Bloc/Cubit remains authoritative for durable state (the same state ADR-0001
  already governs); Flame is authoritative for per-frame/transient state (component position,
  velocity, collision results, per-tick game logic). Bridge the two with `flame_bloc`'s own
  widgets (`FlameBlocProvider`, `FlameMultiBlocProvider`, `FlameBlocListener`,
  `FlameBlocListenable`, `FlameBlocReader`) — never a custom bridge.

Full rules and rationale: the flutter plugin's `rules/flame.md` (plugin-native rule, not a
project file — discovered automatically by Claude Code/Devin, not copied into this project).

## Consequences

- **Easier:** a durable-vs-transient split that matches ADR-0001's existing Bloc boundary, so
  Flame code doesn't invent a second state-management convention.
- **Harder:** every durable value a game needs must cross the Bloc↔Flame boundary explicitly
  through `flame_bloc` — no implicit shared mutable state between a Bloc and a component.
- **Forecloses:** game components reading or mutating a Bloc's state directly, and Flutter widgets
  reaching into Flame's component tree outside `GameWidget`'s overlay mechanism.

## Source

- `ADR-0001-state-management-bloc.md` — the Bloc decision this ADR extends, not re-decides.
- [Flame component docs](https://docs.flame-engine.org/latest/flame/components/components.html)
- [flame_bloc docs](https://docs.flame-engine.org/latest/bridge_packages/flame_bloc/bloc.html)
- spec.md D1, D3 (this feature).
