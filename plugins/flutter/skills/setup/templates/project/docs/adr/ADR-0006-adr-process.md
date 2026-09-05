# ADR-0006: ADR Process

## Context

Every deviation from Flutter defaults in this project (ADR-0001 through ADR-0005, and any future
one) needs to stay auditable — traceable to a reason, not just "that's how it's always been."
Without a stated process, ADRs drift in format and get rewritten in place, losing history.

## Decision

ADRs live in `docs/adr/`, numbered sequentially, in Context / Decision / Consequences / Source
format. They are append-only: an existing ADR's decision is never rewritten. If a decision
changes, a new ADR is written that explicitly supersedes the old one, and the old ADR is updated
to point forward (not deleted or rewritten in place). Full process detail lives in
`docs/adr/README.md` — this ADR exists so the process itself is traceable like every other
decision.

## Consequences

- **Easier:** the decision history stays intact even as decisions change; no ADR is a moving
  target.
- **Harder:** superseding a decision takes two files (new ADR + pointer update in the old one)
  instead of one edit.
- **Forecloses:** silently changing a documented architectural decision without a paper trail.

## Source

- Project Governance — this process itself is a Flutter Delta addition, not sourced from any
  upstream Flutter/Dart documentation.
- Decision Source Matrix row 21 (Project Governance).
