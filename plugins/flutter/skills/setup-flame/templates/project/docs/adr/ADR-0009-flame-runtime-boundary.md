# ADR-0009: Flame Runtime Boundary

## Context

`ADR-0001-state-management-bloc.md` chose Bloc for all non-trivial UI state. Flame introduces a
second runtime loop that needs a state-ownership line against it — this does not reopen "why
Bloc".

## Decision

Bloc/Cubit stays authoritative for durable state; Flame is authoritative for per-frame/transient
state, bridged only through `flame_bloc` (never a custom bridge). Full rules: `rules/flame.md`.

## Consequences

Every durable value a game needs crosses the boundary explicitly through `flame_bloc` — no
implicit shared mutable state between a Bloc and a component.

## Source

`ADR-0001-state-management-bloc.md` · spec.md D1, D3 (this feature).
