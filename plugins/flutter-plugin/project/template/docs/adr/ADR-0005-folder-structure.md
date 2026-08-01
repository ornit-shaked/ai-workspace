# ADR-0005: Folder Structure — Compass-Inspired Layered

## Context

Upstream architecture guidance describes layering (UI / optional Domain / Data) conceptually but
doesn't scaffold folders — a coding agent starting on an empty project needs a concrete starting
layout before it writes the first feature, or it will invent an ad hoc one that drifts from
whatever the next feature invents.

## Decision

```
lib/
├── config/          — AppConfig, flavor-dependent settings
├── routing/          — go_router route definitions
├── data/
│   ├── repositories/
│   ├── services/
│   └── models/
├── domain/
│   ├── models/
│   └── use_cases/    — optional, add only when justified
└── ui/
    ├── core/
    │   ├── themes/
    │   └── ui/        — shared widgets
    └── features/      — one subfolder per feature
testing/               — shared fakes, used across test suites
```

Type-first for `data/`, feature-first for `ui/features/`.

## Consequences

- **Easier:** every generated project starts from the same layout; an agent (or contributor)
  moving between Flutter Delta projects finds things in the same place every time.
- **Harder:** features that don't cleanly fit one layer (e.g. a `data`-only feature with no UI)
  still need a home decided by convention rather than forced by the folder structure.
- **Forecloses:** ad hoc per-feature folder layouts.

## Source

- [Compass sample app](https://github.com/flutter/samples/tree/main/compass_app), §3.4 — project
  structure and testing-package pattern.
- [Flutter Architecture Case Study](https://docs.flutter.dev/app-architecture/case-study), §3.3 —
  feature/data organization and dependency-flow concepts (not the case-study code itself).
- Decision Source Matrix row 14 (Official Example).
