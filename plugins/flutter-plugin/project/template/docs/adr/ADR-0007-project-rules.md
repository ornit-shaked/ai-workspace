# ADR-0007: Project Rules

## Context

The official [Flutter AI Rules](https://docs.flutter.dev/ai/ai-rules) baseline is generic —
correct for any Flutter project, but silent on this project's specific overrides (Bloc/Cubit,
Freezed Everywhere, `very_good_analysis`, flavors). An agent that only reads the generic baseline
has no way to know those overrides apply here, and would have to be re-prompted with them every
session.

## Decision

Project-specific overrides are enforced at the agent level via `.claude/rules/*.md`, deployed
into this project (not globally — see the "Global vs Project Scope" design principle in the
Flutter Delta plugin's own workspace). `CLAUDE.md`/`AGENTS.md` point to these files and to the
path each one is scoped to. Each rule file states what it overrides and cites the ADR with the
full rationale, rather than restating the upstream baseline.

## Consequences

- **Easier:** an agent reads `CLAUDE.md`, follows the pointers, and gets exactly this project's
  overrides without needing them repeated in every prompt.
- **Harder:** rule files need to stay in sync with the ADRs they cite — an ADR change that isn't
  reflected in the corresponding rule file leaves the agent following stale guidance.
- **Forecloses:** relying on the generic Flutter AI Rules baseline alone for anything this
  project has explicitly overridden.

## Source

- [Flutter AI Rules](https://docs.flutter.dev/ai/ai-rules), §3.7 — the baseline these rules
  override only where stated.
- Decision Source Matrix row 22 (Project Governance).
- ADR-0001, ADR-0002, ADR-0003, ADR-0004 — the specific overrides each rule file documents.
