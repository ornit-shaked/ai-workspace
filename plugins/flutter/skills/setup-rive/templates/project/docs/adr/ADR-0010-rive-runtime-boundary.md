# ADR-0010: Rive Runtime Boundary

## Context

`ADR-0001-state-management-bloc.md` chose Bloc for all non-trivial UI state. Rive introduces a
third state surface that needs its own ownership and disposal contract — this does not reopen
ADR-0001.

## Decision

Rive is a rendering target, not a source of state: Bloc/Flame state flows one-way into a Rive
View Model Instance through an adapter; a visual transition is never read back as business truth.
Full rules: `rules/rive.md`.

## Consequences

Every value Rive needs is translated explicitly through the adapter — no shortcut of handing a
whole Bloc state object to a Rive controller, and no using Rive's state machine as a second
source of business truth.

## Source

`ADR-0001-state-management-bloc.md` · spec.md D2, D4 (this feature).
