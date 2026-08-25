# Architecture Decision Records

This project records every deviation from Flutter/Dart defaults as an ADR here, so the reasoning
stays auditable instead of living only in someone's memory or a chat log.

## When to write one

Write an ADR when you're about to make a decision that:

- Overrides an official Flutter recommendation or default, or
- Chooses between multiple valid architectural approaches, or
- Would be non-obvious to someone reading the code cold six months from now.

Don't write one for routine implementation choices that follow already-decided conventions —
those belong in code comments or PR descriptions, not a new ADR.

## Format

Each ADR is a short markdown file, numbered sequentially (`ADR-000N-short-title.md`), with four
sections:

- **Context** — what problem or question prompted the decision.
- **Decision** — what was decided, stated plainly.
- **Consequences** — what this makes easier, harder, or forecloses.
- **Source** — the upstream reference and/or prior ADR this builds on or overrides.

## Process

1. Copy the format above into a new numbered file.
2. Never renumber or rewrite an existing ADR's decision — if a decision changes, write a new ADR
   that supersedes it and say so explicitly in both files.
3. Reference the relevant ADR from the agent rule files and project instructions wherever the
   rule it justifies is stated.

See `docs/adr/ADR-0006-adr-process.md` for the full rationale behind this process.

## Index

| ADR | Title |
|---|---|
| [ADR-0001](ADR-0001-state-management-bloc.md) | State Management — Bloc/Cubit |
| [ADR-0002](ADR-0002-freezed-everywhere.md) | Model Strategy — Freezed Everywhere |
| [ADR-0003](ADR-0003-linting-very-good.md) | Linting — very_good_analysis |
| [ADR-0004](ADR-0004-flavors.md) | Flavors — Development / Staging / Production |
| [ADR-0005](ADR-0005-folder-structure.md) | Folder Structure — Compass-Inspired Layered |
| [ADR-0006](ADR-0006-adr-process.md) | ADR Process |
| [ADR-0007](ADR-0007-project-rules.md) | Project Rules |
